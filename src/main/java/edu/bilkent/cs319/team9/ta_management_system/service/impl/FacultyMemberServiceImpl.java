package edu.bilkent.cs319.team9.ta_management_system.service.impl;

import edu.bilkent.cs319.team9.ta_management_system.model.*;
import edu.bilkent.cs319.team9.ta_management_system.repository.*;
import edu.bilkent.cs319.team9.ta_management_system.service.ExcelFileService;
import edu.bilkent.cs319.team9.ta_management_system.service.FacultyMemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class FacultyMemberServiceImpl implements FacultyMemberService {
    private final FacultyMemberRepository facultyMemberRepository;
    private final ExcelFileService excelFileService;
    private final TARepository taRepository;
    private final OfferingRepository offeringRepository;
    private final ExamRepository examRepository;
    private final ProctorAssignmentRepository proctorAssignmentRepository;
    private final ClassroomRepository classroomRepository;
    private final LeaveRequestRepository leaveRequestRepository;
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
    public void assignProctor(Long examId) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "No such exam found with id " + examId));;
        assignManually(exam, 0);
    }


    @Override
    public void assignAutomatically(Exam exam) {
        int numProctors = Optional.ofNullable(exam.getNumProctors())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Number of proctors not specified for exam " + exam.getId()
                ));

        for (int i = 0; i < numProctors; i++) {
            List<TA> eligible = taRepository.findAll().stream()
                    .filter(ta -> !hasConflict(ta, exam))       // your conflict‐check here
                    .sorted(Comparator.comparing(TA::getTotalWorkload))
                    .toList();

            if (eligible.isEmpty()) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "No available TAs to assign for exam " + exam.getId()
                );
            }

            TA chosen = eligible.get(0);

            ProctorAssignment pa = ProctorAssignment.builder()
                    .exam(exam)
                    .assignedTA(chosen)
                    .status(AssignmentType.AUTOMATIC_ASSIGNMENT.name())
                    .build();
            proctorAssignmentRepository.save(pa);

            float addedLoad = Optional.ofNullable(exam.getDuration()).orElse(0f);
            chosen.setTotalWorkload(chosen.getTotalWorkload() + addedLoad);
            taRepository.save(chosen);
        }
    }

    private boolean hasConflict(TA ta, Exam exam) {
        // TA classindaki conflict checkini sadece exam parametresiyle cagirip sonucu dondurecek
        return false;
    }


    @Override
    public void assignManually(Exam exam, long taID) {
        Optional<TA> taTemp = taRepository.findById(taID);
        if (taTemp.isPresent()) {
            TA ta = taTemp.get();
            ProctorAssignment proctorAssignment = new ProctorAssignment();
            proctorAssignment.setExam(exam);
            proctorAssignment.setAssignedTA(ta);
            proctorAssignmentRepository.save(proctorAssignment);

            //Buraya taIdsi verilen ta e proctoring assignment ekleyen method gelecek
            taRepository.save(ta);

            }
        else{
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No such TA found with id " + taID);
        }
    }

    @Override
    public void printStudentDistribution() {
        System.out.println("Student Distribution (Alphabetical by offering):");
        printAlphabetically();
    }

    @Override
    public void printRandomly() {
        List<Offering> offerings = offeringRepository.findAll();
        Collections.shuffle(offerings);
        offerings.forEach(off -> {
            String tas = off.getTas().stream()
                    .map(TA::getId)
                    .map(Object::toString)
                    .collect(Collectors.joining(", "));
            System.out.println(off.getCourse().getCourseID() + " -> [" + tas + "]");
        });
    }

    @Override
    public void printAlphabetically() {
        List<Offering> offerings = offeringRepository.findAll();
        offerings.sort(Comparator.comparing(off -> off.getCourse().getCourseID()));
        offerings.forEach(off -> {
            String tas = off.getTas().stream()
                    .map(TA::getId)
                    .map(Object::toString)
                    .collect(Collectors.joining(", "));
            System.out.println(off.getCourse().getCourseID() + " -> [" + tas + "]");
        });
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
    public ResponseEntity<?> uploadExcelFile(MultipartFile file) {
        try {
            Long uploadId = excelFileService.store(file);
            return ResponseEntity.ok(Map.of("uploadId", uploadId));
        } catch (IOException e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to store file: " + e.getMessage(), e
            );
        }
    }
}
