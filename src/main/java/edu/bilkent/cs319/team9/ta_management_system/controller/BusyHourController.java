// src/main/java/edu/bilkent/cs319/team9/ta_management_system/controller/BusyHourController.java
package edu.bilkent.cs319.team9.ta_management_system.controller;

import edu.bilkent.cs319.team9.ta_management_system.dto.BusyHourDto;
import edu.bilkent.cs319.team9.ta_management_system.model.TA;
import edu.bilkent.cs319.team9.ta_management_system.model.BusyHour;
import edu.bilkent.cs319.team9.ta_management_system.service.BusyHourService;
import edu.bilkent.cs319.team9.ta_management_system.service.TAService;
import edu.bilkent.cs319.team9.ta_management_system.mapper.EntityMapperService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ta/{taId}/busy-hours")
@RequiredArgsConstructor
public class BusyHourController {

    private final BusyHourService busyHourService;
    private final TAService taService;
    private final EntityMapperService mapper;

    @GetMapping
    public ResponseEntity<List<BusyHourDto>> list(@PathVariable Long taId) {
        taService.findById(taId);  // 404 if not exists
        List<BusyHourDto> dtos = busyHourService.findByTaId(taId).stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PostMapping
    public ResponseEntity<BusyHourDto> create(
            @PathVariable Long taId,
            @RequestBody BusyHourDto dto
    ) {
        TA ta = taService.findById(taId);
        BusyHour bh = mapper.toEntity(dto);
        bh.setTa(ta);
        BusyHour saved = busyHourService.create(bh);
        return new ResponseEntity<>(mapper.toDto(saved), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BusyHourDto> update(
            @PathVariable Long taId,
            @PathVariable Long id,
            @RequestBody BusyHourDto dto
    ) {
        BusyHour existing = busyHourService.findById(id);
        if (!existing.getTa().getId().equals(taId)) {
            return ResponseEntity.notFound().build();
        }
        BusyHour bh = mapper.toEntity(dto);
        bh.setId(id);
        bh.setTa(existing.getTa());
        BusyHour updated = busyHourService.update(id, bh);
        return ResponseEntity.ok(mapper.toDto(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long taId,
            @PathVariable Long id
    ) {
        BusyHour existing = busyHourService.findById(id);
        if (!existing.getTa().getId().equals(taId)) {
            return ResponseEntity.notFound().build();
        }
        busyHourService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/check-availability")
    public ResponseEntity<Boolean> checkAvailability(
            @PathVariable Long taId,
            @RequestParam String start,
            @RequestParam String end
    ) {
        LocalDateTime s = LocalDateTime.parse(start);
        LocalDateTime e = LocalDateTime.parse(end);
        boolean ok = busyHourService.isTAAvailable(taId, s, e);
        return ResponseEntity.ok(ok);
    }
}
