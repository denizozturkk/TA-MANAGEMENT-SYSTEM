package edu.bilkent.cs319.team9.ta_management_system.controller;

import edu.bilkent.cs319.team9.ta_management_system.dto.CoordinatorDto;
import edu.bilkent.cs319.team9.ta_management_system.mapper.EntityMapperService;
import edu.bilkent.cs319.team9.ta_management_system.model.Coordinator;
import edu.bilkent.cs319.team9.ta_management_system.service.CoordinatorService;
import edu.bilkent.cs319.team9.ta_management_system.service.ExcelImportService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/coordinators")
@RequiredArgsConstructor
public class CoordinatorController {
    private final CoordinatorService service;
    private final EntityMapperService mapper;

    @PostMapping
    public ResponseEntity<CoordinatorDto> create(@RequestBody CoordinatorDto dto) {
        Coordinator c = service.create(mapper.toEntity(dto));
        return new ResponseEntity<>(mapper.toDto(c), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CoordinatorDto> getById(@PathVariable Long id) {
        Coordinator c = service.findById(id);
        return ResponseEntity.ok(mapper.toDto(c));
    }

    @GetMapping
    public ResponseEntity<List<CoordinatorDto>> getAll() {
        List<CoordinatorDto> list = service.findAll().stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CoordinatorDto> update(
            @PathVariable Long id,
            @RequestBody CoordinatorDto dto
    ) {
        Coordinator c = service.update(id, mapper.toEntity(dto));
        return ResponseEntity.ok(mapper.toDto(c));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{coordId}/offerings/{offeringId}/replace-ta")
    public ResponseEntity<Void> replaceTa(
            @PathVariable Long coordId,
            @PathVariable Long offeringId,
            @RequestParam Long oldTaId,
            @RequestParam Long newTaId
    ) {
        service.replaceTa(coordId, offeringId, oldTaId, newTaId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{coordId}/proctor-assignments/{paId}/replace-ta")
    public ResponseEntity<Void> replaceProctorTa(
            @PathVariable Long coordId,
            @PathVariable Long paId,
            @RequestParam Long newTaId
    ) {
        service.replaceProctorAssignmentTa(coordId, paId, newTaId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{coordId}/proctor-assignments/swap")
    public ResponseEntity<Void> swapProctorAssignments(
            @PathVariable Long coordId,
            @RequestParam Long paId1,
            @RequestParam Long paId2
    ) {
        service.swapProctorAssignments(coordId, paId1, paId2);
        return ResponseEntity.ok().build();
    }


    @Autowired
    private ExcelImportService excelImportService;

    @PostMapping("/imp-ta")
    public ResponseEntity<Void> importTas(@RequestParam("file") MultipartFile file,
                                          @RequestParam("offeringId") Long offeringId) throws IOException {
        excelImportService.importTaSheet(file, offeringId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/imp-students")
    public ResponseEntity<Void> importStudents(@RequestParam("file") MultipartFile file,
                                               @RequestParam("offeringId") Long offeringId) throws IOException {
        excelImportService.importStudentSheet(file, offeringId);
        return ResponseEntity.ok().build();
    }


    @PostMapping("/imp-faculty")
    public ResponseEntity<Void> importFaculty(@RequestParam("file") MultipartFile file) throws IOException {
        excelImportService.importFacultySheet(file);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/imp-offerings")
    public ResponseEntity<Void> importOfferings(@RequestParam("file") MultipartFile file) throws IOException {
        excelImportService.importOfferingSheet(file);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/imp-enrollments")
    public ResponseEntity<Void> importEnrollments(@RequestParam("file") MultipartFile file) throws IOException {
        excelImportService.importEnrollmentSheet(file);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/imp-courses")
    public ResponseEntity<Void> imporCourses(@RequestParam("file") MultipartFile file) throws IOException {
        excelImportService.importCourses(file);
        return ResponseEntity.ok().build();
    }

}
