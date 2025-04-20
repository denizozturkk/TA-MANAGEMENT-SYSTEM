package edu.bilkent.cs319.team9.ta_management_system.controller;

import edu.bilkent.cs319.team9.ta_management_system.model.LogEntry;
import edu.bilkent.cs319.team9.ta_management_system.service.LogEntryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/log-entries")
public class LogEntryController {
    private final LogEntryService logEntryService;
    public LogEntryController(LogEntryService les) {
        this.logEntryService = les;
    }

    @PostMapping
    public ResponseEntity<LogEntry> create(@RequestBody LogEntry le) {
        return new ResponseEntity<>(logEntryService.create(le), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LogEntry> getById(@PathVariable Long id) {
        return ResponseEntity.ok(logEntryService.findById(id));
    }

    @GetMapping
    public ResponseEntity<List<LogEntry>> getAll() {
        return ResponseEntity.ok(logEntryService.findAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<LogEntry> update(@PathVariable Long id,
                                           @RequestBody LogEntry le) {
        return ResponseEntity.ok(logEntryService.update(id, le));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        logEntryService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
