package edu.bilkent.cs319.team9.ta_management_system.service;

import edu.bilkent.cs319.team9.ta_management_system.model.AssignmentType;
import edu.bilkent.cs319.team9.ta_management_system.model.Exam;
import edu.bilkent.cs319.team9.ta_management_system.model.FacultyMember;
import edu.bilkent.cs319.team9.ta_management_system.model.LeaveRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface FacultyMemberService {
    FacultyMember create(FacultyMember f);
    FacultyMember findById(Long id);
    List<FacultyMember> findAll();
    FacultyMember update(Long id, FacultyMember f);
    void delete(Long id);


    void assignProctor(Long examId);

    void assignAutomatically(Exam exam);
    void assignManually(Exam exam, long taID);
    void printStudentDistribution();
    void printRandomly();
    void printAlphabetically();
    LeaveRequest approveLeaveRequest(Long requestId);
    LeaveRequest rejectLeaveRequest(Long requestId);
    List<LeaveRequest> listLeaveRequests(Long facultyId);

    ResponseEntity<?> uploadExcelFile(@RequestParam("file") MultipartFile file);
}