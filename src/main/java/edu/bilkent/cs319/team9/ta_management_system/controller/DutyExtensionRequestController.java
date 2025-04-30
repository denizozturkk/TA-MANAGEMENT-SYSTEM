package edu.bilkent.cs319.team9.ta_management_system.controller;

import edu.bilkent.cs319.team9.ta_management_system.dto.DutyExtensionRequestDto;
import edu.bilkent.cs319.team9.ta_management_system.mapper.EntityMapperService;
import edu.bilkent.cs319.team9.ta_management_system.model.DutyExtensionRequest;
import edu.bilkent.cs319.team9.ta_management_system.model.ExtensionRequestStatus;
import edu.bilkent.cs319.team9.ta_management_system.service.DutyExtensionRequestService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/extension-requests")
public class DutyExtensionRequestController {
    private final DutyExtensionRequestService service;
    private final EntityMapperService mapper;

    public DutyExtensionRequestController(DutyExtensionRequestService service, EntityMapperService mapper) {
        this.service = service;
        this.mapper = mapper;
    }

    @PostMapping
    public ResponseEntity<DutyExtensionRequestDto> create(@RequestBody DutyExtensionRequestDto dto) {
        DutyExtensionRequest created = service.create(mapper.toEntity(dto));
        return ResponseEntity.ok(mapper.toDto(created));
    }

    @PutMapping("/{id}/respond")
    public ResponseEntity<DutyExtensionRequestDto> respond(
            @PathVariable Long id,
            @RequestParam ExtensionRequestStatus status) {
        DutyExtensionRequest updated = service.respond(id, status);
        return ResponseEntity.ok(mapper.toDto(updated));
    }

    @GetMapping
    public ResponseEntity<List<DutyExtensionRequestDto>> all() {
        return ResponseEntity.ok(
                service.getAll().stream().map(mapper::toDto).toList()
        );
    }

    @GetMapping("/ta/{taId}")
    public ResponseEntity<List<DutyExtensionRequestDto>> byTa(@PathVariable Long taId) {
        return ResponseEntity.ok(
                service.getByTaId(taId).stream().map(mapper::toDto).toList()
        );
    }

    @GetMapping("/instructor/{instructorId}")
    public ResponseEntity<List<DutyExtensionRequestDto>> byInstructor(@PathVariable Long instructorId) {
        return ResponseEntity.ok(
                service.getByInstructorId(instructorId).stream().map(mapper::toDto).toList()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<DutyExtensionRequestDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(mapper.toDto(service.getById(id)));
    }
}
