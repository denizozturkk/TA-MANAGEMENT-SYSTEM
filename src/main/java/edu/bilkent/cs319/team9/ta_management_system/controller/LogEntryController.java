package edu.bilkent.cs319.team9.ta_management_system.controller;

import edu.bilkent.cs319.team9.ta_management_system.dto.LogEntryDto;
import edu.bilkent.cs319.team9.ta_management_system.mapper.EntityMapperService;
import edu.bilkent.cs319.team9.ta_management_system.model.LogEntry;
import edu.bilkent.cs319.team9.ta_management_system.model.LogType;
import edu.bilkent.cs319.team9.ta_management_system.service.LogEntryService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/log-entries")
public class LogEntryController {

    private final LogEntryService logEntryService;
    private final EntityMapperService mapper;

    public LogEntryController(LogEntryService logEntryService, EntityMapperService mapper) {
        this.logEntryService = logEntryService;
        this.mapper = mapper;
    }

    @PostMapping
    public ResponseEntity<LogEntryDto> create(@RequestBody LogEntryDto dto) {
        LogEntry created = logEntryService.create(mapper.toEntity(dto));
        return new ResponseEntity<>(mapper.toDto(created), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LogEntryDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(mapper.toDto(logEntryService.findById(id)));
    }

    @GetMapping
    public ResponseEntity<List<LogEntryDto>> getAll() {
        return ResponseEntity.ok(
                logEntryService.findAll().stream().map(mapper::toDto).toList()
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<LogEntryDto> update(@PathVariable Long id, @RequestBody LogEntryDto dto) {
        LogEntry updated = logEntryService.update(id, mapper.toEntity(dto));
        return ResponseEntity.ok(mapper.toDto(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        logEntryService.delete(id);
        return ResponseEntity.noContent().build();
    }

    /*
    @GetMapping("/ta/{taId}")
    public ResponseEntity<List<LogEntryDto>> getPastTasksByTa(
            @PathVariable Long taId,
            @RequestParam(required = false) LogType type,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(required = false) Integer limit
    ) {
        String actorId = String.valueOf(taId);
        List<LogEntryDto> logs = logEntryService.searchLogs(actorId, type, startDate, endDate, limit)
                .stream()
                .map(mapper::toDto)
                .toList();
        return ResponseEntity.ok(logs);
    }*/

}
