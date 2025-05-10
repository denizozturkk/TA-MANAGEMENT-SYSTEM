package edu.bilkent.cs319.team9.ta_management_system.controller;

import com.itextpdf.text.DocumentException;
import edu.bilkent.cs319.team9.ta_management_system.dto.*;
import edu.bilkent.cs319.team9.ta_management_system.mapper.EntityMapperService;
import edu.bilkent.cs319.team9.ta_management_system.model.*;
import edu.bilkent.cs319.team9.ta_management_system.repository.ClassroomRepository;
import edu.bilkent.cs319.team9.ta_management_system.repository.OfferingRepository;
import edu.bilkent.cs319.team9.ta_management_system.repository.ExamRepository;
import edu.bilkent.cs319.team9.ta_management_system.service.ClassroomDistributionService;
import edu.bilkent.cs319.team9.ta_management_system.service.ExcelImportService;
import edu.bilkent.cs319.team9.ta_management_system.service.FacultyMemberService;
import edu.bilkent.cs319.team9.ta_management_system.service.PdfGeneratorService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/faculty-members")
@RequiredArgsConstructor
public class FacultyMemberController {

    private final FacultyMemberService facultyMemberService;
    private final EntityMapperService mapper;
    private final ClassroomRepository classroomRepository;
    private final ClassroomDistributionService distributionService;
    private final PdfGeneratorService pdfGeneratorService;
    private final OfferingRepository offeringRepository;
    private final ExamRepository examRepository;

