package edu.bilkent.cs319.team9.ta_management_system.controller;

import edu.bilkent.cs319.team9.ta_management_system.model.AssignmentType;
import edu.bilkent.cs319.team9.ta_management_system.model.FacultyMember;
import edu.bilkent.cs319.team9.ta_management_system.model.LeaveRequest;
import edu.bilkent.cs319.team9.ta_management_system.service.FacultyMemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/faculty-members")
@RequiredArgsConstructor
public class FacultyMemberController {

    private final FacultyMemberService facultyMemberService;

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

    /**
     * Assign proctors for an exam, based on mode and optional TA selection
     */
    @PostMapping("/assign-proctor")
    public ResponseEntity<Void> assignProctor(
            @RequestParam Long examId,
            @RequestParam AssignmentType mode,
            @RequestParam(required = false) Long taId
    ) {
        facultyMemberService.assignProctor(examId, mode, taId);
        return ResponseEntity.ok().build();
    }

    /**
     * List pending leave requests for this faculty
     */
    @GetMapping("/{facultyId}/leave-requests")
    public ResponseEntity<List<LeaveRequest>> listLeaveRequests(@PathVariable Long facultyId) {
        return ResponseEntity.ok(facultyMemberService.listLeaveRequests(facultyId));
    }

    /**
     * Approve a specific leave request
     */
    @PostMapping("/leave-requests/{requestId}/approve")
    public ResponseEntity<LeaveRequest> approveLeave(@PathVariable Long requestId) {
        return ResponseEntity.ok(facultyMemberService.approveLeaveRequest(requestId));
    }

    /**
     * Reject a specific leave request
     */
    @PostMapping("/leave-requests/{requestId}/reject")
    public ResponseEntity<LeaveRequest> rejectLeave(@PathVariable Long requestId) {
        return ResponseEntity.ok(facultyMemberService.rejectLeaveRequest(requestId));
    }

    /**
     * Upload semester data via Excel
     */
    @PostMapping("/upload")
    public ResponseEntity<?> uploadExcel(@RequestParam("file") MultipartFile file) {
        return facultyMemberService.uploadExcelFile(file);
    }

    /**
     * Trigger random student distribution print (for UI, consider replacing with JSON response)
     */
    @GetMapping("/distribution/random")
    public ResponseEntity<Void> printRandomDistribution() {
        facultyMemberService.printRandomly();
        return ResponseEntity.ok().build();
    }

    /**
     * Trigger alphabetical student distribution print (for UI, consider replacing with JSON response)
     */
    @GetMapping("/distribution/alphabetical")
    public ResponseEntity<Void> printAlphabeticalDistribution() {
        facultyMemberService.printAlphabetically();
        return ResponseEntity.ok().build();
    }
}
