package edu.bilkent.cs319.team9.ta_management_system.repository;

import edu.bilkent.cs319.team9.ta_management_system.model.DutyExtensionRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DutyExtensionRequestRepository extends JpaRepository<DutyExtensionRequest, Long> {
    List<DutyExtensionRequest> findByInstructorId(Long instructorId);
    List<DutyExtensionRequest> findByTaId(Long taId);
}
