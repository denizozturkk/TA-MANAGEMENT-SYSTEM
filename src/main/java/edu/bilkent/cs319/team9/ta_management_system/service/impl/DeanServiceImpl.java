package edu.bilkent.cs319.team9.ta_management_system.service.impl;

import edu.bilkent.cs319.team9.ta_management_system.exception.NotFoundException;
import edu.bilkent.cs319.team9.ta_management_system.model.*;
import edu.bilkent.cs319.team9.ta_management_system.repository.DeanRepository;
import edu.bilkent.cs319.team9.ta_management_system.repository.ReportRequestRepository;
import edu.bilkent.cs319.team9.ta_management_system.service.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class DeanServiceImpl implements DeanService {
    private final DeanRepository repo;
    private final ExamService examService;
    private final TAService taService;
    private final BusyHourService busyHourService;
    private final ProctorAssignmentService paService;
    private final ExamRoomService examRoomService;
    private final ReportRequestRepository reportRequestRepo;
    private final AdminService adminService;
    private final NotificationService notificationService;
    private final JavaMailSender mailSender;

    @Override
    public Dean create(Dean d) {
        return repo.save(d);
    }

    @Override
    @Transactional(readOnly = true)
    public Dean findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Dean", id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Dean> findAll() {
        return repo.findAll();
    }

    @Override
    public Dean update(Long id, Dean d) {
        if (!repo.existsById(id)) throw new NotFoundException("Dean", id);
        d.setId(id);
        return repo.save(d);
    }

    @Override
    public void delete(Long id) {
        repo.deleteById(id);
    }

    @Override
    public List<ProctorAssignment> assignProctors(Long deanId, Long examId) {
        // 0) ensure dean exists
        findById(deanId);

        // 1) load exam and its rooms
        Exam exam = examService.findById(examId);
        List<ExamRoom> rooms = examRoomService.findByExamId(examId);

        // 2) compute exam window
        LocalDateTime start = exam.getDateTime();
        LocalDateTime end = start.plusMinutes((long)(exam.getDuration() * 60));

        List<ProctorAssignment> result = new ArrayList<>();
        Set<Long> chosenTAIds = new HashSet<>();
        String examDept = exam.getDepartment();

        // for each room, fill its seats
        for (ExamRoom er : rooms) {
            Classroom room = er.getClassroom();
            int needed = er.getNumProctors();

            // count already assigned for this room
            long already = paService.findAll().stream()
                    .filter(pa -> pa.getExam().getId().equals(examId))
                    .filter(pa -> pa.getClassroom().getId().equals(room.getId()))
                    .count();

            int toAssign = needed - (int)already;
            if (toAssign <= 0) continue;

            // ==== in-dept candidates ====
            List<TA> inDept = taService.findAll().stream()
                    .filter(ta -> examDept.equals(ta.getDepartment()))
                    .filter(ta -> !chosenTAIds.contains(ta.getId()))
                    .filter(ta -> busyHourService.findByTaId(ta.getId()).stream()
                            .noneMatch(bh -> bh.overlaps(start, end)))
                    .sorted(Comparator.comparing(TA::getTotalWorkload))
                    .collect(Collectors.toList());

            Iterator<TA> itr = inDept.iterator();
            while (toAssign > 0 && itr.hasNext()) {
                TA ta = itr.next();
                chosenTAIds.add(ta.getId());
                result.add(paService.create(ProctorAssignment.builder()
                        .assignedTA(ta)
                        .exam(exam)
                        .classroom(room)
                        .status(ProctorStatus.ASSIGNED)
                        .build()));
                toAssign--;
            }

            // ==== cross-dept fallback ====
            if (toAssign > 0) {
                List<TA> crossDept = taService.findAll().stream()
                        .filter(ta -> !examDept.equals(ta.getDepartment()))
                        .filter(ta -> !chosenTAIds.contains(ta.getId()))
                        .filter(ta -> busyHourService.findByTaId(ta.getId()).stream()
                                .noneMatch(bh -> bh.overlaps(start, end)))
                        .collect(Collectors.toList());

                crossDept.sort(Comparator
                        .comparing(TA::getTotalWorkload)
                        .thenComparing(ta -> ThreadLocalRandom.current().nextInt()));

                itr = crossDept.iterator();
                while (toAssign > 0 && itr.hasNext()) {
                    TA ta = itr.next();
                    chosenTAIds.add(ta.getId());
                    result.add(paService.create(ProctorAssignment.builder()
                            .assignedTA(ta)
                            .exam(exam)
                            .classroom(room)
                            .status(ProctorStatus.ASSIGNED)
                            .build()));
                    toAssign--;
                }
            }
        }

        return result;
    }


    @Override
    public ReportRequest createReportRequest(ReportRequest request) {
        // 1) Validate that the requester exists and is a Dean
        repo.findById(request.getRequesterId())
                .orElseThrow(() -> new EntityNotFoundException("Dean not found: " + request.getRequesterId()));

        // 2) Initialize status and save
        request.setStatus(ReportRequestStatus.PENDING);
        ReportRequest saved = reportRequestRepo.save(request);

        // 3) Look up all admins to notify
        List<Admin> admins = adminService.findAllAdmins();

        // 4) Build notification and email content
        String title = "New Report Request";
        String notifBody = String.format(
                "Dean (ID %d) requested a %s report from %s to %s.",
                saved.getRequesterId(),
                saved.getReportType(),
                saved.getFromTime().toLocalDate(),
                saved.getToTime().toLocalDate()
        );
        String emailSubject = "Action Required: Report Request Pending";
        String emailBody = String.format(
                "Hello Admin,\n\n" +
                        "A new report request has been submitted:\n" +
                        "- Request ID: %d\n" +
                        "- Requested by Dean ID: %d\n" +
                        "- Report Type: %s\n" +
                        "- Period: %s to %s\n\n" +
                        "Please log in to the system to review and approve this request.\n\n" +
                        "Thank you,\n" +
                        "TA Management System",
                saved.getId(),
                saved.getRequesterId(),
                saved.getReportType(),
                saved.getFromTime().toLocalDate(),
                saved.getToTime().toLocalDate()
        );

        // 5) Send in-app notifications and emails to each admin
        for (Admin admin : admins) {
            // In-app notification
            notificationService.notifyUser(
                    admin.getId(),
                    admin.getEmail(),
                    title,
                    notifBody
            );
            // Email
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setTo(admin.getEmail());
            mail.setSubject(emailSubject);
            mail.setText(emailBody);
            mailSender.send(mail);
        }

        return saved;
    }

    @Override
    public List<ReportRequest> findRequestsByRequester(Long deanId) {
        return reportRequestRepo.findAllByRequesterId(deanId);
    }
}
