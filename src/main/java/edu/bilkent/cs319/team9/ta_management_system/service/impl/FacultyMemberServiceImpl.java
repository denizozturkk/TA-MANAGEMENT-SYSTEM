package edu.bilkent.cs319.team9.ta_management_system.service.impl;

import edu.bilkent.cs319.team9.ta_management_system.model.*;
import edu.bilkent.cs319.team9.ta_management_system.repository.*;
import edu.bilkent.cs319.team9.ta_management_system.service.*;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpStatus;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class FacultyMemberServiceImpl implements FacultyMemberService {
    private final FacultyMemberRepository facultyMemberRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final BusyHourService busyHourService;
    private final ExamService examService;
    private final TAService taService;
    private final ProctorAssignmentService paService;
    private final ExamRoomService examRoomService;
    private final DutyLogRepository dutyLogRepository;
    private final ProctorAssignmentRepository paRepo;
    private final JavaMailSender mailSender;
    private final NotificationService notificationService;


    private static final int LOCAL_UTC_SHIFT_HOURS = 3;

    @Override
    public FacultyMember create(FacultyMember f) {
        return facultyMemberRepository.save(f);
    }

    @Override
    @Transactional(readOnly = true)
    public FacultyMember findById(Long id) {
        return facultyMemberRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "FacultyMember not found with id " + id
                ));
    }

    @Override
    @Transactional(readOnly = true)
    public List<FacultyMember> findAll() {
        return facultyMemberRepository.findAll();
    }

    @Override
    public FacultyMember update(Long id, FacultyMember f) {
        FacultyMember existing = findById(id);
        existing.setDepartment(f.getDepartment());
        return facultyMemberRepository.save(existing);
    }

    @Override
    public void delete(Long id) {
        if (!facultyMemberRepository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "FacultyMember not found with id " + id
            );
        }
        facultyMemberRepository.deleteById(id);
    }

    @Override
    public void assignProctor(Long examId, @NonNull AssignmentType mode, Long taId) {
        switch (mode) {
            case AUTOMATIC_ASSIGNMENT -> assignAutomatically(examId);
            case MANUAL_ASSIGNMENT    -> assignManually(examId, taId);
            default -> throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Unknown assignment mode: " + mode
            );
        }

    }


    @Override
    public LeaveRequest approveLeaveRequest(Long requestId) {
        // 1) Load the request
        LeaveRequest req = leaveRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "No such leave request"
                ));

        // 2) (Optional) Authorization check here…

        // 3) Update status
        req.setStatus(LeaveStatus.ACCEPTED);

        // 3a) Detach & remember the ProctorAssignment so we can delete it
        ProctorAssignment pa = req.getProctorAssignment();
        req.setProctorAssignment(null);

        // 3b) Persist the leave with no more PA reference
        LeaveRequest saved = leaveRequestRepository.save(req);

        // 3c) Now delete the orphaned ProctorAssignment
        if (pa != null) {
            paRepo.deleteById(pa.getId());

            TA ta = saved.getTa();
            LocalDateTime examStart = pa.getExam().getDateTime();
            LocalDateTime examEnd   = examStart.plusMinutes((long)(pa.getExam().getDuration() * 60));

            // apply same manual UTC shift you used when creating it
            LocalDateTime shiftedStart = examStart.minusHours(LOCAL_UTC_SHIFT_HOURS);
            LocalDateTime shiftedEnd   = examEnd.minusHours(LOCAL_UTC_SHIFT_HOURS);

            busyHourService.findByTaId(ta.getId()).stream()
                    .filter(bh -> bh.getStartDateTime().equals(shiftedStart)
                            && bh.getEndDateTime().equals(shiftedEnd))
                    .findFirst()
                    .ifPresent(bh -> busyHourService.delete(bh.getId()));
        }

        // 4) Send in-app notification to the TA
        TA ta = saved.getTa();
        String title = "Leave Request Approved";
        String body = String.format(
                "Your leave request for %s has been approved.",
                saved.getProctorAssignment().getExam().getExamName()
        );
        notificationService.notifyUser(
                ta.getId(),
                ta.getEmail(),
                title,
                body
        );

        return saved;
    }

    @Override
    public LeaveRequest rejectLeaveRequest(Long requestId) {
        // 1) Load the request
        LeaveRequest req = leaveRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "No such leave request"
                ));

        // 2) Update status
        req.setStatus(LeaveStatus.REJECTED);
        LeaveRequest saved = leaveRequestRepository.save(req);

        // 3) Send in-app notification to the TA
        TA ta = saved.getTa();
        String notifTitle = "Leave Request Rejected";
        String notifBody  = String.format(
                "Your leave request for %s has been rejected.",
                saved.getProctorAssignment().getExam().getExamName()
        );
        notificationService.notifyUser(
                ta.getId(),
                ta.getEmail(),
                notifTitle,
                notifBody
        );

        // 4) Send email warning about rejection
        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setTo(ta.getEmail());
        mail.setSubject("Your Leave Request Was Rejected");
        StringBuilder body = new StringBuilder();
        body.append("Hello ").append(ta.getFirstName()).append(",\n\n")
                .append("We’re sorry to inform you that your leave request for ").append(saved.getProctorAssignment().getExam().getExamName())
                .append(" covering ").append(" to ").append(" has been rejected.\n\n")
                .append("Please contact your faculty member if you have any questions.\n\n")
                .append("Best regards,\n").append("The Administration Team");
        mail.setText(body.toString());
        mailSender.send(mail);

        return saved;
    }

    @Override
    public List<LeaveRequest> listLeaveRequests(Long facultyId) {
        return leaveRequestRepository
                .findByProctorAssignmentExamFacultyIdAndStatus(facultyId, LeaveStatus.WAITING_RESPONSE);
    }

    @Override
    public DutyLog uploadDutyLog(Long facultyId,
                                 Long taId,
                                 Offering offering,
                                 MultipartFile file,
                                 DutyType taskType,
                                 Float workload,
                                 LocalDateTime startTime,
                                 LocalDateTime endTime,
                                 Long duration,
                                 DutyStatus status,
                                 Set<Classroom> classrooms) {
        // 1) Verify faculty exists
        FacultyMember faculty = facultyMemberRepository.findById(facultyId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "FacultyMember not found with id " + facultyId
                ));

        // 2) Verify TA exists
        TA ta = taService.findById(taId);
        if (ta == null) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "TA not found with id " + taId
            );
        }


        // 3) Department check
        if (!Objects.equals(faculty.getDepartment(), ta.getDepartment())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    String.format("TA %d is not in the same department as FacultyMember %d", taId, facultyId)
            );
        }

        // 4) Busy-hour conflict check
        if ( taskType == DutyType.LAB || taskType == DutyType.RECITATION ) {
            boolean hasConflict = busyHourService.findByTaId(taId).stream()
                    .anyMatch(bh -> bh.overlaps(startTime, endTime));
            if (hasConflict) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        String.format("TA %d has a scheduling conflict during %s – %s", taId, startTime, endTime)
                );
            }
        }

        boolean hasPdf = file != null && !file.isEmpty();
        if (hasPdf) {
            if (!"application/pdf".equalsIgnoreCase(file.getContentType())) {
                throw new ResponseStatusException(
                        HttpStatus.UNSUPPORTED_MEDIA_TYPE,
                        "Only PDF files are allowed"
                );
            }
        }

        try {
            // 6) Build and save the DutyLog
            DutyLog.DutyLogBuilder builder = DutyLog.builder()
                    .faculty(faculty)
                    .ta(ta)
                    .offering(offering)
                    .dateTime(LocalDateTime.now())
                    .taskType(taskType)
                    .workload(workload)
                    .startTime(startTime)
                    .endTime(endTime)
                    .duration(duration)
                    .status(status)
                    .classrooms(classrooms);

            if (hasPdf) {
                builder
                        .fileName(file.getOriginalFilename())
                        .contentType(file.getContentType())
                        .data(file.getBytes());
            }
            DutyLog dutyLog = dutyLogRepository.save(builder.build());

            // 5) In-app notification
            String notificationTitle = "Duty Assigned";
            String notificationBody = String.format(
                    "You’ve been assigned a %s duty starting at %s, with deadline %s.",
                    taskType, startTime, endTime
            );
            notificationService.notifyUser(
                    ta.getId(),
                    ta.getEmail(),
                    notificationTitle,
                    notificationBody
            );

            // 6) Email with attachment
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(ta.getEmail());
            helper.setSubject("New Duty Assigned: " + taskType);
            StringBuilder body = new StringBuilder();
            body.append("Hello ").append(ta.getFirstName()).append(",\n\n")
                    .append("A new duty has been assigned to you:\n")
                    .append("- Duty Type: ").append(taskType).append("\n")
                    .append("- Start Time: ").append(startTime).append("\n")
                    .append("- Deadline: ").append(endTime).append("\n")
                    .append("- Workload: ").append(workload).append("\n\n")
                    .append("Best regards,\n")
                    .append(faculty.getFirstName());
            helper.setText(body.toString(), false);
            if (hasPdf){
                helper.addAttachment(
                        file.getOriginalFilename(),
                        new ByteArrayResource(file.getBytes()),
                        file.getContentType()
                );
            }

            mailSender.send(message);
            return dutyLog;

        } catch (IOException | MessagingException e) {
            log.error("Error storing PDF or sending email for facultyId={} taId={}", facultyId, taId, e);
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to store PDF in duty log or send notification",
                    e
            );
        }

    }

    @Override
    public DutyLog uploadDutyLogAutomatic(
            Long facultyId,
            Offering offering,
            MultipartFile file,
            DutyType taskType,
            Float workload,
            LocalDateTime startTime,
            LocalDateTime endTime,
            Long duration,
            DutyStatus status,
            Set<Classroom> classrooms) {
        // 1) find faculty
        FacultyMember faculty = facultyMemberRepository.findById(facultyId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "FacultyMember not found with id " + facultyId
                ));

        // 3) pick the first available TA in the same department with the lowest workload
        List<TA> candidates = taService.findAll().stream()
                .filter(ta -> faculty.getDepartment().equals(ta.getDepartment()))
                .filter(ta -> ta.getOfferings().contains(offering))
                .filter(ta -> {
                    if ( taskType == DutyType.LAB || taskType == DutyType.RECITATION ) {
                        // enforce no overlap
                        return busyHourService.findByTaId(ta.getId())
                                .stream()
                                .noneMatch(bh -> bh.overlaps(startTime, endTime));
                    } else {
                        // for other types, always allow
                        return true;
                    }
                })
                .toList();

        if (candidates.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "No available TA found for automatic assignment"
            );
        }

        // 2) find minimum workload
        Float minWorkload = candidates.stream()
                .map(TA::getTotalWorkload)
                .min(Float::compareTo)
                .orElse(0f);

        // 3) select all with that workload
        List<TA> leastLoaded = candidates.stream()
                .filter(ta -> Objects.equals(ta.getTotalWorkload(), minWorkload))
                .toList();

        // 4) within those, exclude any with adjacent‐day busy hours
        List<TA> preferred = leastLoaded.stream()
                .filter(ta -> !hasAdjacentBusyHourConflict(ta, startTime, endTime))
                .toList();

        // final pick
        TA assigned = !preferred.isEmpty()
                ? preferred.get(0)
                : leastLoaded.get(0);

        // 5) delegate to the existing uploadDutyLog
        return uploadDutyLog(
                facultyId,
                assigned.getId(),
                offering,
                file,
                taskType,
                workload,
                startTime,
                endTime,
                duration,
                status,
                classrooms
        );
    }

    /**
     * Manually assigns a single TA to the first available proctor slot for the given exam.
     * @param examId  the ID of the exam to proctor
     * @param taId    the ID of the TA to assign
     * @return        the created ProctorAssignment
     */
    private ProctorAssignment assignManually(Long examId, long taId) {
        // 1) load exam and its rooms
        Exam exam = examService.findById(examId);
        List<ExamRoom> rooms = examRoomService.findByExamId(examId);

        // 2) compute an exam window for conflict checking
        LocalDateTime start = exam.getDateTime();
        LocalDateTime end   = start.plusMinutes((long)(exam.getDuration() * 60));

        // 3) load TA and verify existence
        TA ta = taService.findById(taId);
        if (ta == null) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "No such TA found with id " + taId
            );
        }

        // Department check
        if (!exam.getDepartment().equals(ta.getDepartment())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    String.format("TA %d is not in department %s", taId, exam.getDepartment())
            );
        }

        // 4) check for scheduling conflicts
        boolean hasConflict = busyHourService.findByTaId(taId).stream()
                .anyMatch(bh -> bh.overlaps(start, end));
        if (hasConflict) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "TA with id " + taId + " has a scheduling conflict during the exam window"
            );
        }

        // 5) find the first room that still needs a proctor and assign
        for (ExamRoom er : rooms) {
            Classroom room = er.getClassroom();
            int needed     = er.getNumProctors();

            long alreadyAssigned =
                    paRepo.countByExam_IdAndClassroom_IdAndStatus(
                            examId,
                            room.getId(),
                            ProctorStatus.ASSIGNED);       // count only active slots


            System.out.println(alreadyAssigned);
            System.out.println(needed);

            if (alreadyAssigned < needed) {

                SimpleMailMessage msg = new SimpleMailMessage();
                msg.setTo(ta.getEmail());
                msg.setSubject("You’ve Been Assigned as an Exam Proctor");

                StringBuilder body = new StringBuilder();
                body.append("Hello ").append(ta.getFirstName()).append(" ").append(ta.getLastName()).append(",\n\n")
                        .append("You have been assigned as a proctor for the following exam:\n\n")
                        .append("  • Course: ").append(exam.getExamName()).append("\n")
                        .append("  • Date & Time: ").append(exam.getDateTime()).append("\n")
                        .append("  • Duration: ").append(exam.getDuration()).append(" hrs\n")
                        .append("  • Classroom: ").append(room.getBuilding()).append(" ")
                        .append(room.getRoomNumber()).append("\n\n")
                        .append("Please arrive 10 minutes early and check in at the exam office.\n\n")
                        .append("Thanks,\n")
                        .append("TA Management System");

                msg.setText(body.toString());
                mailSender.send(msg);


                notificationService.notifyUser(
                        ta.getId(),
                        ta.getEmail(),
                        "Proctor Assigned",
                        "You’ve been assigned to proctor the exam on "
                                + exam.getDateTime()
                                + " in room "
                                + room.getBuilding() + " "
                                + room.getRoomNumber()
                );

                ProctorAssignment pa = paService.create(
                        ProctorAssignment.builder()
                                .assignedTA(ta)
                                .exam(exam)
                                .classroom(room)
                                .status(ProctorStatus.ASSIGNED)
                                .build()
                );
                busyHourService.create(busyHourService.makeBusyHour(ta, start, end));
                return pa;
            }
        }

        // 6) if every room is full, complain
        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "All proctor slots are already filled for exam " + examId
        );
    }


    private List<ProctorAssignment> assignAutomatically(Long examId) {

        // 1) load exam and its rooms
        Exam exam = examService.findById(examId);
        List<ExamRoom> rooms = examRoomService.findByExamId(examId);

        // 2) compute an exam window
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
            long already =
                    paRepo.countByExam_IdAndClassroom_IdAndStatus(
                            examId,
                            room.getId(),
                            ProctorStatus.ASSIGNED);

            int toAssign = needed - (int)already;
            if (toAssign <= 0) continue;

            // ==== in-dept candidates ====
            List<TA> inDept = taService.findAll().stream()
                    .filter(ta -> examDept.equals(ta.getDepartment()))
                    .filter(ta -> !chosenTAIds.contains(ta.getId()))
                    .filter(ta -> busyHourService.findByTaId(ta.getId()).stream()
                            .noneMatch(bh -> bh.overlaps(start, end)))
                    .sorted(Comparator
                            .comparing(TA::getTotalWorkload)
                            .thenComparing(ta ->
                                    hasAdjacentBusyHourConflict(ta, start, end)
                            )
                    )
                    .toList();


            Iterator<TA> itr = inDept.iterator();
            while (toAssign > 0 && itr.hasNext()) {
                TA ta = itr.next();
                chosenTAIds.add(ta.getId());
                ProctorAssignment pa = paService.create(ProctorAssignment.builder()
                        .assignedTA(ta)
                        .exam(exam)
                        .classroom(room)
                        .status(ProctorStatus.ASSIGNED)
                        .build());
                result.add(pa);
                toAssign--;

                busyHourService.create(busyHourService.makeBusyHour(ta, start, end));

                SimpleMailMessage msg = new SimpleMailMessage();
                msg.setTo(ta.getEmail());
                msg.setSubject("You’ve Been Assigned as an Exam Proctor");

                StringBuilder body = new StringBuilder();
                body.append("Hello ").append(ta.getFirstName() + " " + ta.getLastName() ).append(",\n\n")
                        .append("You have been assigned as a proctor for the following exam:\n\n")
                        .append("  • Course: ").append(exam.getExamName()).append("\n")
                        .append("  • Date & Time: ").append(exam.getDateTime()).append("\n")
                        .append("  • Duration: ").append(exam.getDuration()).append(" hrs\n")
                        .append("  • Classroom: ").append(room.getBuilding()).append(" ")
                        .append(room.getRoomNumber()).append("\n\n")
                        .append("Please arrive 10 minutes early and check in at the exam office.\n\n")
                        .append("Thanks,\n")
                        .append("TA Management System");

                msg.setText(body.toString());
                mailSender.send(msg);

                notificationService.notifyUser(
                        ta.getId(),
                        ta.getEmail(),
                        "Proctor Assigned",
                        "You’ve been assigned to proctor the exam on "
                                + exam.getDateTime()
                                + " in room "
                                + room.getBuilding() + " "
                                + room.getRoomNumber()
                );
            }
        }
        if (result.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "All proctor slots are already filled for exam " + examId
            );
        }

        return result;
    }


    @Override
    public DutyLog reviewDutyLog(Long facultyId,
                                 Long taId,
                                 Long dutyLogId,
                                 DutyStatus status,
                                 String reason) {
        // 1) Verify faculty exists
        FacultyMember faculty = facultyMemberRepository.findById(facultyId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "FacultyMember not found with id " + facultyId
                ));
        // 2) Verify TA exists
        TA ta = taService.findById(taId);
        if (ta == null) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "TA not found with id " + taId
            );
        }
        // 3) Load DutyLog
        DutyLog dutyLog = dutyLogRepository.findById(dutyLogId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "DutyLog not found with id " + dutyLogId
                ));
        // 4) Check ownership
        if (!dutyLog.getTa().getId().equals(taId)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "DutyLog " + dutyLogId + " does not belong to TA " + taId
            );
        }
        if (!dutyLog.getFaculty().getId().equals(facultyId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "FacultyMember " + facultyId + " not authorized to review this DutyLog"
            );
        }
        // 5) Update status
        dutyLog.setStatus(status);
        dutyLog.setReason(reason);
        DutyLog updatedLog = dutyLogRepository.save(dutyLog);

        // 6) If approved, bump the TA’s workload
        if (status == DutyStatus.APPROVED) {
            Float current = ta.getTotalWorkload() != null ? ta.getTotalWorkload() : 0f;
            ta.setTotalWorkload(current + dutyLog.getWorkload());
            // Persist change (either via TAService or directly via repository)
            taService.update(ta.getId(), ta);  // assume TAService has an update method
        }


        // 7) Send in-app notification to the TA
        String title = (status == DutyStatus.APPROVED)
                ? "Duty Approved"
                : "Duty Rejected";
        String body = (status == DutyStatus.APPROVED)
                ? String.format("Your %s duty has been approved.", dutyLog.getTaskType())
                : String.format("Your %s duty has been rejected. Please contact your instructor.", dutyLog.getTaskType());

        notificationService.notifyUser(
                ta.getId(),
                ta.getEmail(),
                title,
                body
        );

        // 8) If rejected, also send an email warning
        if (status == DutyStatus.REJECTED) {
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setTo(ta.getEmail());
            mail.setSubject("Duty Submission Rejected");
            mail.setText(
                    "Hello " + ta.getFirstName() + ",\n\n" +
                            "Your submission for " + dutyLog.getTaskType() + " with duty ID " + dutyLogId + " has been rejected by "
                            + faculty.getFirstName() + ".\n" +
                            "Please contact your instructor at your earliest convenience.\n\n" +
                            "Best regards,\n" +
                            faculty.getFirstName()
            );
            mailSender.send(mail);
        }
        return updatedLog;
    }


    private boolean hasAdjacentBusyHourConflict(TA ta,
                                                LocalDateTime start,
                                                LocalDateTime end) {
        LocalDateTime prevStart = start.minusDays(1);
        LocalDateTime prevEnd   = end.minusDays(1);
        LocalDateTime nextStart = start.plusDays(1);
        LocalDateTime nextEnd   = end.plusDays(1);

        return busyHourService.findByTaId(ta.getId()).stream()
                .anyMatch(bh ->
                        bh.overlaps(prevStart, prevEnd) ||
                                bh.overlaps(nextStart, nextEnd)
                );
    }
}


