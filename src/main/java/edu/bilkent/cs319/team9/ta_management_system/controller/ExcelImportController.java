package edu.bilkent.cs319.team9.ta_management_system.controller;

import edu.bilkent.cs319.team9.ta_management_system.service.ExcelImportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/excel-import")
public class ExcelImportController {
    @Autowired
    private ExcelImportService excelImportService;

    @PostMapping("/import")
    public ResponseEntity<Void> importTas(@RequestParam("file") MultipartFile file) throws IOException {
        excelImportService.importTaSheet(file);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/students")
    public ResponseEntity<Void> importStudents(@RequestParam("file") MultipartFile file) throws IOException {
        excelImportService.importStudentSheet(file);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/faculty")
    public ResponseEntity<Void> importFaculty(@RequestParam("file") MultipartFile file) throws IOException {
        excelImportService.importFacultySheet(file);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/offerings")
    public ResponseEntity<Void> importOfferings(@RequestParam("file") MultipartFile file) throws IOException {
        excelImportService.importOfferingSheet(file);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/enrollments")
    public ResponseEntity<Void> importEnrollments(@RequestParam("file") MultipartFile file) throws IOException {
        excelImportService.importEnrollmentSheet(file);
        return ResponseEntity.ok().build();
    }
}