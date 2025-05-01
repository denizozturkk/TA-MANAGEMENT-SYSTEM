package edu.bilkent.cs319.team9.ta_management_system.controller;

import edu.bilkent.cs319.team9.ta_management_system.dto.TADto;
import edu.bilkent.cs319.team9.ta_management_system.mapper.EntityMapperService;
import edu.bilkent.cs319.team9.ta_management_system.model.TA;
import edu.bilkent.cs319.team9.ta_management_system.service.TAService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ta")
public class TAController {

    private final TAService taService;
    private final EntityMapperService mapper;

    public TAController(TAService taService, EntityMapperService mapper) {
        this.taService = taService;
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
        List<TADto> dtoList = taService.findAll()
                .stream()
                .map(mapper::toDto)
                .toList();
        return ResponseEntity.ok(dtoList);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TADto> update(@PathVariable Long id, @RequestBody TADto taDto) {
        TA updated = taService.update(id, mapper.toEntity(taDto));
        return ResponseEntity.ok(mapper.toDto(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        taService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
