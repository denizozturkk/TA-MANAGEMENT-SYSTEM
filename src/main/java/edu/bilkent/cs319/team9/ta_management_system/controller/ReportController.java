package edu.bilkent.cs319.team9.ta_management_system.controller;

import edu.bilkent.cs319.team9.ta_management_system.model.Report;
import edu.bilkent.cs319.team9.ta_management_system.service.ReportService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportController {
    private final ReportService reportService;
    public ReportController(ReportService rs) {
        this.reportService = rs;
    }

    @PostMapping
    public ResponseEntity<Report> create(@RequestBody Report r) {
        return new ResponseEntity<>(reportService.create(r), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Report> getById(@PathVariable Long id) {
        return ResponseEntity.ok(reportService.findById(id));
    }

    @GetMapping
    public ResponseEntity<List<Report>> getAll() {
        return ResponseEntity.ok(reportService.findAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Report> update(@PathVariable Long id, @RequestBody Report r) {
        return ResponseEntity.ok(reportService.update(id, r));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        reportService.delete(id);
        return ResponseEntity.noContent().build();
    }
}