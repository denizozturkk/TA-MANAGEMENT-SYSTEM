//// src/main/java/edu/bilkent/cs319/team9/ta_management_system/service/AdminService.java
//package edu.bilkent.cs319.team9.ta_management_system.service;
//
//import edu.bilkent.cs319.team9.ta_management_system.dto.*;
//import java.time.LocalDate;
//import java.util.List;
//
//public interface AdminService {
//    // --- report requests ---
//    List<ReportRequestDto> getPendingReportRequests();
//    void acceptReportRequest(Long requestId);
//    void rejectReportRequest(Long requestId);
//
//    // --- log reports ---
//    List<LogReportDto> generateLogReports(LocalDate from, LocalDate to);
//
//    // --- login / swap / duty / proctor reports ---
//    List<LoginReportDto>    generateLoginReports(LocalDate from, LocalDate to);
//    List<SwapReportDto>     generateSwapReports(LocalDate from, LocalDate to);
//    List<DutyReportDto>     generateDutyReports(LocalDate from, LocalDate to);
//    List<ProctorReportDto>  generateProctorReports(LocalDate from, LocalDate to);
//
//    // --- system management ---
//    void updateApplication();   // e.g. pull new release, run migrations, etc.
//    void authorizeActor(AuthorizeActorRequestDto dto);
//}
