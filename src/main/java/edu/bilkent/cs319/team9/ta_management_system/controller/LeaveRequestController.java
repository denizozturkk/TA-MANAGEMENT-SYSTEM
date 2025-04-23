package edu.bilkent.cs319.team9.ta_management_system.controller;

import edu.bilkent.cs319.team9.ta_management_system.model.LeaveRequest;
import edu.bilkent.cs319.team9.ta_management_system.model.LeaveStatus;
import edu.bilkent.cs319.team9.ta_management_system.model.ProctorAssignment;
import edu.bilkent.cs319.team9.ta_management_system.model.TA;
import edu.bilkent.cs319.team9.ta_management_system.service.LeaveRequestService;
import edu.bilkent.cs319.team9.ta_management_system.service.ProctorAssignmentService;
import edu.bilkent.cs319.team9.ta_management_system.service.TAService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leave-requests")
public class LeaveRequestController {
    private final LeaveRequestService leaveRequestService;
    private final TAService taService;
    private final ProctorAssignmentService paService;

    public LeaveRequestController(LeaveRequestService lrs,
                                  TAService taService,
                                  ProctorAssignmentService paService) {
        this.leaveRequestService = lrs;
        this.taService = taService;
        this.paService = paService;
    }

    @PostMapping
    public ResponseEntity<LeaveRequest> create(@RequestBody LeaveRequest lr) {
        // 1) Validate TA
        Long taId = lr.getTa().getId();
        TA ta = taService.findById(taId);

        // 2) (Optional) Validate proctorAssignment belongs to TA
        if (lr.getProctorAssignment() != null) {
            Long paId = lr.getProctorAssignment().getId();
            ProctorAssignment pa = paService.findById(paId);
            if (pa.getAssignedTA() == null || !pa.getAssignedTA().getId().equals(taId)) {
                return ResponseEntity.badRequest().build();
            }
            lr.setProctorAssignment(pa);
        }

        // 3) Wire in the TA and default the status
        lr.setTa(ta);
        lr.setStatus(LeaveStatus.WAITING_RESPONSE);

        LeaveRequest created = leaveRequestService.create(lr);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
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
