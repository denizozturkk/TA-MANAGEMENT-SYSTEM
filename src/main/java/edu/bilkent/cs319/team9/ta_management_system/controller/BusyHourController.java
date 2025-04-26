package edu.bilkent.cs319.team9.ta_management_system.controller;

import edu.bilkent.cs319.team9.ta_management_system.model.BusyHour;
import edu.bilkent.cs319.team9.ta_management_system.model.TA;
import edu.bilkent.cs319.team9.ta_management_system.service.BusyHourService;
import edu.bilkent.cs319.team9.ta_management_system.service.TAService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ta/{taId}/busy-hours")
@RequiredArgsConstructor
public class BusyHourController {

    private final BusyHourService busyHourService;
    private final TAService taService;

    @GetMapping
    public ResponseEntity<List<BusyHour>> list(@PathVariable Long taId) {
        // ensure TA exists
        taService.findById(taId);
        return ResponseEntity.ok(busyHourService.findByTaId(taId));
    }

    @PostMapping
    public ResponseEntity<BusyHour> create(
            @PathVariable Long taId,
            @RequestBody BusyHour busyHour
    ) {
        TA ta = taService.findById(taId);
        busyHour.setTa(ta);
        BusyHour created = busyHourService.create(busyHour);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long taId,
            @PathVariable Long id
    ) {
        BusyHour slot = busyHourService.findById(id);
        if (!slot.getTa().getId().equals(taId)) {
            // either 404 or 403; 404 hides existence
            return ResponseEntity.notFound().build();
        }
        busyHourService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<BusyHour> update(
            @PathVariable Long taId,
            @PathVariable Long id,
            @RequestBody BusyHour busyHour
    ) {
        BusyHour existing = busyHourService.findById(id);
        if (!existing.getTa().getId().equals(taId)) {
            return ResponseEntity.notFound().build();
        }
        busyHour.setTa(existing.getTa());  // preserve original TA
        busyHour.setId(id);
        return ResponseEntity.ok(busyHourService.update(id, busyHour));
    }
}