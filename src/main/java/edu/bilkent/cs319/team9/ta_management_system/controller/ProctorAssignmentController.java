package edu.bilkent.cs319.team9.ta_management_system.controller;

import edu.bilkent.cs319.team9.ta_management_system.dto.ProctorAssignmentDto;
import edu.bilkent.cs319.team9.ta_management_system.mapper.EntityMapperService;
import edu.bilkent.cs319.team9.ta_management_system.model.ProctorAssignment;
import edu.bilkent.cs319.team9.ta_management_system.service.ProctorAssignmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/proctor-assignments")
public class ProctorAssignmentController {
    private final ProctorAssignmentService paService;
    private final EntityMapperService mapper;

    public ProctorAssignmentController(ProctorAssignmentService paService, EntityMapperService mapper) {
        this.paService = paService;
        this.mapper = mapper;
    }

    @PostMapping
    public ResponseEntity<ProctorAssignmentDto> create(@RequestBody ProctorAssignmentDto dto) {
        ProctorAssignment created = paService.create(mapper.toEntity(dto));
        return new ResponseEntity<>(mapper.toDto(created), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProctorAssignmentDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(mapper.toDto(paService.findById(id)));
    }

    @GetMapping
    public ResponseEntity<List<ProctorAssignmentDto>> getAll() {
        return ResponseEntity.ok(
                paService.findAll().stream().map(mapper::toDto).toList()
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProctorAssignmentDto> update(@PathVariable Long id, @RequestBody ProctorAssignmentDto dto) {
        ProctorAssignment updated = paService.update(id, mapper.toEntity(dto));
        return ResponseEntity.ok(mapper.toDto(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        paService.delete(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/ta/{taId}")
    public ResponseEntity<List<ProctorAssignmentDto>> getByTaId(@PathVariable Long taId) {
        List<ProctorAssignmentDto> dtos = paService.findByTaId(taId).stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
}
