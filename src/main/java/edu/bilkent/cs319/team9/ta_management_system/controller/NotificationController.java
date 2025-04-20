package edu.bilkent.cs319.team9.ta_management_system.controller;

import edu.bilkent.cs319.team9.ta_management_system.model.Notification;
import edu.bilkent.cs319.team9.ta_management_system.service.NotificationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    private final NotificationService notificationService;
    public NotificationController(NotificationService ns) {
        this.notificationService = ns;
    }

    @PostMapping
    public ResponseEntity<Notification> create(@RequestBody Notification n) {
        return new ResponseEntity<>(notificationService.create(n), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Notification> getById(@PathVariable Long id) {
        return ResponseEntity.ok(notificationService.findById(id));
    }

    @GetMapping
    public ResponseEntity<List<Notification>> getAll() {
        return ResponseEntity.ok(notificationService.findAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Notification> update(@PathVariable Long id,
                                               @RequestBody Notification n) {
        return ResponseEntity.ok(notificationService.update(id, n));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        notificationService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
