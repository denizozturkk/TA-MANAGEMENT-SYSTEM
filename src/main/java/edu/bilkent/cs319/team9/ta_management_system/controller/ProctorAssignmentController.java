package edu.bilkent.cs319.team9.ta_management_system.controller;

import edu.bilkent.cs319.team9.ta_management_system.model.ProctorAssignment;
import edu.bilkent.cs319.team9.ta_management_system.service.ProctorAssignmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/proctor-assignments")
public class ProctorAssignmentController {
    private final ProctorAssignmentService paService;
    public ProctorAssignmentController(ProctorAssignmentService pas) {
        this.paService = pas;
    }

    @PostMapping
    public ResponseEntity<ProctorAssignment> create(@RequestBody ProctorAssignment pa) {
        return new ResponseEntity<>(paService.create(pa), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProctorAssignment> getById(@PathVariable Long id) {
        return ResponseEntity.ok(paService.findById(id));
    }

    @GetMapping
    public ResponseEntity<List<ProctorAssignment>> getAll() {
        return ResponseEntity.ok(paService.findAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProctorAssignment> update(@PathVariable Long id,
                                                    @RequestBody ProctorAssignment pa) {
        return ResponseEntity.ok(paService.update(id, pa));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        paService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
