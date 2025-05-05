 // src/main/java/edu/bilkent/cs319/team9/ta_management_system/controller/AdminController.java
package edu.bilkent.cs319.team9.ta_management_system.controller;

import edu.bilkent.cs319.team9.ta_management_system.dto.*;
import edu.bilkent.cs319.team9.ta_management_system.model.Admin;
import edu.bilkent.cs319.team9.ta_management_system.model.FacultyMember;
import edu.bilkent.cs319.team9.ta_management_system.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
    private final AdminService adminService;


    // FOR TESTING CREATE SOME ADMIN
    @PostMapping
    public ResponseEntity<Admin> create(@RequestBody Admin a) {
        return new ResponseEntity<>(adminService.create(a), HttpStatus.CREATED);
    }

    // --- Report Requests ---
    @GetMapping("/report-requests")
    public List<ReportRequestDto> pendingRequests() {
        return adminService.getPendingReportRequests();
    }


    @PostMapping("/report-requests/{id}/accept")
    public ResponseEntity<Void> accept(@PathVariable Long id) {
        adminService.acceptReportRequest(id);
        return ResponseEntity.ok().build();
    }
    @PostMapping("/report-requests/{id}/reject")
    public ResponseEntity<Void> reject(@PathVariable Long id) {
        adminService.rejectReportRequest(id);
        return ResponseEntity.ok().build();
    }

    // --- Other Reports ---
    @GetMapping("/reports/log")
    public List<LogReportDto> logReports(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to
    ) {
        return adminService.generateLogReports(from, to);
    }

    @GetMapping("/reports/swap")
    public List<SwapReportDto> swapReports(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to
    ) {
        return adminService.generateSwapReports(from, to);
    }

    @GetMapping("/reports/duty")
    public List<DutyReportDto> dutyReports(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to
    ) {
        return adminService.generateDutyReports(from, to);
    }

    @GetMapping("/reports/proctor")
    public List<ProctorReportDto> proctorReports(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to
    ) {
        return adminService.generateProctorReports(from, to);
    }

    // --- System Management ---
    @PostMapping("/system/update")
    public ResponseEntity<Void> updateApplication() {
        adminService.updateApplication();
        return ResponseEntity.ok().build();
    }

    @PostMapping("/system/authorize")
    public ResponseEntity<Void> authorizeActor(@RequestBody AuthorizeActorRequestDto dto) {
        adminService.authorizeActor(dto);
        return ResponseEntity.ok().build();
    }


    // DELETE USER
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable Long userId) {
        adminService.deleteUserById(userId);
        return ResponseEntity.ok("User with ID " + userId + " has been deleted.");
    }



}
