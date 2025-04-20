package edu.bilkent.cs319.team9.ta_management_system.controller;

import edu.bilkent.cs319.team9.ta_management_system.model.Offering;
import edu.bilkent.cs319.team9.ta_management_system.service.OfferingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/offerings")
public class OfferingController {
    private final OfferingService offeringService;
    public OfferingController(OfferingService os) {
        this.offeringService = os;
    }

    @PostMapping
    public ResponseEntity<Offering> create(@RequestBody Offering o) {
        return new ResponseEntity<>(offeringService.create(o), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Offering> getById(@PathVariable Long id) {
        return ResponseEntity.ok(offeringService.findById(id));
    }

    @GetMapping
    public ResponseEntity<List<Offering>> getAll() {
        return ResponseEntity.ok(offeringService.findAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Offering> update(@PathVariable Long id,
                                           @RequestBody Offering o) {
        return ResponseEntity.ok(offeringService.update(id, o));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        offeringService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
