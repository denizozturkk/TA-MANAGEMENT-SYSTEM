package edu.bilkent.cs319.team9.ta_management_system.repository;

import edu.bilkent.cs319.team9.ta_management_system.model.ReportRequest;
import edu.bilkent.cs319.team9.ta_management_system.model.ReportRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReportRequestRepository  extends JpaRepository<ReportRequest, Long> {
    List<ReportRequest> findByStatusOrderByCreatedAtDesc(ReportRequestStatus status);
    List<ReportRequest> findAllByRequesterId(Long requesterId);
}
