package edu.bilkent.cs319.team9.ta_management_system.controller;

import edu.bilkent.cs319.team9.ta_management_system.service.ExcelImportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/excel-import")
public class ExcelImportController {
    private final ExcelImportService excelImportService;
    public ExcelImportController(ExcelImportService excelImportService) {
        this.excelImportService = excelImportService;
    }

    @PostMapping
    public ResponseEntity<Void> importExcel(@RequestParam("file") MultipartFile file) {
        excelImportService.importExcel(file);
        return ResponseEntity.ok().build();
    }
}