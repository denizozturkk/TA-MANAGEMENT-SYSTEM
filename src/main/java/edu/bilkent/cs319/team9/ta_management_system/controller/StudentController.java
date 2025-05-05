package edu.bilkent.cs319.team9.ta_management_system.controller;


import edu.bilkent.cs319.team9.ta_management_system.dto.StudentDto;
import edu.bilkent.cs319.team9.ta_management_system.mapper.EntityMapperService;
import edu.bilkent.cs319.team9.ta_management_system.model.Student;
import edu.bilkent.cs319.team9.ta_management_system.service.StudentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/students")
public class StudentController {
    private final StudentService studentService;
    private final EntityMapperService mapper;

    public StudentController(StudentService ss, EntityMapperService mapper) {
        this.studentService = ss;
        this.mapper = mapper;
    }

    @PostMapping
    public ResponseEntity<StudentDto> create(@RequestBody StudentDto dto) {
        Student saved = studentService.create(mapper.toEntity(dto));
        return new ResponseEntity<>(mapper.toDto(saved), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentDto> getById(@PathVariable Long id) {
        Student s = studentService.findById(id);
        return ResponseEntity.ok(mapper.toDto(s));
    }

    @GetMapping
    public ResponseEntity<List<StudentDto>> getAll() {
        List<StudentDto> dtos = studentService.findAll().stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentDto> update(@PathVariable Long id, @RequestBody StudentDto dto) {
        Student updated = studentService.update(id, mapper.toEntity(dto));
        return ResponseEntity.ok(mapper.toDto(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        studentService.delete(id);
        return ResponseEntity.noContent().build();
    }
}