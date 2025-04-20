package edu.bilkent.cs319.team9.ta_management_system.controller;

import edu.bilkent.cs319.team9.ta_management_system.model.Classroom;
import edu.bilkent.cs319.team9.ta_management_system.service.ClassroomService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/classrooms")
public class ClassroomController {

    private final ClassroomService classroomService;

    public ClassroomController(ClassroomService classroomService) {
        this.classroomService = classroomService;
    }

    @PostMapping
    public ResponseEntity<Classroom> create(@RequestBody Classroom classroom) {
        return ResponseEntity.ok(classroomService.createClassroom(classroom));
    }

    @GetMapping("/{roomNumber}")
    public ResponseEntity<Classroom> get(@PathVariable String roomNumber) {
        return ResponseEntity.ok(classroomService.getClassroom(roomNumber));
    }

    @GetMapping
    public ResponseEntity<List<Classroom>> list() {
        return ResponseEntity.ok(classroomService.getAllClassrooms());
    }

    @PutMapping("/{roomNumber}")
    public ResponseEntity<Classroom> update(
            @PathVariable String roomNumber,
            @RequestBody Classroom classroom
    ) {
        return ResponseEntity.ok(classroomService.updateClassroom(roomNumber, classroom));
    }

    @DeleteMapping("/{roomNumber}")
    public ResponseEntity<Void> delete(@PathVariable String roomNumber) {
        classroomService.deleteClassroom(roomNumber);
        return ResponseEntity.noContent().build();
    }
}
