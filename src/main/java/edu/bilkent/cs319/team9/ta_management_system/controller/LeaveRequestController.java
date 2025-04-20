package edu.bilkent.cs319.team9.ta_management_system.controller;

import edu.bilkent.cs319.team9.ta_management_system.model.LeaveRequest;
import edu.bilkent.cs319.team9.ta_management_system.service.LeaveRequestService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leave-requests")
public class LeaveRequestController {
    private final LeaveRequestService leaveRequestService;
    public LeaveRequestController(LeaveRequestService lrs) {
        this.leaveRequestService = lrs;
    }

    @PostMapping
    public ResponseEntity<LeaveRequest> create(@RequestBody LeaveRequest lr) {
        return new ResponseEntity<>(leaveRequestService.create(lr), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LeaveRequest> getById(@PathVariable Long id) {
        return ResponseEntity.ok(leaveRequestService.findById(id));
    }

    @GetMapping
    public ResponseEntity<List<LeaveRequest>> getAll() {
        return ResponseEntity.ok(leaveRequestService.findAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<LeaveRequest> update(@PathVariable Long id,
                                               @RequestBody LeaveRequest lr) {
        return ResponseEntity.ok(leaveRequestService.update(id, lr));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        leaveRequestService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
