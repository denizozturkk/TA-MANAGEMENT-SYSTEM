package edu.bilkent.cs319.team9.ta_management_system.service;

import edu.bilkent.cs319.team9.ta_management_system.model.Notification;
import java.util.List;

public interface NotificationService {
    Notification create(Notification n);
    Notification findById(Long id);
    List<Notification> findAll();
    Notification update(Long id, Notification n);
    void delete(Long id);
}
