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

    /**
     * Swap one TA for another in a specific offering.
     * Example: PUT /api/coordinators/5/offerings/42/replace-ta?oldTaId=17&newTaId=23
     */
    @PutMapping("/{coordId}/offerings/{offeringId}/replace-ta")
    public ResponseEntity<Void> replaceTa(
            @PathVariable Long coordId,
            @PathVariable Long offeringId,
            @RequestParam Long oldTaId,
            @RequestParam Long newTaId) {

        coordinatorService.replaceTa(coordId, offeringId, oldTaId, newTaId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{coordId}/proctor-assignments/{paId}/replace-ta")
    public ResponseEntity<Void> replaceProctorTa(
            @PathVariable Long coordId,
            @PathVariable Long paId,
            @RequestParam Long newTaId) {

        coordinatorService.replaceProctorAssignmentTa(coordId, paId, newTaId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{coordId}/proctor-assignments/swap")
    public ResponseEntity<Void> swapProctorAssignments(
            @PathVariable Long coordId,
            @RequestParam Long paId1,
            @RequestParam Long paId2) {

        coordinatorService.swapProctorAssignments(coordId, paId1, paId2);
        return ResponseEntity.ok().build();
    }

}
