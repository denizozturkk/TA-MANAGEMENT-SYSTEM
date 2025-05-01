package edu.bilkent.cs319.team9.ta_management_system.controller;

import edu.bilkent.cs319.team9.ta_management_system.dto.ClassroomDto;
import edu.bilkent.cs319.team9.ta_management_system.mapper.EntityMapperService;
import edu.bilkent.cs319.team9.ta_management_system.model.Classroom;
import edu.bilkent.cs319.team9.ta_management_system.service.ClassroomService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/classrooms")
public class ClassroomController {
    private final ClassroomService classroomService;
    private final EntityMapperService mapper;

    public ClassroomController(ClassroomService classroomService, EntityMapperService mapper) {
        this.classroomService = classroomService;
        this.mapper = mapper;
    }

    @PostMapping
    public ResponseEntity<ClassroomDto> create(@RequestBody ClassroomDto dto) {
        Classroom created = classroomService.createClassroom(mapper.toEntity(dto));
        return ResponseEntity.ok(mapper.toDto(created));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClassroomDto> get(@PathVariable String roomNumber) {
        return ResponseEntity.ok(mapper.toDto(classroomService.getClassroom(roomNumber)));
    }

    @GetMapping
    public ResponseEntity<List<ClassroomDto>> list() {
        return ResponseEntity.ok(
                classroomService.getAllClassrooms().stream().map(mapper::toDto).toList()
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClassroomDto> update(@PathVariable String roomNumber,
                                               @RequestBody ClassroomDto dto) {
        Classroom updated = classroomService.updateClassroom(roomNumber, mapper.toEntity(dto));
        return ResponseEntity.ok(mapper.toDto(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String roomNumber) {
        classroomService.deleteClassroom(roomNumber);
        return ResponseEntity.noContent().build();
    }
}
