package edu.bilkent.cs319.team9.ta_management_system.controller;

import edu.bilkent.cs319.team9.ta_management_system.dto.ExamRoomDto;
import edu.bilkent.cs319.team9.ta_management_system.dto.ClassroomDto;
import edu.bilkent.cs319.team9.ta_management_system.model.ExamRoom;
import edu.bilkent.cs319.team9.ta_management_system.model.ExamRoomId;
import edu.bilkent.cs319.team9.ta_management_system.model.Exam;
import edu.bilkent.cs319.team9.ta_management_system.model.Classroom;
import edu.bilkent.cs319.team9.ta_management_system.service.ExamRoomService;
import edu.bilkent.cs319.team9.ta_management_system.service.ClassroomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/exam-rooms")
@RequiredArgsConstructor
public class ExamRoomController {

    private final ExamRoomService examRoomService;
    private final ClassroomService classroomService;

    @PostMapping
    public ResponseEntity<ExamRoomDto> create(@RequestBody ExamRoomDto dto) {
        ExamRoom entity = mapToEntity(dto);
        ExamRoom saved  = examRoomService.create(entity);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToDto(saved));
    }

    @GetMapping
    public ResponseEntity<List<ExamRoomDto>> listAll() {
        List<ExamRoomDto> dtos = examRoomService.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/exam/{examId}")
    public ResponseEntity<List<ExamRoomDto>> listByExam(@PathVariable Long examId) {
        List<ExamRoomDto> dtos = examRoomService.findByExamId(examId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/exam/{examId}/unassigned-classrooms")
    public ResponseEntity<List<ClassroomDto>> getUnassigned(@PathVariable Long examId) {
        List<ClassroomDto> dtos = classroomService.findUnassignedForExam(examId).stream()
                .map(this::mapClassroomToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PutMapping("/{examId}/{classroomId}")
    public ResponseEntity<ExamRoomDto> update(
            @PathVariable Long examId,
            @PathVariable Long classroomId,
            @RequestBody ExamRoomDto dto
    ) {
        ExamRoomId id = new ExamRoomId(examId, classroomId);
        ExamRoom entity = mapToEntity(dto);
        entity.setId(id);
        ExamRoom updated = examRoomService.update(id, entity);
        return ResponseEntity.ok(mapToDto(updated));
    }

    @DeleteMapping("/{examId}/{classroomId}")
    public ResponseEntity<Void> delete(
            @PathVariable Long examId,
            @PathVariable Long classroomId
    ) {
        examRoomService.delete(new ExamRoomId(examId, classroomId));
        return ResponseEntity.noContent().build();
    }

    // --- mapping helpers ---

    private ExamRoomDto mapToDto(ExamRoom er) {
        ExamRoomDto dto = new ExamRoomDto();
        dto.setExamId(er.getExam().getId());
        dto.setClassroomId(er.getClassroom().getId());
        dto.setNumProctors(er.getNumProctors());
        return dto;
    }

    private ExamRoom mapToEntity(ExamRoomDto dto) {
        ExamRoom er = new ExamRoom();
        er.setId(new ExamRoomId(dto.getExamId(), dto.getClassroomId()));
        Exam exam = new Exam();         exam.setId(dto.getExamId());
        Classroom room = new Classroom(); room.setId(dto.getClassroomId());
        er.setExam(exam);
        er.setClassroom(room);
        er.setNumProctors(dto.getNumProctors());
        return er;
    }

    private ClassroomDto mapClassroomToDto(Classroom c) {
        ClassroomDto dto = new ClassroomDto();
        dto.setId(c.getId());
        dto.setBuilding(c.getBuilding());
        dto.setRoomNumber(c.getRoomNumber());
        dto.setCapacity(c.getCapacity());
        dto.setExamCapacity(c.getExamCapacity());
        return dto;
    }
}
