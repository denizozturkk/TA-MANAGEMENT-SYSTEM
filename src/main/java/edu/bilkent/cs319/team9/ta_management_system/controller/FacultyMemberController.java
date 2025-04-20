package edu.bilkent.cs319.team9.ta_management_system.controller;


import edu.bilkent.cs319.team9.ta_management_system.model.FacultyMember;
import edu.bilkent.cs319.team9.ta_management_system.service.FacultyMemberService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/faculty-members")
public class FacultyMemberController {
    private final FacultyMemberService facultyMemberService;
    public FacultyMemberController(FacultyMemberService fms) {
        this.facultyMemberService = fms;
    }

    @PostMapping
    public ResponseEntity<FacultyMember> create(@RequestBody FacultyMember f) {
        return new ResponseEntity<>(facultyMemberService.create(f), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FacultyMember> getById(@PathVariable Long id) {
        return ResponseEntity.ok(facultyMemberService.findById(id));
    }

    @GetMapping
    public ResponseEntity<List<FacultyMember>> getAll() {
        return ResponseEntity.ok(facultyMemberService.findAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<FacultyMember> update(@PathVariable Long id,
                                                @RequestBody FacultyMember f) {
        return ResponseEntity.ok(facultyMemberService.update(id, f));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        facultyMemberService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
