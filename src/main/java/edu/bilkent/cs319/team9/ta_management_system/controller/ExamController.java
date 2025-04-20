package edu.bilkent.cs319.team9.ta_management_system.controller;

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
    public ExamController(ExamService examService) {
        this.examService = examService;
    }

    @PostMapping
    public ResponseEntity<Exam> create(@RequestBody Exam e) {
        return new ResponseEntity<>(examService.create(e), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Exam> getById(@PathVariable Long id) {
        return ResponseEntity.ok(examService.findById(id));
    }

    @GetMapping
    public ResponseEntity<List<Exam>> getAll() {
        return ResponseEntity.ok(examService.findAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Exam> update(@PathVariable Long id, @RequestBody Exam e) {
        return ResponseEntity.ok(examService.update(id, e));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        examService.delete(id);
        return ResponseEntity.noContent().build();
    }
}