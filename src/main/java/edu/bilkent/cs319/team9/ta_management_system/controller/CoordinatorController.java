package edu.bilkent.cs319.team9.ta_management_system.controller;

import edu.bilkent.cs319.team9.ta_management_system.model.Coordinator;
import edu.bilkent.cs319.team9.ta_management_system.service.CoordinatorService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/coordinators")
public class CoordinatorController {
    private final CoordinatorService coordinatorService;
    public CoordinatorController(CoordinatorService coordinatorService) {
        this.coordinatorService = coordinatorService;
    }

    @PostMapping
    public ResponseEntity<Coordinator> create(@RequestBody Coordinator coord) {
        return new ResponseEntity<>(coordinatorService.create(coord), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Coordinator> getById(@PathVariable Long id) {
        return ResponseEntity.ok(coordinatorService.findById(id));
    }

    @GetMapping
    public ResponseEntity<List<Coordinator>> getAll() {
        return ResponseEntity.ok(coordinatorService.findAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Coordinator> update(@PathVariable Long id,
                                              @RequestBody Coordinator coord) {
        return ResponseEntity.ok(coordinatorService.update(id, coord));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        coordinatorService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
