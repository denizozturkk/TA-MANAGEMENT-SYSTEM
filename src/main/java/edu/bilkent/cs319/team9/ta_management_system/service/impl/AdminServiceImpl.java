// src/main/java/edu/bilkent/cs319/team9/ta_management_system/service/impl/AdminServiceImpl.java
package edu.bilkent.cs319.team9.ta_management_system.service.impl;

import com.itextpdf.text.log.Logger;
import com.itextpdf.text.log.LoggerFactory;
import edu.bilkent.cs319.team9.ta_management_system.dto.*;
import edu.bilkent.cs319.team9.ta_management_system.exception.NotFoundException;
import edu.bilkent.cs319.team9.ta_management_system.model.*;
import edu.bilkent.cs319.team9.ta_management_system.repository.*;
import edu.bilkent.cs319.team9.ta_management_system.service.AdminService;
import edu.bilkent.cs319.team9.ta_management_system.service.NotificationService;
import edu.bilkent.cs319.team9.ta_management_system.service.PdfGeneratorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {
    private final ReportRequestRepository reportRequestRepo;
    private final LogEntryRepository       logRepo;
    private final SwapRequestRepository    swapRepo;
    private final DutyLogRepository        dutyRepo;
    private final ProctorAssignmentRepository proctorRepo;
    private final UserRepository           userRepo;
    private final DeanRepository deanRepository;
    private final NotificationService notificationService;
    private final PdfGeneratorService pdfGeneratorService;
    private final OfferingRepository offeringRepo;


    private final AdminRepository repo;

    private static final Logger log = LoggerFactory.getLogger(AdminServiceImpl.class);

    //test
    @Override
    public Admin create(Admin a) {
        return repo.save(a);
    }
    ///

    @Override
    @Transactional(readOnly = true)
    public List<ReportRequestDto> getPendingReportRequests() {
        return reportRequestRepo.findByStatusOrderByCreatedAtDesc(ReportRequestStatus.PENDING)
                .stream()
                .map(ReportRequestDto::fromEntity)
                .toList();
    }

    @Override
    @Transactional
    public void acceptReportRequest(Long requestId) {
        var req = reportRequestRepo.findById(requestId)
                .orElseThrow(() -> new NotFoundException("ReportRequest not found"));
        req.setStatus(ReportRequestStatus.APPROVED);
        reportRequestRepo.save(req);

        if(req.getReportType() == ReportType.DUTY)
        {
            generateDutyReports(req.getFromTime(), req.getToTime());
        }
        else if(req.getReportType() == ReportType.PROCTOR)
        {
            generateProctorReports(req.getFromTime(), req.getToTime());
        }
        else if(req.getReportType() == ReportType.LOG)
        {
            generateLogReports(req.getFromTime(), req.getToTime());
        }
        else
        {
            generateSwapReports(req.getFromTime(), req.getToTime());
        }

        Dean dean = deanRepository.findById(req.getRequesterId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Dean not found: " + req.getRequesterId()));

        String title = "Report Request Approved";
        String body  = String.format(
                "Your report request (ID %d) for %s from %s to %s has been approved and generated.",
                req.getId(),
                req.getReportType(),
                req.getFromTime().toLocalDate(),
                req.getToTime().toLocalDate()
        );

        notificationService.notifyUser(
                dean.getId(),
                dean.getEmail(),
                title,
                body
        );

    }

    @Override
    @Transactional
    public void rejectReportRequest(Long requestId) {
        var req = reportRequestRepo.findById(requestId)
                .orElseThrow(() -> new NotFoundException("ReportRequest not found"));
        req.setStatus(ReportRequestStatus.REJECTED);
        reportRequestRepo.save(req);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LogReportDto> generateLogReports(LocalDateTime from, LocalDateTime to) {
        return logRepo.findByTimestampBetween(from, to)
                .stream()
                .map(LogReportDto::fromEntity)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<SwapReportDto> generateSwapReports(LocalDateTime from, LocalDateTime to) {
        return swapRepo.findByRequestDateBetween(from, to)
                .stream()
                .map(SwapReportDto::fromEntity)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<DutyReportDto> generateDutyReports(LocalDateTime from, LocalDateTime to) {
        return dutyRepo.findByDateTimeBetween(from, to)
                .stream()
                .map(DutyReportDto::fromEntity)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProctorReportDto> generateProctorReports(LocalDateTime from, LocalDateTime to) {
        List<ProctorAssignment> list = proctorRepo.findByExam_DateTimeBetween(from, to);
        System.out.println(">> generateProctorReports called with from=" + from
                + ", to=" + to + "; found " + list.size() + " assignments");
        return list.stream()
                .map(ProctorReportDto::fromEntity)
                .toList();
    }


    @Override
    @Transactional
    public void updateApplication() {
        // TODO: trigger your deployment pipeline, run migrations, etc.
    }

    @Override
    @Transactional
    public void authorizeActor(AuthorizeActorRequestDto dto) {
        var user = userRepo.findById(dto.getUserId())
                .orElseThrow(() -> new NotFoundException("User not found"));
        user.setRole(dto.getNewRole());
        userRepo.save(user);
    }

    @Override
    public List<Admin> findAllAdmins() {
        return repo.findAll();
    }

    @Override
    @Transactional
    public void deleteUserById(Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found with id: " + userId));

        // if it’s a TA, remove it from every Offering first
        if (user instanceof TA) {
            TA ta = (TA) user;
            // detach from each Offering
            for (Offering o : new ArrayList<>(ta.getOfferings())) {
                o.getTas().remove(ta);
                offeringRepo.save(o);
            }
        }
        else if (user instanceof FacultyMember) {
            FacultyMember fm = (FacultyMember) user;
            // find all offerings taught by this faculty
            List<Offering> list = offeringRepo.findByInstructor(fm);
            for (Offering o : list) {
                o.setInstructor(null);
                offeringRepo.save(o);
            }
        }

        // now it’s safe to delete the user row (and its subclass TA row)
        userRepo.delete(user);
    }


    @Override public byte[] logReportPdf(LocalDateTime from, LocalDateTime to)
            throws com.itextpdf.text.DocumentException {
        return pdfGeneratorService.generateLogReportPdf(generateLogReports(from, to));
    }
    @Override public byte[] swapReportPdf(LocalDateTime from, LocalDateTime to)
            throws com.itextpdf.text.DocumentException {
        return pdfGeneratorService.generateSwapReportPdf(generateSwapReports(from, to));
    }
    @Override public byte[] dutyReportPdf(LocalDateTime from, LocalDateTime to)
            throws com.itextpdf.text.DocumentException {
        return pdfGeneratorService.generateDutyReportPdf(generateDutyReports(from, to));
    }
    @Override public byte[] proctorReportPdf(LocalDateTime from, LocalDateTime to)
            throws com.itextpdf.text.DocumentException {
        return pdfGeneratorService.generateProctorReportPdf(generateProctorReports(from, to));
    }


}
