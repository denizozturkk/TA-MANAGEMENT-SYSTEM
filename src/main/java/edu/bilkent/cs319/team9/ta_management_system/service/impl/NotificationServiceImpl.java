package edu.bilkent.cs319.team9.ta_management_system.service.impl;


import edu.bilkent.cs319.team9.ta_management_system.exception.NotFoundException;
import edu.bilkent.cs319.team9.ta_management_system.model.Notification;
import edu.bilkent.cs319.team9.ta_management_system.repository.NotificationRepository;
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
}