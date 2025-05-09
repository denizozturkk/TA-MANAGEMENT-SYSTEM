package edu.bilkent.cs319.team9.ta_management_system.controller;

import edu.bilkent.cs319.team9.ta_management_system.dto.ExamDto;
import edu.bilkent.cs319.team9.ta_management_system.mapper.EntityMapperService;
import edu.bilkent.cs319.team9.ta_management_system.model.Exam;
import edu.bilkent.cs319.team9.ta_management_system.service.ExamService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exams")
public class ExamController {
    private final ExamService examService;
    private final EntityMapperService mapper;

    public ExamController(ExamService examService, EntityMapperService mapper) {
        this.examService = examService;
        this.mapper = mapper;
    }

    @PostMapping
    public ResponseEntity<ExamDto> create(@RequestBody ExamDto dto) {
        Exam created = examService.create(mapper.toEntity(dto));
        return new ResponseEntity<>(mapper.toDto(created), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExamDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(mapper.toDto(examService.findById(id)));
    }

    @GetMapping
    public ResponseEntity<List<ExamDto>> getAll() {
        return ResponseEntity.ok(
                examService.findAll().stream().map(mapper::toDto).toList()
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExamDto> update(@PathVariable Long id, @RequestBody ExamDto dto) {
        Exam updated = examService.update(id, mapper.toEntity(dto));
        return ResponseEntity.ok(mapper.toDto(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        examService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/offering/{offeringId}")
    public ResponseEntity<List<ExamDto>> getByOfferingId(@PathVariable Long offeringId) {
        List<ExamDto> dtos = examService.findByOfferingId(offeringId).stream()
                .map(mapper::toDto)
                .toList();
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/offering/{offeringId}/insufficient-proctors")
    public ResponseEntity<List<ExamDto>> getExamsWithInsufficientProctors(
            @PathVariable Long offeringId) {

        List<ExamDto> dtos = examService
                .findUnderProctoredByOfferingId(offeringId)
                .stream()
                .map(mapper::toDto)
                .toList();

        return ResponseEntity.ok(dtos);
    }
}