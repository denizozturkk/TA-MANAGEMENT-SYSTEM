package edu.bilkent.cs319.team9.ta_management_system.controller;

import edu.bilkent.cs319.team9.ta_management_system.dto.OfferingDto;
import edu.bilkent.cs319.team9.ta_management_system.model.Offering;
import edu.bilkent.cs319.team9.ta_management_system.service.CourseService;
import edu.bilkent.cs319.team9.ta_management_system.service.OfferingService;
import edu.bilkent.cs319.team9.ta_management_system.mapper.EntityMapperService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/offerings")
public class OfferingController {

    private final OfferingService offeringService;
    private final CourseService courseService;
    private final EntityMapperService mapper;

    public OfferingController(OfferingService offeringService, CourseService courseService, EntityMapperService mapper) {
        this.offeringService = offeringService;
        this.courseService = courseService;
        this.mapper = mapper;
    }

    @PostMapping
    public ResponseEntity<OfferingDto> create(@RequestBody OfferingDto dto) {
        Offering entity = mapper.toEntity(dto);
        Offering saved = offeringService.create(entity);
        return new ResponseEntity<>(mapper.toDto(saved), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OfferingDto> getById(@PathVariable Long id) {
        Offering offering = offeringService.findById(id);
        return ResponseEntity.ok(mapper.toDto(offering));
    }

    @GetMapping
    public ResponseEntity<List<OfferingDto>> getAll() {
        List<OfferingDto> dtos = offeringService.findAll()
                .stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OfferingDto> update(@PathVariable Long id, @RequestBody OfferingDto dto) {
        Offering entity = mapper.toEntity(dto);
        Offering updated = offeringService.update(id, entity);
        return ResponseEntity.ok(mapper.toDto(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        offeringService.delete(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/find-id-by-code")
    public ResponseEntity<Long> findOfferingId(
            @RequestParam String courseCode,
            @RequestParam String semester,
            @RequestParam Integer year
    ) {
        return courseService.findByCode(courseCode)
                .map(course -> offeringService
                        .findByCourseSemesterYear(course.getId(), semester, year)
                        .map(off -> ResponseEntity.ok(off.getId()))
                        .orElseGet(() -> ResponseEntity.notFound().build())
                )
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }
}
