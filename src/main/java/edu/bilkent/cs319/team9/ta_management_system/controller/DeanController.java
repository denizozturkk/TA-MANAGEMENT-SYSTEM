package edu.bilkent.cs319.team9.ta_management_system.controller;

import edu.bilkent.cs319.team9.ta_management_system.dto.DeanDto;
import edu.bilkent.cs319.team9.ta_management_system.mapper.EntityMapperService;
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
    private final EntityMapperService mapper;

    public DeanController(DeanService deanService, EntityMapperService mapper) {
        this.deanService = deanService;
        this.mapper = mapper;
    }

    @PostMapping
    public ResponseEntity<DeanDto> create(@RequestBody DeanDto dto) {
        Dean created = deanService.create(mapper.toEntity(dto));
        return new ResponseEntity<>(mapper.toDto(created), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DeanDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(mapper.toDto(deanService.findById(id)));
    }

    @GetMapping
    public ResponseEntity<List<DeanDto>> getAll() {
        return ResponseEntity.ok(
                deanService.findAll().stream().map(mapper::toDto).toList()
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<DeanDto> update(@PathVariable Long id, @RequestBody DeanDto dto) {
        Dean updated = deanService.update(id, mapper.toEntity(dto));
        return ResponseEntity.ok(mapper.toDto(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        deanService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/assign-proctors")
    public ResponseEntity<List<ProctorAssignment>> assignProctors(
            @PathVariable("id") Long deanId,
            @RequestParam("examId") Long examId
    ) {
        List<ProctorAssignment> assigned = deanService.assignProctors(deanId, examId);
        return ResponseEntity.status(HttpStatus.CREATED).body(assigned);
    }
}

