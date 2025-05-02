package edu.bilkent.cs319.team9.ta_management_system.controller;

import edu.bilkent.cs319.team9.ta_management_system.dto.ClassroomDistributionDto;
import edu.bilkent.cs319.team9.ta_management_system.dto.DistributionDto;
import edu.bilkent.cs319.team9.ta_management_system.mapper.EntityMapperService;
import edu.bilkent.cs319.team9.ta_management_system.model.*;
import edu.bilkent.cs319.team9.ta_management_system.repository.ClassroomRepository;
import edu.bilkent.cs319.team9.ta_management_system.service.ClassroomDistributionService;
import edu.bilkent.cs319.team9.ta_management_system.service.FacultyMemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.itextpdf.text.DocumentException;
import edu.bilkent.cs319.team9.ta_management_system.service.PdfGeneratorService;

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
    @GetMapping(
            path = "/{facultyId}/exams/{examId}/distribution/pdf",
            produces = MediaType.APPLICATION_PDF_VALUE
    )
    public ResponseEntity<byte[]> downloadDistributionPdf(
            @PathVariable Long facultyId,
            @PathVariable Long examId,
            @RequestParam(defaultValue = "false") boolean random
    ) {
        ClassroomDistributionDto dto = distributionService.distribute(examId, random);
        try {
            byte[] pdf = pdfGeneratorService.generateDistributionPdf(dto);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=distribution_exam_" + examId + ".pdf")
                    .body(pdf);
        } catch (DocumentException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}