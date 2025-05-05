package edu.bilkent.cs319.team9.ta_management_system.controller;

import edu.bilkent.cs319.team9.ta_management_system.dto.NotificationDto;
import edu.bilkent.cs319.team9.ta_management_system.model.Notification;
import edu.bilkent.cs319.team9.ta_management_system.model.User;
import edu.bilkent.cs319.team9.ta_management_system.security.CustomUserDetails;
import edu.bilkent.cs319.team9.ta_management_system.service.NotificationService;
import edu.bilkent.cs319.team9.ta_management_system.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    private final NotificationService notificationService;
    private final UserService userService;

    public NotificationController(NotificationService ns, UserService us) {
        this.notificationService = ns;
        this.userService = us;
    }

    @PostMapping
    public ResponseEntity<NotificationDto> create(@RequestBody NotificationDto n) {
        User recipient = userService.findById(n.getRecipientId());

        Notification notif = Notification.builder()
                .message(n.getMessage())
                .recipient(recipient)
                .read(n.isRead())
                .build();

        Notification saved = notificationService.create(notif);

        NotificationDto responseDto = NotificationDto.builder()
                .id(saved.getId())
                .message(saved.getMessage())
                .recipientId(saved.getRecipient().getId())
                .timestamp(saved.getCreatedAt())
                .read(saved.isRead())
                .build();

        return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
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

    /** List my notifications */
    @GetMapping("/myBox")
    public List<NotificationDto> listMine(@AuthenticationPrincipal CustomUserDetails me) {
        return notificationService.fetchFor(me.getId()).stream()
                .map(n -> NotificationDto.builder()
                        .id(n.getId())
                        .message(n.getMessage())
                        .timestamp(n.getCreatedAt())
                        .read(n.isRead())
                        .recipientId(n.getRecipient().getId())
                        .build())
                .toList();

    }

    /** Mark a notification as read */
    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markRead(@PathVariable Long id) {
        notificationService.markRead(id);
        return ResponseEntity.ok().build();
    }
}
