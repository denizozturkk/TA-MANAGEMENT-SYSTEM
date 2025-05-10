package edu.bilkent.cs319.team9.ta_management_system.service;

import edu.bilkent.cs319.team9.ta_management_system.model.DutyLog;
import java.util.List;

public interface DutyLogService {
    DutyLog create(DutyLog d);
    DutyLog findById(Long id);
    List<DutyLog> findAll();
    DutyLog update(Long id, DutyLog d);
    void delete(Long id);
    List<DutyLog> findByTaId(Long taId);

    List<DutyLog> findByFacultyId(Long facId);
}
