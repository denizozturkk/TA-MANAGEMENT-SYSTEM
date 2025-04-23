package edu.bilkent.cs319.team9.ta_management_system.controller;

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
    public TAController(TAService ts) {
        this.taService = ts;
    }

    @PostMapping
    public ResponseEntity<TA> create(@RequestBody TA ta) {
        return new ResponseEntity<>(taService.create(ta), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TA> getById(@PathVariable Long id) {
        return ResponseEntity.ok(taService.findById(id));
    }

    @GetMapping
    public ResponseEntity<List<TA>> getAll() {
        return ResponseEntity.ok(taService.findAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<TA> update(@PathVariable Long id, @RequestBody TA ta) {
        return ResponseEntity.ok(taService.update(id, ta));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        taService.delete(id);
        return ResponseEntity.noContent().build();
    }
}