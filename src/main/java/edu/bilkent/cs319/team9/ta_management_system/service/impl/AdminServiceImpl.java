//// src/main/java/edu/bilkent/cs319/team9/ta_management_system/service/impl/AdminServiceImpl.java
//package edu.bilkent.cs319.team9.ta_management_system.service.impl;
//
//import edu.bilkent.cs319.team9.ta_management_system.dto.*;
//import edu.bilkent.cs319.team9.ta_management_system.exception.NotFoundException;
//import edu.bilkent.cs319.team9.ta_management_system.model.ReportRequestStatus;
//import edu.bilkent.cs319.team9.ta_management_system.repository.*;
//import edu.bilkent.cs319.team9.ta_management_system.service.AdminService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.time.LocalDate;
//import java.util.List;
//
//@Service
//@RequiredArgsConstructor
//public class AdminServiceImpl implements AdminService {
//    private final ReportRequestRepository reportRequestRepo;
//    private final LogEntryRepository       logRepo;
//    private final SwapRequestRepository    swapRepo;
//    private final DutyLogRepository        dutyRepo;
//    private final ProctorAssignmentRepository proctorRepo;
//    private final UserRepository           userRepo;
//
//    @Override
//    @Transactional(readOnly = true)
//    public List<ReportRequestDto> getPendingReportRequests() {
//        // TODO: load all report‐requests with status = PENDING
//        return reportRequestRepo.findByStatusOrderByCreatedAtDesc(ReportRequestStatus.PENDING)
//                .stream()
//                .map(ReportRequestDto::fromEntity)
//                .toList();
//    }
//
//    @Override
//    @Transactional
//    public void acceptReportRequest(Long requestId) {
//        var req = reportRequestRepo.findById(requestId)
//                .orElseThrow(() -> new NotFoundException("ReportRequest not found"));
//        req.setStatus(ReportRequestStatus.APPROVED);
//        reportRequestRepo.save(req);
//    }
//
//    @Override
//    @Transactional
//    public void rejectReportRequest(Long requestId) {
//        var req = reportRequestRepo.findById(requestId)
//                .orElseThrow(() -> new NotFoundException("ReportRequest not found"));
//        req.setStatus(ReportRequestStatus.REJECTED);
//        reportRequestRepo.save(req);
//    }
//
//    @Override
//    @Transactional(readOnly = true)
//    public List<LogReportDto> generateLogReports(LocalDate from, LocalDate to) {
//        // TODO: query your audit/log table
//        return logRepo.findBetweenDates(from, to)
//                .stream()
//                .map(LogReportDto::fromEntity)
//                .toList();
//    }
//
//    @Override
//    @Transactional(readOnly = true)
//    public List<LoginReportDto> generateLoginReports(LocalDate from, LocalDate to) {
//        return logRepo.findLoginsBetween(from, to)
//                .stream()
//                .map(LoginReportDto::fromEntity)
//                .toList();
//    }
//
//    @Override
//    @Transactional(readOnly = true)
//    public List<SwapReportDto> generateSwapReports(LocalDate from, LocalDate to) {
//        return swapRepo.findBetweenDates(from, to)
//                .stream()
//                .map(SwapReportDto::fromEntity)
//                .toList();
//    }
//
//    @Override
//    @Transactional(readOnly = true)
//    public List<DutyReportDto> generateDutyReports(LocalDate from, LocalDate to) {
//        return dutyRepo.findBetweenDates(from, to)
//                .stream()
//                .map(DutyReportDto::fromEntity)
//                .toList();
//    }
//
//    @Override
//    @Transactional(readOnly = true)
//    public List<ProctorReportDto> generateProctorReports(LocalDate from, LocalDate to) {
//        return proctorRepo.findBetweenDates(from, to)
//                .stream()
//                .map(ProctorReportDto::fromEntity)
//                .toList();
//    }
//
//    @Override
//    @Transactional
//    public void updateApplication() {
//        // TODO: trigger your deployment pipeline, run migrations, etc.
//    }
//
//    @Override
//    @Transactional
//    public void authorizeActor(AuthorizeActorRequestDto dto) {
//        var user = userRepo.findById(dto.getUserId())
//                .orElseThrow(() -> new NotFoundException("User not found"));
//        user.setRole(dto.getNewRole());
//        userRepo.save(user);
//    }
//}
