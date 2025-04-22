package edu.bilkent.cs319.team9.ta_management_system.repository;

import edu.bilkent.cs319.team9.ta_management_system.model.LeaveRequest;
import edu.bilkent.cs319.team9.ta_management_system.model.LeaveStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    List<LeaveRequest> findByProctorAssignmentExamFacultyIdAndStatus(
            Long facultyId,
            LeaveStatus status
    );

    /**
     * (Optional) Fetch a specific request by its id *and* ensure it belongs to this faculty.
     */
    Optional<LeaveRequest> findByIdAndProctorAssignmentExamFacultyId(
            Long requestId,
            Long facultyId
    );

}
