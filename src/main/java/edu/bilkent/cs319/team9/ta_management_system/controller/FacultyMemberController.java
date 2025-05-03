package edu.bilkent.cs319.team9.ta_management_system.controller;

import com.itextpdf.text.DocumentException;
import edu.bilkent.cs319.team9.ta_management_system.dto.ClassroomDistributionDto;
import edu.bilkent.cs319.team9.ta_management_system.dto.DutyLogDto;
import edu.bilkent.cs319.team9.ta_management_system.mapper.EntityMapperService;
import edu.bilkent.cs319.team9.ta_management_system.model.*;
import edu.bilkent.cs319.team9.ta_management_system.repository.ClassroomRepository;
import edu.bilkent.cs319.team9.ta_management_system.repository.OfferingRepository;
import edu.bilkent.cs319.team9.ta_management_system.repository.ExamRepository;
import edu.bilkent.cs319.team9.ta_management_system.service.ClassroomDistributionService;
import edu.bilkent.cs319.team9.ta_management_system.service.FacultyMemberService;
import edu.bilkent.cs319.team9.ta_management_system.service.PdfGeneratorService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.*;

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

    /**
     * Create a new FacultyMember
     */
    @PostMapping
    public ResponseEntity<FacultyMember> create(@RequestBody FacultyMember faculty) {
        FacultyMember created = facultyMemberService.create(faculty);
        return ResponseEntity.ok(created);
    }

    /**
     * Get a FacultyMember by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<FacultyMember> getById(@PathVariable Long id) {
        return ResponseEntity.ok(facultyMemberService.findById(id));
    }

    /**
     * List all FacultyMembers
     */
    @GetMapping
    public ResponseEntity<List<FacultyMember>> getAll() {
        return ResponseEntity.ok(facultyMemberService.findAll());
    }

    /**
     * Update department of an existing FacultyMember
     */
    @PutMapping("/{id}")
    public ResponseEntity<FacultyMember> update(
            @PathVariable Long id,
            @RequestBody FacultyMember faculty
    ) {
        return ResponseEntity.ok(facultyMemberService.update(id, faculty));
    }

    /**
     * Delete a FacultyMember
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        facultyMemberService.delete(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Assign proctors for an exam, based on mode and optional TA selection
     */
    @PostMapping("/{facultyId}/exams/{examId}/proctor")
    public ResponseEntity<ProctorAssignment> assignProctor(
            @PathVariable Long facultyId,
            @PathVariable Long examId,
            @RequestParam AssignmentType mode,
            @RequestParam(required = false) Long taId
    )
    {
        facultyMemberService.assignProctor(examId, mode, taId);
        return ResponseEntity.ok().build();
    }

    /**
     * List pending leave requests for this faculty
     */
    @GetMapping("/{facultyId}/leave-requests")
    public ResponseEntity<List<LeaveRequest>> listLeaveRequests(@PathVariable Long facultyId) {
        return ResponseEntity.ok(facultyMemberService.listLeaveRequests(facultyId));
    }

    /**
     * Approve a specific leave request
     */

    @PostMapping("/leave-requests/{requestId}/approve")
    public ResponseEntity<LeaveRequest> approveLeave(@PathVariable Long requestId) {
        return ResponseEntity.ok(facultyMemberService.approveLeaveRequest(requestId));
    }

    /**
     * Reject a specific leave request
     */
    @PostMapping("/leave-requests/{requestId}/reject")
    public ResponseEntity<LeaveRequest> rejectLeave(@PathVariable Long requestId) {
        return ResponseEntity.ok(facultyMemberService.rejectLeaveRequest(requestId));
    }

    @PostMapping("/{facultyId}/tas/{taId}/duty-logs")
    public ResponseEntity<DutyLogDto> uploadDutyLog(
            @PathVariable Long facultyId,
            @PathVariable Long taId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("taskType") DutyType taskType,
            @RequestParam("workload") Long workload,
            @RequestParam("offeringId") Long offeringId,
            @RequestParam("startTime")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @RequestParam("duration") Long duration,
            @RequestParam("status") DutyStatus status,
            @RequestParam("classroomIds") List<Long> classroomIds
    ) {
        Set<Classroom> classrooms = new HashSet<>( classroomRepository.findAllById(classroomIds) );
        Offering offering = offeringRepository.findById(offeringId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Offering not found with id " + offeringId
                ));

        DutyLog created = facultyMemberService.uploadDutyLog(
                facultyId, taId, offering, file, taskType,
                workload, startTime, duration, status, classrooms
        );
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(mapper.toDto(created));    }

    @PostMapping("/{facultyId}/duty-logs/automatic")
    public ResponseEntity<DutyLogDto> uploadDutyLogAutomatic(
            @PathVariable Long facultyId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("taskType") DutyType taskType,
            @RequestParam("workload") Long workload,
            @RequestParam("offeringId") Long offeringId,
            @RequestParam("startTime")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @RequestParam("duration") Long duration,
            @RequestParam("status") DutyStatus status,
            @RequestParam("classroomIds") List<Long> classroomIds
    ) {
        Set<Classroom> classrooms = new HashSet<>( classroomRepository.findAllById(classroomIds) );
        Offering offering = offeringRepository.findById(offeringId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Offering not found with id " + offeringId
                ));

        DutyLog created = facultyMemberService.uploadDutyLogAutomatic(
                facultyId, offering, file, taskType,
                workload, startTime, duration, status, classrooms
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
        DutyLogDto dto = mapper.toDto(updated);
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
        // 1) Load the Exam (with its Offering→Course, ExamRooms→Classroom, Offering→Students)
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new NoSuchElementException("Exam not found: " + examId));

        // 2) Extract these for the filename
        String courseCode = exam.getOffering().getCourse().getCourseCode();
        String examName   = exam.getExamName();

        // 3) Compute the distribution DTO
        ClassroomDistributionDto dto = distributionService.distribute(examId, random);

        // 4) Generate the PDF bytes
        byte[] pdf;
        try {
            // if random==false then we want alphabetical ordering, so pass !random
            pdf = pdfGeneratorService.generateDistributionPdf(exam, dto, !random);
        } catch (DocumentException e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .build();
        }

        // 5) Return the file, naming it like "CS101_Midterm1.pdf"
        String filename = courseCode + "_" + examName + ".pdf";
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}
