package edu.bilkent.cs319.team9.ta_management_system.controller;

import edu.bilkent.cs319.team9.ta_management_system.dto.DeanDto;
import edu.bilkent.cs319.team9.ta_management_system.dto.ReportRequestDto;
import edu.bilkent.cs319.team9.ta_management_system.mapper.EntityMapperService;
import edu.bilkent.cs319.team9.ta_management_system.model.*;
import edu.bilkent.cs319.team9.ta_management_system.service.DeanService;
import edu.bilkent.cs319.team9.ta_management_system.service.ExamRoomService;
import edu.bilkent.cs319.team9.ta_management_system.service.ExamService;
import edu.bilkent.cs319.team9.ta_management_system.service.ProctorAssignmentService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/deans")
public class DeanController {
    private final DeanService deanService;
    private final ExamService examService;
    private final ExamRoomService examRoomService;
    private final EntityMapperService mapper;
    private final ProctorAssignmentService proctorAssignmentService;


    public DeanController(
            DeanService deanService,
            ExamService examService,
            ExamRoomService examRoomService,
            EntityMapperService mapper,
            ProctorAssignmentService proctorAssignmentService
    ) {
        this.deanService = deanService;
        this.examService = examService;
        this.examRoomService = examRoomService;
        this.mapper = mapper;
        this.proctorAssignmentService = proctorAssignmentService;
    }

    @PostMapping
    public ResponseEntity<DeanDto> create(@RequestBody DeanDto dto) {
        Dean created = deanService.create(mapper.toEntity(dto));
        return new ResponseEntity<>(mapper.toDto(created), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DeanDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(mapper.toDto(deanService.findById(id)));
    }

    @GetMapping
    public ResponseEntity<List<DeanDto>> getAll() {
        return ResponseEntity.ok(
                deanService.findAll().stream().map(mapper::toDto).toList()
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<DeanDto> update(@PathVariable Long id, @RequestBody DeanDto dto) {
        Dean updated = deanService.update(id, mapper.toEntity(dto));
        return ResponseEntity.ok(mapper.toDto(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        deanService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/assign-proctors")
    public ResponseEntity<List<ProctorAssignment>> assignProctors(
            @PathVariable("id") Long deanId,
            @RequestParam("examId") Long examId
    ) {
        List<ProctorAssignment> assigned = deanService.assignProctors(deanId, examId);
        return ResponseEntity.status(HttpStatus.CREATED).body(assigned);
    }

    @PutMapping("/{deanId}/reschedule")
    public ResponseEntity<Void> rescheduleExam(
            @PathVariable Long deanId,
            @RequestParam Long examId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime newDateTime
    ) {
        deanService.findById(deanId); // Ensure dean exists

        Exam exam = examService.findById(examId);

        // Delete all existing proctor assignments for this exam
        proctorAssignmentService.deleteAllByExamId(examId);

        // Update the exam time
        exam.setDateTime(newDateTime);
        examService.update(exam.getId(), exam);

        return ResponseEntity.ok().build();
    }


    @PutMapping("/{deanId}/update-proctor-count")
    public ResponseEntity<Void> updateProctorCount(
            @PathVariable Long deanId,
            @RequestParam Long examId,
            @RequestParam Integer newProctorCount
    ) {
        deanService.findById(deanId); // check dean exists
        Exam exam = examService.findById(examId);
        exam.setNumProctors(newProctorCount);
        examService.update(exam.getId(), exam);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{deanId}/exam-classrooms/add")
    public ResponseEntity<Void> addClassroomToExam(
            @PathVariable Long deanId,
            @RequestParam Long examId,
            @RequestParam Long classroomId,
            @RequestParam Integer proctorCount
    ) {
        deanService.findById(deanId);
        Exam exam = examService.findById(examId);

        ExamRoom er = new ExamRoom();
        er.setId(new ExamRoomId(examId, classroomId));
        er.setExam(exam);
        Classroom classroom = new Classroom(); classroom.setId(classroomId);
        er.setClassroom(classroom);
        er.setNumProctors(proctorCount);

        exam.getExamRooms().add(er);
        examService.update(examId, exam); // or call ExamRoomService.create(er)
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{deanId}/exam-classrooms/remove")
    public ResponseEntity<Void> removeClassroomFromExam(
            @PathVariable Long deanId,
            @RequestParam Long examId,
            @RequestParam Long classroomId
    ) {
        deanService.findById(deanId);
        examRoomService.deleteByExamIdAndClassroomId(examId, classroomId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{deanId}/report‐requests")
    public ResponseEntity<ReportRequestDto> createReportRequest(
            @PathVariable Long deanId,
            @RequestBody ReportRequestDto dto
    ) {
        // dto.fromTime, dto.toTime, dto.reportType, dto.details must be populated by client
        dto.setRequesterId(deanId);
        ReportRequest saved = deanService.createReportRequest(dto.toEntity());
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ReportRequestDto.fromEntity(saved));
    }

    /**
     * Dean lists all of their own report requests.
     */
    @GetMapping("/{deanId}/report‐requests")
    public ResponseEntity<List<ReportRequestDto>> getMyReportRequests(@PathVariable Long deanId) {
        List<ReportRequest> requests = deanService.findRequestsByRequester(deanId);
        List<ReportRequestDto> dtos = requests.stream()
                .map(ReportRequestDto::fromEntity)
                .toList();
        return ResponseEntity.ok(dtos);
    }

    @PutMapping("/{deanId}/assign-ta-to-offering")
    public ResponseEntity<Void> assignTaToOffering(
            @PathVariable Long deanId,
            @RequestParam Long taId,
            @RequestParam Long offeringId
    ) {
        deanService.addTaToOffering(deanId, taId, offeringId);
        return ResponseEntity.ok().build();
    }
}

