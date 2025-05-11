package edu.bilkent.cs319.team9.ta_management_system.service.impl;

import edu.bilkent.cs319.team9.ta_management_system.exception.NotFoundException;
import edu.bilkent.cs319.team9.ta_management_system.model.*;
import edu.bilkent.cs319.team9.ta_management_system.repository.BusyHourRepository;
import edu.bilkent.cs319.team9.ta_management_system.repository.SwapRequestRepository;
import edu.bilkent.cs319.team9.ta_management_system.service.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.NoArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class SwapRequestServiceImpl implements SwapRequestService {
    private final SwapRequestRepository swapRequestRepository;
    private final BusyHourRepository busyHourRepository;
    private final ProctorAssignmentService paService;
    private final BusyHourService busyHourService;
    private final TAService taService;
    private final NotificationService notificationService;
    private final JavaMailSender mailSender;

    public SwapRequestServiceImpl(SwapRequestRepository swapRequestRepository, BusyHourRepository busyHourRepository, ProctorAssignmentService paService, BusyHourService busyHourService, TAService taService, NotificationService notificationService, JavaMailSender mailSender) {
        this.swapRequestRepository = swapRequestRepository;
        this.busyHourRepository = busyHourRepository;
        this.paService = paService;
        this.busyHourService = busyHourService;
        this.taService = taService;
        this.notificationService = notificationService;
        this.mailSender = mailSender;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProctorAssignment> findEligibleTargets(Long originalAssignmentId) {
        ProctorAssignment original = paService.findById(originalAssignmentId);
        TA a = original.getAssignedTA();
        String aDept = a.getDepartment();
        // get A's busy slots
        List<BusyHour> aBusy = busyHourService.findByTaId(a.getId());
        LocalDateTime aStart = original.getExam().getDateTime();
        LocalDateTime aEnd   = aStart.plusMinutes((long)(original.getExam().getDuration() * 60));

        // all other assignments
        return paService.findAll().stream()
                .filter(pa -> !pa.getId().equals(originalAssignmentId))
                .filter(pa -> aDept.equals(pa.getAssignedTA().getDepartment()))
                .filter(pa -> {
                    TA b = pa.getAssignedTA();
                    // 1) A must be free at B's exam time
                    LocalDateTime bStart = pa.getExam().getDateTime();
                    LocalDateTime bEnd   = bStart.plusMinutes((long)(pa.getExam().getDuration() * 60));
                    boolean aFreeAtB = aBusy.stream()
                            .noneMatch(bh -> bh.overlaps(bStart, bEnd));

                    // 2) B must be free at A's exam time
                    List<BusyHour> bBusy = busyHourService.findByTaId(b.getId());
                    boolean bFreeAtA = bBusy.stream()
                            .noneMatch(bh -> bh.overlaps(aStart, aEnd));

                    return aFreeAtB && bFreeAtA;
                })
                .collect(Collectors.toList());
    }

    @Override
    public SwapRequest sendSwapRequest(Long originalAssignmentId,
                                       Long targetAssignmentId,
                                       Long requestingTaId) {
        ProctorAssignment original = paService.findById(originalAssignmentId);
        ProctorAssignment target   = paService.findById(targetAssignmentId);
        TA a = original.getAssignedTA();
        TA b = target.getAssignedTA();
        TA requester = taService.findById(requestingTaId);

        // guard: only the TA who owns 'original' may request
        if (!original.getAssignedTA().getId().equals(requester.getId())) {
            throw new NotFoundException("ProctorAssignment", originalAssignmentId);
        }

        if (!a.getDepartment().equals(b.getDepartment())) {
            throw new IllegalArgumentException("Swap only allowed within same department");
        }

        // guard: target must be in the eligible list
        if (findEligibleTargets(originalAssignmentId).stream()
                .noneMatch(pa -> pa.getId().equals(targetAssignmentId))) {
            throw new IllegalArgumentException("Target not eligible");
        }

        SwapRequest req = SwapRequest.builder()
                .ta(requester)
                .proctorAssignment(original)
                .targetProctorAssignment(target)
                .status(SwapStatus.PENDING)
                .requestDate(LocalDateTime.now())
                .build();

        req = swapRequestRepository.save(req);

        // 1) Notify the TARGET TA that a swap was requested
        String titleForTarget = "Swap Request Received";
        String msgForTarget = String.format(
                "TA %s has requested to swap your assignment (ID %d). " +
                        "Please review the request.",
                requester.getFirstName(),
                req.getId()
        );
        notificationService.notifyUser(
                b.getId(),
                b.getEmail(),
                titleForTarget,
                msgForTarget
        );

        // 2) Notify the REQUESTING TA that their request was sent
        String titleForRequester = "Swap Request Sent";
        String msgForRequester = String.format(
                "Your swap request (ID %d) to exchange assignment %d with TA %s has been sent.",
                req.getId(),
                originalAssignmentId,
                b.getFirstName()
        );
        notificationService.notifyUser(
                a.getId(),
                a.getEmail(),
                titleForRequester,
                msgForRequester
        );

        return req;
    }

    @Override
    public SwapRequest respondToSwapRequest(Long swapRequestId, SwapStatus newStatus) {
        SwapRequest req = swapRequestRepository.findById(swapRequestId)
                .orElseThrow(() -> new NotFoundException("SwapRequest", swapRequestId));

        req.setStatus(newStatus);

        // Extract TAs
        TA requester = req.getTa();
        TA target = req.getTargetProctorAssignment().getAssignedTA();

        String title;
        String bodyRequester;
        String bodyTarget;

        if (newStatus == SwapStatus.APPROVED) {
            // Perform the swap
            ProctorAssignment aAssign = req.getProctorAssignment();
            ProctorAssignment bAssign = req.getTargetProctorAssignment();
            TA a = aAssign.getAssignedTA();
            TA b = bAssign.getAssignedTA();

            // Swap Proctor Assignments
            aAssign.setAssignedTA(b);
            bAssign.setAssignedTA(a);
            paService.update(aAssign.getId(), aAssign);
            paService.update(bAssign.getId(), bAssign);

            // Also update BusyHours accordingly
            LocalDateTime examStart = aAssign.getExam().getDateTime();
            float durationHours = aAssign.getExam().getDuration();
            LocalDateTime examEnd = examStart.plusMinutes((long)(durationHours * 60));

            List<BusyHour> aBusyHours = busyHourRepository.findByTAAndTimeRange(a.getId(), examStart, examEnd);
            List<BusyHour> bBusyHours = busyHourRepository.findByTAAndTimeRange(b.getId(), examStart, examEnd);

            for (BusyHour bh : aBusyHours) {
                bh.setTa(b);
                busyHourRepository.save(bh);
            }
            for (BusyHour bh : bBusyHours) {
                bh.setTa(a);
                busyHourRepository.save(bh);
            }

            // Notify both parties
            title = "Swap Request Approved";
            bodyRequester = String.format(
                    "Your swap request (ID %d) has been approved. Your assignment will be swapped with TA %s.",
                    swapRequestId, target.getFirstName());
            bodyTarget = String.format(
                    "Your swap request (ID %d) has been approved. You will swap assignment with TA %s.",
                    swapRequestId, requester.getFirstName());

            notificationService.notifyUser(requester.getId(), requester.getEmail(), title, bodyRequester);
            notificationService.notifyUser(target.getId(), target.getEmail(), title, bodyTarget);

        } else {
            // Rejection handling
            title = "Swap Request Rejected";
            bodyRequester = String.format(
                    "Your swap request (ID %d) has been rejected. Please review and try again if needed.",
                    swapRequestId);
            bodyTarget = String.format(
                    "You have declined swap request (ID %d) from TA %s.",
                    swapRequestId, requester.getFirstName());

            // In-app notifications
            notificationService.notifyUser(requester.getId(), requester.getEmail(), title, bodyRequester);
            notificationService.notifyUser(target.getId(), target.getEmail(), title, bodyTarget);

            // Email notification to requester
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setTo(requester.getEmail());
            mail.setSubject("Swap Request Rejected (ID " + swapRequestId + ")");
            mail.setText("Hello " + requester.getFirstName() + ",\n\n" +
                    "Your swap request (ID " + swapRequestId + ") has been rejected.\n" +
                    "Please log into the system for details or to submit a new request.\n\n" +
                    "Best regards,\nExamination Office");
            mailSender.send(mail);
        }

        return swapRequestRepository.save(req);
    }

    @Override
    public SwapRequest createSwapRequest(SwapRequest swapRequest) {
        return swapRequestRepository.save(swapRequest);
    }

    @Override
    @Transactional(readOnly = true)
    public SwapRequest getSwapRequest(Long id) {
        return swapRequestRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("SwapRequest not found: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<SwapRequest> getAllSwapRequests() {
        return swapRequestRepository.findAll();
    }

    @Override
    public SwapRequest updateSwapRequest(Long id, SwapRequest details) {
        SwapRequest sr = getSwapRequest(id);
        sr.setStatus(details.getStatus());
        sr.setRequestDate(details.getRequestDate());
        sr.setTa(details.getTa());
        sr.setProctorAssignment(details.getProctorAssignment());
        return swapRequestRepository.save(sr);
    }

    @Override
    public void deleteSwapRequest(Long id) {
        SwapRequest sr = getSwapRequest(id);
        swapRequestRepository.delete(sr);
    }
}
