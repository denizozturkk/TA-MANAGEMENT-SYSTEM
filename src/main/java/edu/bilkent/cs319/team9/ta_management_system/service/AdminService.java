// src/main/java/edu/bilkent/cs319/team9/ta_management_system/service/AdminService.java
package edu.bilkent.cs319.team9.ta_management_system.service;

import edu.bilkent.cs319.team9.ta_management_system.dto.*;
import edu.bilkent.cs319.team9.ta_management_system.model.Admin;
import edu.bilkent.cs319.team9.ta_management_system.model.FacultyMember;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
public interface AdminService {

    // test
    Admin create(Admin a);

    // --- report requests ---
    List<ReportRequestDto> getPendingReportRequests();
    void acceptReportRequest(Long requestId);
    void rejectReportRequest(Long requestId);

    // --- login / swap / duty / proctor reports ---
    List<LogReportDto> generateLogReports(LocalDateTime from, LocalDateTime to);
    List<SwapReportDto> generateSwapReports(LocalDateTime from, LocalDateTime to);
    List<DutyReportDto> generateDutyReports(LocalDateTime from, LocalDateTime to);
    List<ProctorReportDto> generateProctorReports(LocalDateTime from, LocalDateTime to);

    // --- system management ---
    void updateApplication();   // e.g. pull new release, run migrations, etc.
    void authorizeActor(AuthorizeActorRequestDto dto);
}