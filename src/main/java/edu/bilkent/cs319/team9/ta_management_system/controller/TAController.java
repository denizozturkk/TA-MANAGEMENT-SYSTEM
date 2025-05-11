package edu.bilkent.cs319.team9.ta_management_system.controller;

import edu.bilkent.cs319.team9.ta_management_system.dto.ProctorAssignmentDto;
import edu.bilkent.cs319.team9.ta_management_system.dto.TADto;
import edu.bilkent.cs319.team9.ta_management_system.mapper.EntityMapperService;
import edu.bilkent.cs319.team9.ta_management_system.model.Exam;
import edu.bilkent.cs319.team9.ta_management_system.model.ProctorAssignment;
import edu.bilkent.cs319.team9.ta_management_system.model.TA;
import edu.bilkent.cs319.team9.ta_management_system.service.BusyHourService;
import edu.bilkent.cs319.team9.ta_management_system.service.ProctorAssignmentService;
import edu.bilkent.cs319.team9.ta_management_system.service.TAService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ta")
public class TAController {

    private final TAService taService;
    private final ProctorAssignmentService paService;
    private final BusyHourService busyHourService;
    private final EntityMapperService mapper;

    public TAController(TAService taService,
                        ProctorAssignmentService paService,
                        BusyHourService busyHourService,
                        EntityMapperService mapper) {
        this.taService = taService;
        this.paService = paService;
        this.busyHourService = busyHourService;
        this.mapper = mapper;
    }

    @PostMapping
    public ResponseEntity<TADto> create(@RequestBody TADto taDto) {
        TA createdTA = taService.create(mapper.toEntity(taDto));
        return new ResponseEntity<>(mapper.toDto(createdTA), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TADto> getById(@PathVariable Long id) {
        TA ta = taService.findById(id);
        return ResponseEntity.ok(mapper.toDto(ta));
    }

    @GetMapping
    public ResponseEntity<List<TADto>> getAll() {
        List<TADto> dtoList = taService.findAll().stream()
                .map(mapper::toDto)
                .toList();
        return ResponseEntity.ok(dtoList);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TADto> update(@PathVariable Long id,
                                        @RequestBody TADto taDto) {
        TA updated = taService.update(id, mapper.toEntity(taDto));
        return ResponseEntity.ok(mapper.toDto(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        taService.delete(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * duration is now in hours (e.g. 1.0, 1.5, 2.25, etc.)
     */
    @GetMapping("/available")
    public ResponseEntity<List<TADto>> getAvailableTAs(
            @RequestParam("startTime")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime startTime,
            @RequestParam("duration") Double durationInHours
    ) {
        long minutes = Math.round(durationInHours * 60);
        LocalDateTime endTime = startTime.plusMinutes(minutes);

        List<TADto> available = taService.findAll().stream()
                .filter(ta -> busyHourService.isTAAvailable(
                        ta.getId(), startTime, endTime))
                .map(mapper::toDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(available);
    }

    /**
     * Same: duration in hours
     */
    @GetMapping("/available/department")
    public ResponseEntity<List<TADto>> getAvailableTAsByDepartment(
            @RequestParam("startTime")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime startTime,
            @RequestParam("duration") Double durationInHours,
            @RequestParam("department") String department
    ) {
        long minutes = Math.round(durationInHours * 60);
        LocalDateTime endTime = startTime.plusMinutes(minutes);

        List<TADto> filtered = taService.findAll().stream()
                .filter(ta -> ta.getDepartment() != null &&
                        ta.getDepartment().equalsIgnoreCase(department))
                .filter(ta -> busyHourService.isTAAvailable(
                        ta.getId(), startTime, endTime))
                .map(mapper::toDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(filtered);
    }

    @GetMapping("/by-offering/{offeringId}")
    public ResponseEntity<List<TADto>> getTAsByOffering(
            @PathVariable Long offeringId) {
        List<TADto> tas = taService.findTAsByOfferingId(offeringId).stream()
                .map(mapper::toDto)
                .toList();
        return ResponseEntity.ok(tas);
    }

    @PostMapping("/{id}/workload")
    public ResponseEntity<Void> incrementWorkload(
            @PathVariable("id") Long taId,
            @RequestParam("increment") float hours
    ) {
        taService.incrementWorkload(taId, hours);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/workload/total")
    public ResponseEntity<Float> getTotalWorkload(@PathVariable("id") Long taId) {
        float total = taService.getTotalWorkload(taId);
        return ResponseEntity.ok(total);
    }

    @GetMapping("/{taId}/swappable-assignments")
    public ResponseEntity<List<ProctorAssignmentDto>> getSwappableAssignments(
            @PathVariable Long taId,
            @RequestParam Long assignmentId
    ) {
        ProctorAssignment ownAssignment = paService.findById(assignmentId);
        if (ownAssignment == null || ownAssignment.getExam() == null) {
            return ResponseEntity.badRequest().build();
        }

        TA requestingTA = taService.findById(taId);
        if (requestingTA == null || requestingTA.getDepartment() == null) {
            return ResponseEntity.badRequest().build();
        }

        String department = requestingTA.getDepartment();

        List<ProctorAssignmentDto> swappableAssignments = taService.findAll().stream()
                .filter(ta -> !ta.getId().equals(taId)) // not self
                .filter(ta -> department.equalsIgnoreCase(ta.getDepartment()))
                .flatMap(ta -> paService.findByTaId(ta.getId()).stream())
                .filter(a -> {
                    Exam exam = a.getExam();
                    if (exam == null) return false;

                    LocalDateTime start = exam.getDateTime().minusHours(3);
                    LocalDateTime end = start.plusMinutes(Math.round(exam.getDuration() * 60)).minusHours(3);

                    // is requesting TA available during this assignment's exam time?
                    return busyHourService.isTAAvailable(taId, start, end);
                })
                .map(mapper::toDto)
                .toList();
        return ResponseEntity.ok(swappableAssignments);
    }
}
