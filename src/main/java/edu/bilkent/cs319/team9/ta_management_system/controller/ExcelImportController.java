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
}