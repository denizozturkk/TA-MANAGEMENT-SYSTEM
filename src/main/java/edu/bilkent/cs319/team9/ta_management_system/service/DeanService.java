package edu.bilkent.cs319.team9.ta_management_system.service;

import edu.bilkent.cs319.team9.ta_management_system.model.Dean;
import edu.bilkent.cs319.team9.ta_management_system.model.ProctorAssignment;
import edu.bilkent.cs319.team9.ta_management_system.model.ReportRequest;

import java.util.List;

public interface DeanService {
    Dean create(Dean d);
    Dean findById(Long id);
    List<Dean> findAll();
    Dean update(Long id, Dean d);
    void delete(Long id);
    ReportRequest createReportRequest(ReportRequest request);
    List<ReportRequest> findRequestsByRequester(Long deanId);
    /**
     * Auto‐assigns proctors for the given exam across its rooms.
     * First uses same‐department TAs, then cross‐dept fallback.
     */
    List<ProctorAssignment> assignProctors(Long deanId, Long examId);
    void addTaToOffering(Long deanId, Long taId, Long offeringId);
}
