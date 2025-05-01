package edu.bilkent.cs319.team9.ta_management_system.controller;

import edu.bilkent.cs319.team9.ta_management_system.dto.SwapRequestDto;
import edu.bilkent.cs319.team9.ta_management_system.mapper.EntityMapperService;
import edu.bilkent.cs319.team9.ta_management_system.model.ProctorAssignment;
import edu.bilkent.cs319.team9.ta_management_system.model.SwapRequest;
import edu.bilkent.cs319.team9.ta_management_system.model.SwapStatus;
import edu.bilkent.cs319.team9.ta_management_system.service.SwapRequestService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/swap-requests")
public class SwapRequestController {
    private final SwapRequestService swapRequestService;
    private final EntityMapperService mapper;

    public SwapRequestController(SwapRequestService service, EntityMapperService mapper) {
        this.swapRequestService = service;
        this.mapper = mapper;
    }

    @GetMapping("/eligible/{assignmentId}")
    public ResponseEntity<List<ProctorAssignment>> eligible(@PathVariable Long assignmentId) {
        return ResponseEntity.ok(swapRequestService.findEligibleTargets(assignmentId));
    }

    @PostMapping("/send")
    public ResponseEntity<SwapRequestDto> send(
            @RequestParam Long originalId,
            @RequestParam Long targetId,
            @RequestParam Long taId) {

        SwapRequest request = swapRequestService.sendSwapRequest(originalId, targetId, taId);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapper.toDto(request));
    }

    @PutMapping("/{id}/respond")
    public ResponseEntity<SwapRequestDto> respond(
            @PathVariable Long id,
            @RequestParam SwapStatus status) {

        SwapRequest updated = swapRequestService.respondToSwapRequest(id, status);
        return ResponseEntity.ok(mapper.toDto(updated));
    }

    @PostMapping
    public ResponseEntity<SwapRequestDto> create(@RequestBody SwapRequestDto dto) {
        SwapRequest created = swapRequestService.createSwapRequest(mapper.toEntity(dto));
        return ResponseEntity.ok(mapper.toDto(created));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SwapRequestDto> get(@PathVariable Long id) {
        return ResponseEntity.ok(mapper.toDto(swapRequestService.getSwapRequest(id)));
    }

    @GetMapping
    public ResponseEntity<List<SwapRequestDto>> list() {
        return ResponseEntity.ok(
                swapRequestService.getAllSwapRequests().stream().map(mapper::toDto).toList()
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<SwapRequestDto> update(@PathVariable Long id, @RequestBody SwapRequestDto dto) {
        SwapRequest updated = swapRequestService.updateSwapRequest(id, mapper.toEntity(dto));
        return ResponseEntity.ok(mapper.toDto(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        swapRequestService.deleteSwapRequest(id);
        return ResponseEntity.noContent().build();
    }
}
