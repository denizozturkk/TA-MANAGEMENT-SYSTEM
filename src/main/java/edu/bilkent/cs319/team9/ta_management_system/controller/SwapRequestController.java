package edu.bilkent.cs319.team9.ta_management_system.controller;


import edu.bilkent.cs319.team9.ta_management_system.model.SwapRequest;
import edu.bilkent.cs319.team9.ta_management_system.service.SwapRequestService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/swap-requests")
public class SwapRequestController {

    private final SwapRequestService swapRequestService;

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