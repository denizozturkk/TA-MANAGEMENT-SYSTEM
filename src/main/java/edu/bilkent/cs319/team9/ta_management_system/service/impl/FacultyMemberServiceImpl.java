package edu.bilkent.cs319.team9.ta_management_system.service.impl;

import edu.bilkent.cs319.team9.ta_management_system.dto.DistributionDto;
import edu.bilkent.cs319.team9.ta_management_system.model.*;
import edu.bilkent.cs319.team9.ta_management_system.repository.*;
import edu.bilkent.cs319.team9.ta_management_system.service.*;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class FacultyMemberServiceImpl implements FacultyMemberService {
    private final FacultyMemberRepository facultyMemberRepository;
    private final ExcelFileService excelFileService;
    private final OfferingRepository offeringRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final BusyHourService busyHourService;
    private final ExamService examService;
    private final TAService taService;
    private final ProctorAssignmentService paService;
    private final ExamRoomService examRoomService;

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
    public List<DistributionDto> getRandomStudentDistribution() {
        List<Offering> offerings = offeringRepository.findAll();
        Collections.shuffle(offerings);
        return mapToDto(offerings);
    }

    @Override
    public List<DistributionDto> getAlphabeticalStudentDistribution() {
        List<Offering> offerings = offeringRepository.findAll();
        offerings.sort(Comparator.comparing(off -> off.getCourse().getId()));
        return mapToDto(offerings);
    }

    private List<DistributionDto> mapToDto(List<Offering> offerings) {
        return offerings.stream()
                .map(off -> {
                    List<String> ids = off.getStudents().stream()
                            .map(Student::getId)
                            .map(Object::toString)
                            .collect(Collectors.toList());
                    return new DistributionDto(off.getCourse().getCourseCode(), ids);
                })
                .collect(Collectors.toList());
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
        }

        return result;
    }
}