    @PostMapping
    public ResponseEntity<FacultyMemberDto> create(@RequestBody FacultyMemberDto dto) {
        FacultyMember fm = facultyMemberService.create(mapper.toEntity(dto));
        return new ResponseEntity<>(mapper.toDto(fm), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FacultyMemberDto> getById(@PathVariable Long id) {
        FacultyMember fm = facultyMemberService.findById(id);
        return ResponseEntity.ok(mapper.toDto(fm));
    }

    @GetMapping
    public ResponseEntity<List<FacultyMemberDto>> getAll() {
        List<FacultyMemberDto> list = facultyMemberService.findAll().stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FacultyMemberDto> update(
            @PathVariable Long id,
            @RequestBody FacultyMemberDto dto
    ) {
        FacultyMember fm = facultyMemberService.update(id, mapper.toEntity(dto));
        return ResponseEntity.ok(mapper.toDto(fm));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        facultyMemberService.delete(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Assign proctors for an exam, based on mode and optional TA selection
     */
    @PostMapping("/{facultyId}/exams/{examId}/proctor")
    public ResponseEntity<Void> assignProctor(
            @PathVariable Long facultyId,
            @PathVariable Long examId,
            @RequestParam AssignmentType mode,
            @RequestParam(required = false) Long taId
    ) {
        facultyMemberService.assignProctor(examId, mode, taId);
        return ResponseEntity.ok().build();
    }

    /**
     * List pending leave requests for this faculty (now returns DTOs)
     */
    @GetMapping("/{facultyId}/leave-requests")
    public ResponseEntity<List<LeaveRequestDto>> listLeaveRequests(@PathVariable Long facultyId) {
        List<LeaveRequestDto> dtos = facultyMemberService
                .listLeaveRequests(facultyId)
                .stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    /**
     * Approve a specific leave request (returns DTO)
     */
    @PostMapping("/leave-requests/{requestId}/approve")
    public ResponseEntity<LeaveRequestDto> approveLeave(@PathVariable Long requestId) {
        LeaveRequest lr = facultyMemberService.approveLeaveRequest(requestId);
        return ResponseEntity.ok(mapper.toDto(lr));
    }

    /**
     * Reject a specific leave request (returns DTO)
     */
    @PostMapping("/leave-requests/{requestId}/reject")
    public ResponseEntity<LeaveRequestDto> rejectLeave(@PathVariable Long requestId) {
        LeaveRequest lr = facultyMemberService.rejectLeaveRequest(requestId);
        return ResponseEntity.ok(mapper.toDto(lr));
    }

    @PostMapping("/{facultyId}/tas/{taId}/duty-logs")
    public ResponseEntity<DutyLogDto> uploadDutyLog(
            @PathVariable Long facultyId,
            @PathVariable Long taId,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam("taskType") DutyType taskType,
            @RequestParam("workload") Float workload,
            @RequestParam("offeringId") Long offeringId,
            @RequestParam("startTime")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @RequestParam("endTime")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime,
            @RequestParam("duration") Long duration,
            @RequestParam("status") DutyStatus status,
            @RequestParam(value = "classroomIds", required = false) List<Long> classroomIds
    ) {
        Set<Classroom> classrooms =
                (classroomIds == null || classroomIds.isEmpty())
                        ? Collections.emptySet()
                        : new HashSet<>( classroomRepository.findAllById(classroomIds) );
        Offering offering = offeringRepository.findById(offeringId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Offering not found with id " + offeringId
                ));

        DutyLog created = facultyMemberService.uploadDutyLog(
                facultyId, taId, offering, file, taskType,
                workload, startTime, endTime, duration, status, classrooms
        );
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(mapper.toDto(created));
    }

    @PostMapping("/{facultyId}/duty-logs/automatic")
    public ResponseEntity<DutyLogDto> uploadDutyLogAutomatic(
            @PathVariable Long facultyId,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam("taskType") DutyType taskType,
            @RequestParam("workload") Float workload,
            @RequestParam("offeringId") Long offeringId,
            @RequestParam("startTime")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @RequestParam("endTime")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime,
            @RequestParam("duration") Long duration,
            @RequestParam("status") DutyStatus status,
            @RequestParam(value = "classroomIds", required = false) List<Long> classroomIds
    ) {
        Set<Classroom> classrooms = (classroomIds == null)
                           ? Collections.emptySet()
                           : new HashSet<>( classroomRepository.findAllById(classroomIds) );
        Offering offering = offeringRepository.findById(offeringId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Offering not found with id " + offeringId
                ));

        DutyLog created = facultyMemberService.uploadDutyLogAutomatic(
                facultyId, offering, file, taskType,
                workload, startTime, endTime, duration, status, classrooms
        );
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(mapper.toDto(created));
    }

    @PostMapping("/{facultyId}/tas/{taId}/duty-logs/{dutyLogId}/review")
    public ResponseEntity<DutyLogDto> reviewDutyLog(
            @PathVariable Long facultyId,
            @PathVariable Long taId,
            @PathVariable Long dutyLogId,
            @RequestParam DutyStatus status,
            @RequestParam(required = false) String reason ) {
        DutyLog updated = facultyMemberService.reviewDutyLog(facultyId, taId, dutyLogId, status, reason);
        return ResponseEntity.ok(mapper.toDto(updated));
    }

    @GetMapping("/{facultyId}/exams/{examId}/distribution")
    public ResponseEntity<ClassroomDistributionDto> getDistributionList(
            @PathVariable Long facultyId,
            @PathVariable Long examId,
            @RequestParam(defaultValue = "false") boolean random
    ) {
        ClassroomDistributionDto dto = distributionService.distribute(examId, random);
        return ResponseEntity.ok(dto);
    }

    @GetMapping(
            path = "/{facultyId}/exams/{examId}/distribution/pdf",
            produces = MediaType.APPLICATION_PDF_VALUE
    )
    public ResponseEntity<byte[]> downloadDistributionPdf(
            @PathVariable Long facultyId,
            @PathVariable Long examId,
            @RequestParam(defaultValue = "false") boolean random
    ) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new NoSuchElementException("Exam not found: " + examId));

        String courseCode = exam.getOffering().getCourse().getCourseCode();
        String examName   = exam.getExamName();
        ClassroomDistributionDto dto = distributionService.distribute(examId, random);

        byte[] pdf;
        try {
            pdf = pdfGeneratorService.generateDistributionPdf(exam, dto, !random);
        } catch (DocumentException e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .build();
        }

        String filename = courseCode + "_" + examName + ".pdf";
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }


    @GetMapping("/{facultyId}/exams")
    public ResponseEntity<List<ExamDto>> getExamsByFaculty(@PathVariable Long facultyId) {
        List<ExamDto> dtos = examRepository
                .findAllByFaculty_Id(facultyId)
                .stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
}