package edu.bilkent.cs319.team9.ta_management_system.service;

import edu.bilkent.cs319.team9.ta_management_system.model.BusyHour;

import java.util.List;

public interface BusyHourService {
    BusyHour create(BusyHour busyHour);
    List<BusyHour> findByTaId(Long taId);
    BusyHour findById(Long id);
    BusyHour update(Long id, BusyHour busyHour);
    void delete(Long id);
}