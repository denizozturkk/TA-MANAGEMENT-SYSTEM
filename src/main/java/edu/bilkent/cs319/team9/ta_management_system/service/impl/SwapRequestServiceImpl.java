package edu.bilkent.cs319.team9.ta_management_system.service.impl;

import edu.bilkent.cs319.team9.ta_management_system.exception.NotFoundException;
import edu.bilkent.cs319.team9.ta_management_system.model.*;
import edu.bilkent.cs319.team9.ta_management_system.repository.SwapRequestRepository;
import edu.bilkent.cs319.team9.ta_management_system.service.BusyHourService;
import edu.bilkent.cs319.team9.ta_management_system.service.ProctorAssignmentService;
import edu.bilkent.cs319.team9.ta_management_system.service.SwapRequestService;
import edu.bilkent.cs319.team9.ta_management_system.service.TAService;
import jakarta.persistence.EntityNotFoundException;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class SwapRequestServiceImpl implements SwapRequestService {
    private final SwapRequestRepository swapRequestRepository;
    private final ProctorAssignmentService paService;
    private final BusyHourService busyHourService;
    private final TAService taService;

    public SwapRequestServiceImpl(SwapRequestRepository swapRequestRepository, ProctorAssignmentService paService, BusyHourService busyHourService, TAService taService) {
        this.swapRequestRepository = swapRequestRepository;
        this.paService = paService;
        this.busyHourService = busyHourService;
        this.taService = taService;
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

        return swapRequestRepository.save(req);
    }

    @Override
    public SwapRequest respondToSwapRequest(Long swapRequestId, SwapStatus newStatus) {
        SwapRequest req = swapRequestRepository.findById(swapRequestId)
                .orElseThrow(() -> new NotFoundException("SwapRequest", swapRequestId));

        req.setStatus(newStatus);

        if (newStatus == SwapStatus.APPROVED) {
            // perform the swap
            ProctorAssignment aAssign = req.getProctorAssignment();
            ProctorAssignment bAssign = req.getTargetProctorAssignment();
            TA a = aAssign.getAssignedTA();
            TA b = bAssign.getAssignedTA();

            aAssign.setAssignedTA(b);
            bAssign.setAssignedTA(a);
            paService.update(aAssign.getId(), aAssign);
            paService.update(bAssign.getId(), bAssign);
            // you may also want to adjust TA workloads here
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
