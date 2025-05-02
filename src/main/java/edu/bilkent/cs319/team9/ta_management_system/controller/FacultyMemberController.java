package edu.bilkent.cs319.team9.ta_management_system.controller;

import edu.bilkent.cs319.team9.ta_management_system.dto.DistributionDto;
import edu.bilkent.cs319.team9.ta_management_system.mapper.EntityMapperService;
import edu.bilkent.cs319.team9.ta_management_system.model.*;
import edu.bilkent.cs319.team9.ta_management_system.repository.ClassroomRepository;
import edu.bilkent.cs319.team9.ta_management_system.service.FacultyMemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/faculty-members")
@RequiredArgsConstructor
public class FacultyMemberController {

    private final FacultyMemberService facultyMemberService;
    private final EntityMapperService mapper;
    private final ClassroomRepository classroomRepository;

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
    @PostMapping("/{facultyId}/exams/{examId}/proctor")
    public ResponseEntity<ProctorAssignment> assignProctor(
            @PathVariable Long facultyId,
            @PathVariable Long examId,
            @RequestParam AssignmentType mode,
            @RequestParam(required = false) Long taId
    )
    {
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

    @PostMapping("/{facultyId}/tas/{taId}/duty-logs")
    public ResponseEntity<DutyLog> uploadDutyLog(
            @PathVariable Long facultyId,
            @PathVariable Long taId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("taskType") DutyType taskType,
            @RequestParam("workload") Long workload,
            @RequestParam("startTime")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @RequestParam("duration") Long duration,
            @RequestParam("status") DutyStatus status,
            @RequestParam("classroomIds") List<Long> classroomIds
    ) {
        // fetch classrooms
        Set<Classroom> classrooms = new HashSet<>( classroomRepository.findAllById(classroomIds) );

        // call service
        DutyLog created = facultyMemberService.uploadDutyLog(
                facultyId,
                taId,
                file,
                taskType,
                workload,
                startTime,
                duration,
                status,
                classrooms
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(created);
    }

}
