package edu.bilkent.cs319.team9.ta_management_system.controller;

import edu.bilkent.cs319.team9.ta_management_system.model.ExamRoom;
import edu.bilkent.cs319.team9.ta_management_system.model.ExamRoomId;
import edu.bilkent.cs319.team9.ta_management_system.service.ExamRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exam-rooms")
@RequiredArgsConstructor
public class ExamRoomController {

    private final ExamRoomService examRoomService;

    @PostMapping
    public ResponseEntity<ExamRoom> create(@RequestBody ExamRoom examRoom) {
        ExamRoom created = examRoomService.create(examRoom);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ExamRoom>> list() {
        return ResponseEntity.ok(examRoomService.findAll());
    }

    @GetMapping("/{examId}/{classroomId}")
    public ResponseEntity<ExamRoom> getById(
            @PathVariable Long examId,
            @PathVariable Long classroomId
    ) {
        ExamRoomId id = new ExamRoomId(examId, classroomId);
        return ResponseEntity.ok(examRoomService.findById(id));
    }

    @GetMapping("/exam/{examId}")
    public ResponseEntity<List<ExamRoom>> getByExam(@PathVariable Long examId) {
        return ResponseEntity.ok(examRoomService.findByExamId(examId));
    }

    @GetMapping("/classroom/{classroomId}")
    public ResponseEntity<List<ExamRoom>> getByClassroom(@PathVariable Long classroomId) {
        return ResponseEntity.ok(examRoomService.findByClassroomId(classroomId));
    }

    @PutMapping("/{examId}/{classroomId}")
    public ResponseEntity<ExamRoom> update(
            @PathVariable Long examId,
            @PathVariable Long classroomId,
            @RequestBody ExamRoom examRoom
    ) {
        ExamRoomId id = new ExamRoomId(examId, classroomId);
        ExamRoom updated = examRoomService.update(id, examRoom);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{examId}/{classroomId}")
    public ResponseEntity<Void> delete(
            @PathVariable Long examId,
            @PathVariable Long classroomId
    ) {
        ExamRoomId id = new ExamRoomId(examId, classroomId);
        examRoomService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
