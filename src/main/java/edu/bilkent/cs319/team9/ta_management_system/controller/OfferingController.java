package edu.bilkent.cs319.team9.ta_management_system.controller;

import edu.bilkent.cs319.team9.ta_management_system.dto.OfferingDto;
import edu.bilkent.cs319.team9.ta_management_system.exception.NotFoundException;
import edu.bilkent.cs319.team9.ta_management_system.mapper.EntityMapperService;
import edu.bilkent.cs319.team9.ta_management_system.model.Offering;
import edu.bilkent.cs319.team9.ta_management_system.service.OfferingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/offerings")
public class OfferingController {

    private final OfferingService offeringService;
    private final EntityMapperService mapper;

    public OfferingController(OfferingService offeringService, EntityMapperService mapper) {
        this.offeringService = offeringService;
        this.mapper = mapper;
    }

    @PostMapping
    public ResponseEntity<OfferingDto> create(@RequestBody OfferingDto dto) {
        Offering saved = offeringService.create(mapper.toEntity(dto));
        return ResponseEntity.ok(mapper.toDto(saved));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OfferingDto> getById(@PathVariable Long id) {
        Offering offering = offeringService.findById(id);
        return ResponseEntity.ok(mapper.toDto(offering));
    }

    @GetMapping
    public ResponseEntity<List<OfferingDto>> getAll() {
        List<OfferingDto> dtos = offeringService.findAll()
                .stream().map(mapper::toDto).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OfferingDto> update(@PathVariable Long id, @RequestBody OfferingDto dto) {
        Offering updated = offeringService.update(id, mapper.toEntity(dto));
        return ResponseEntity.ok(mapper.toDto(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        offeringService.delete(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/search")
    public ResponseEntity<OfferingDto> getByCourseCodeSemesterYear(
            @RequestParam("courseCode") String courseCode,
            @RequestParam("semester") String semester,
            @RequestParam("year") Integer year
    ) {
        Offering offering = offeringService
                .findByCourseCodeSemesterYear(courseCode, semester, year)
                .orElseThrow(() ->
                        new NotFoundException(
                                "Offering not found for courseCode=" + courseCode +
                                        ", semester=" + semester + ", year=" + year
                        )
                );
        return ResponseEntity.ok(mapper.toDto(offering));
    }
}
