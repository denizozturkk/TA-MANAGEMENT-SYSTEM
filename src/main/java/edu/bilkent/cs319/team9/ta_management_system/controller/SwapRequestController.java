package edu.bilkent.cs319.team9.ta_management_system.controller;


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


    // 1) list eligible targets for a given assignment
    @GetMapping("/eligible/{assignmentId}")
    public ResponseEntity<List<ProctorAssignment>> eligible(
            @PathVariable Long assignmentId) {
        return ResponseEntity.ok(swapRequestService.findEligibleTargets(assignmentId));
    }

    // 2) send a swap request
    @PostMapping("/send")
    public ResponseEntity<SwapRequest> send(
            @RequestParam Long originalId,
            @RequestParam Long targetId,
            @RequestParam Long taId
    ) {
        SwapRequest req = swapRequestService.sendSwapRequest(originalId, targetId, taId);
        return ResponseEntity.status(HttpStatus.CREATED).body(req);
    }

    // 3) respond (accept/reject)
    @PutMapping("/{id}/respond")
    public ResponseEntity<SwapRequest> respond(
            @PathVariable Long id,
            @RequestParam SwapStatus status
    ) {
        return ResponseEntity.ok(swapRequestService.respondToSwapRequest(id, status));
    }

    public SwapRequestController(SwapRequestService swapRequestService) {
        this.swapRequestService = swapRequestService;
    }

    @PostMapping
    public ResponseEntity<SwapRequest> create(@RequestBody SwapRequest req) {
        return ResponseEntity.ok(swapRequestService.createSwapRequest(req));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SwapRequest> get(@PathVariable Long id) {
        return ResponseEntity.ok(swapRequestService.getSwapRequest(id));
    }

    @GetMapping
    public ResponseEntity<List<SwapRequest>> list() {
        return ResponseEntity.ok(swapRequestService.getAllSwapRequests());
    }

    @PutMapping("/{id}")
    public ResponseEntity<SwapRequest> update(
            @PathVariable Long id,
            @RequestBody SwapRequest req
    ) {
        return ResponseEntity.ok(swapRequestService.updateSwapRequest(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        swapRequestService.deleteSwapRequest(id);
        return ResponseEntity.noContent().build();
    }
}