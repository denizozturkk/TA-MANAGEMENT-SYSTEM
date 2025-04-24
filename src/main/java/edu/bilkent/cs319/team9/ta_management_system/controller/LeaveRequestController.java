package edu.bilkent.cs319.team9.ta_management_system.controller;

import edu.bilkent.cs319.team9.ta_management_system.dto.LeaveRequestDto;
import edu.bilkent.cs319.team9.ta_management_system.mapper.EntityMapperService;
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
    private final EntityMapperService mapper;

    public LeaveRequestController(LeaveRequestService lrs, TAService taService,
                                  ProctorAssignmentService paService, EntityMapperService mapper) {
        this.leaveRequestService = lrs;
        this.taService = taService;
        this.paService = paService;
        this.mapper = mapper;
    }

    @PostMapping
    public ResponseEntity<LeaveRequestDto> create(
            @RequestParam("taId") Long taId,
            @RequestParam("proctorAssignmentId") Long proctorAssignmentId,
            @RequestBody LeaveRequestDto dto) {

        TA ta = taService.findById(taId);
        ProctorAssignment pa = paService.findById(proctorAssignmentId);

        // validation
        if (pa.getAssignedTA() == null || !pa.getAssignedTA().getId().equals(taId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        //
        LeaveRequest entity = mapper.toEntity(dto);
        entity.setTa(ta);
        entity.setProctorAssignment(pa);
        entity.setStatus(LeaveStatus.WAITING_RESPONSE);

        LeaveRequest created = leaveRequestService.create(entity);
        return new ResponseEntity<>(mapper.toDto(created), HttpStatus.CREATED);
    }



    @GetMapping("/{id}")
    public ResponseEntity<LeaveRequestDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(mapper.toDto(leaveRequestService.findById(id)));
    }

    @GetMapping
    public ResponseEntity<List<LeaveRequestDto>> getAll() {
        return ResponseEntity.ok(
                leaveRequestService.findAll().stream().map(mapper::toDto).toList()
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<LeaveRequestDto> update(@PathVariable Long id, @RequestBody LeaveRequestDto dto) {
        LeaveRequest updated = leaveRequestService.update(id, mapper.toEntity(dto));
        return ResponseEntity.ok(mapper.toDto(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        leaveRequestService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

