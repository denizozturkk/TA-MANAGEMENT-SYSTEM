package edu.bilkent.cs319.team9.ta_management_system.repository;

import edu.bilkent.cs319.team9.ta_management_system.model.LeaveRequest;
import edu.bilkent.cs319.team9.ta_management_system.model.LeaveStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    List<LeaveRequest> findByProctorAssignmentExamFacultyIdAndStatus(
            Long facultyId,
            LeaveStatus status
    );
    List<LeaveRequest> findAllByTa_Id(Long taId);
    List<LeaveRequest> findByProctorAssignment_Exam_Faculty_Id(Long facultyId);
}
