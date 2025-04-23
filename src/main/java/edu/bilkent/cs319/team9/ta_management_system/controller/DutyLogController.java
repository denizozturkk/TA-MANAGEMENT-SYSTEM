package edu.bilkent.cs319.team9.ta_management_system.controller;

import edu.bilkent.cs319.team9.ta_management_system.model.DutyLog;
import edu.bilkent.cs319.team9.ta_management_system.model.DutyStatus;
import edu.bilkent.cs319.team9.ta_management_system.service.DutyLogService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/duty-logs")
public class DutyLogController {
    private final DutyLogService dutyLogService;
    public DutyLogController(DutyLogService dutyLogService) {
        this.dutyLogService = dutyLogService;
    }

    @PostMapping
    public ResponseEntity<DutyLog> create(@RequestBody DutyLog dl) {
        return new ResponseEntity<>(dutyLogService.create(dl), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DutyLog> getById(@PathVariable Long id) {
        return ResponseEntity.ok(dutyLogService.findById(id));
    }

    @GetMapping
    public ResponseEntity<List<DutyLog>> getAll() {
        return ResponseEntity.ok(dutyLogService.findAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<DutyLog> update(@PathVariable Long id, @RequestBody DutyLog dl) {
        return ResponseEntity.ok(dutyLogService.update(id, dl));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        dutyLogService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<DutyLog> submit(
            @PathVariable Long id,
            @RequestParam("taId") Long taId
    ) {
        DutyLog dl = dutyLogService.findById(id);
        if (dl.getTa() == null || !dl.getTa().getId().equals(taId)) {
            // not the owner
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        // move status to SUBMITTED
        dl.setStatus(DutyStatus.SUBMITTED);
        DutyLog updated = dutyLogService.update(id, dl);
        return ResponseEntity.ok(updated);
    }
}