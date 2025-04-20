package edu.bilkent.cs319.team9.ta_management_system.controller;

import edu.bilkent.cs319.team9.ta_management_system.service.SemesterDataService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/semester-data")
public class SemesterDataController {
    private final SemesterDataService semesterDataService;
    public SemesterDataController(SemesterDataService sds) {
        this.semesterDataService = sds;
    }

    @PostMapping("/upload")
    public ResponseEntity<Void> upload(@RequestParam("file") MultipartFile file) {
        semesterDataService.upload(file);
        return ResponseEntity.ok().build();
    }
}
