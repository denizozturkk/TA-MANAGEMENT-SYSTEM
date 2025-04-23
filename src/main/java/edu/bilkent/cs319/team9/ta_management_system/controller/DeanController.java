package edu.bilkent.cs319.team9.ta_management_system.controller;

import edu.bilkent.cs319.team9.ta_management_system.model.Dean;
import edu.bilkent.cs319.team9.ta_management_system.model.ProctorAssignment;
import edu.bilkent.cs319.team9.ta_management_system.service.DeanService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deans")
public class DeanController {
    private final DeanService deanService;
    public DeanController(DeanService deanService) {
        this.deanService = deanService;
    }

    @PostMapping
    public ResponseEntity<Dean> create(@RequestBody Dean d) {
        return new ResponseEntity<>(deanService.create(d), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Dean> getById(@PathVariable Long id) {
        return ResponseEntity.ok(deanService.findById(id));
    }

    @GetMapping
    public ResponseEntity<List<Dean>> getAll() {
        return ResponseEntity.ok(deanService.findAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Dean> update(@PathVariable Long id, @RequestBody Dean d) {
        return ResponseEntity.ok(deanService.update(id, d));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        deanService.delete(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Dean‐only: assign proctors to the given exam across its rooms.
     */
    @PostMapping("/{id}/assign-proctors")
    public ResponseEntity<List<ProctorAssignment>> assignProctors(
            @PathVariable("id") Long deanId,
            @RequestParam("examId") Long examId
    ) {
        List<ProctorAssignment> assigned = deanService.assignProctors(deanId, examId);
        return ResponseEntity.status(HttpStatus.CREATED).body(assigned);
    }
}
