package edu.bilkent.cs319.team9.ta_management_system.service.impl;


import edu.bilkent.cs319.team9.ta_management_system.exception.NotFoundException;
import edu.bilkent.cs319.team9.ta_management_system.model.Notification;
import edu.bilkent.cs319.team9.ta_management_system.model.User;
import edu.bilkent.cs319.team9.ta_management_system.repository.NotificationRepository;
import edu.bilkent.cs319.team9.ta_management_system.repository.UserRepository;
import edu.bilkent.cs319.team9.ta_management_system.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {
    private final NotificationRepository repo;
    private final UserRepository userRepo;

    @Override
    public Notification create(Notification n) {
        return repo.save(n);
    }

    @Override
    @Transactional(readOnly = true)
    public Notification findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Notification", id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Notification> findAll() {
        return repo.findAll();
    }

    @Override
    public Notification update(Long id, Notification n) {
        if (!repo.existsById(id)) throw new NotFoundException("Notification", id);
        n.setId(id);
        return repo.save(n);
    }

    @Override
    public void delete(Long id) {
        repo.deleteById(id);
    }

    /**
     * Create an in-app notification and also fire off an email.
     *
     * @param recipientId  the user’s PK
     * @param recipientEmail  to: header on the email
     * @param subject  both the email SUBJECT and the Notification.message
     * @param body     the email text
     */
    @Transactional
    public void notifyUser(Long recipientId, String recipientEmail, String subject, String body) {
        // 1) persist in-app notification
        User u = userRepo.findById(recipientId).orElseThrow(() -> new NotFoundException("User", recipientId));

        Notification n = Notification.builder()
                .recipient(u)
                .message(subject + ": " + body)
                .read(false)
                .build();
        repo.save(n);
    }

    /** Fetch a user’s notifications, newest first */
    public List<Notification> fetchFor(Long recipientId) {
        return repo.findByRecipient_IdOrderByCreatedAtDesc(recipientId);
    }

    /** Mark one as read */
    @Transactional
    public void markRead(Long notificationId) {
        repo.findById(notificationId).ifPresent(n -> {
            n.setRead(true);
            repo.save(n);
        });
    }
}