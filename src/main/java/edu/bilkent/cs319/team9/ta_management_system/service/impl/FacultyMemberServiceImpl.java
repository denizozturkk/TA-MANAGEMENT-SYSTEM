package edu.bilkent.cs319.team9.ta_management_system.service.impl;

import edu.bilkent.cs319.team9.ta_management_system.model.*;
import edu.bilkent.cs319.team9.ta_management_system.repository.*;
import edu.bilkent.cs319.team9.ta_management_system.service.*;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import lombok.extern.slf4j.Slf4j;

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
        LeaveRequest req = leaveRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "No such leave request"));
        // authorization check omitted…
        req.setStatus(LeaveStatus.ACCEPTED);
        return leaveRequestRepository.save(req);
    }

    @Override
    public LeaveRequest rejectLeaveRequest(Long requestId) {
        LeaveRequest req = leaveRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "No such leave request"
                ));
        req.setStatus(LeaveStatus.REJECTED);
        return leaveRequestRepository.save(req);
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
                                 Long workload,
                                 LocalDateTime startTime,
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
        LocalDateTime endTime = startTime.plusMinutes(duration);
        boolean hasConflict = busyHourService.findByTaId(taId).stream()
                .anyMatch(bh -> bh.overlaps(startTime, endTime));
        if (hasConflict) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    String.format("TA %d has a scheduling conflict during %s – %s", taId, startTime, endTime)
            );
        }

        // 5) Validate file
        if (file.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Uploaded file is empty"
            );
        }
        if (!"application/pdf".equalsIgnoreCase(file.getContentType())) {
            throw new ResponseStatusException(
                    HttpStatus.UNSUPPORTED_MEDIA_TYPE,
                    "Only PDF files are allowed"
            );
        }

        try {
            // 6) Build and save the DutyLog
            DutyLog dutyLog = DutyLog.builder()
                    .faculty(faculty)
                    .ta(ta)
                    .offering(offering)
                    .dateTime(LocalDateTime.now())
                    .taskType(taskType)
                    .workload(workload)
                    .startTime(startTime)
                    .duration(duration)
                    .status(status)
                    .classrooms(classrooms)

                    // — PDF fields —
                    .fileName(file.getOriginalFilename())
                    .contentType(file.getContentType())
                    .data(file.getBytes())
                    .build();

            return dutyLogRepository.save(dutyLog);

        } catch (IOException e) {
            log.error("Failed to store PDF in DutyLog for facultyId={} taId={}", facultyId, taId, e);
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to store PDF in duty log",
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
            Long workload,
            LocalDateTime startTime,
            Long duration,
            DutyStatus status,
            Set<Classroom> classrooms) {
        // 1) find faculty
        FacultyMember faculty = facultyMemberRepository.findById(facultyId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "FacultyMember not found with id " + facultyId
                ));

        // 2) determine exam window (to avoid conflicts)
        LocalDateTime endTime = startTime.plusMinutes(duration);

        // 3) pick the first available TA in the same department with the lowest workload
        List<TA> candidates = taService.findAll().stream()
                .filter(ta -> faculty.getDepartment().equals(ta.getDepartment()))
                .filter(ta -> ta.getOfferings().contains(offering))
                .filter(ta -> busyHourService.findByTaId(ta.getId()).stream()
                        .noneMatch(bh -> bh.overlaps(startTime, endTime)))
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

        // 2) compute exam window for conflict checking
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

            long alreadyAssigned = paService.findAll().stream()
                    .filter(pa -> pa.getExam().getId().equals(examId))
                    .filter(pa -> pa.getClassroom().getId().equals(room.getId()))
                    .count();

            if (alreadyAssigned < needed) {
                return paService.create(
                        ProctorAssignment.builder()
                                .assignedTA(ta)
                                .exam(exam)
                                .classroom(room)
                                .status(ProctorStatus.ASSIGNED)
                                .build()
                );
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
                result.add(paService.create(ProctorAssignment.builder()
                        .assignedTA(ta)
                        .exam(exam)
                        .classroom(room)
                        .status(ProctorStatus.ASSIGNED)
                        .build()));
                toAssign--;
            }
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


