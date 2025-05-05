package edu.bilkent.cs319.team9.ta_management_system.service.impl;

import edu.bilkent.cs319.team9.ta_management_system.exception.NotFoundException;
import edu.bilkent.cs319.team9.ta_management_system.model.DutyLog;
import edu.bilkent.cs319.team9.ta_management_system.repository.DutyLogRepository;
import edu.bilkent.cs319.team9.ta_management_system.service.DutyLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class DutyLogServiceImpl implements DutyLogService {
    private final DutyLogRepository repo;

    @Override
    public DutyLog create(DutyLog d) {
        return repo.save(d);
    }

    @Override
    @Transactional(readOnly = true)
    public DutyLog findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new NotFoundException("DutyLog", id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<DutyLog> findAll() {
        return repo.findAll();
    }

    @Override
    public DutyLog update(Long id, DutyLog d) {
        if (!repo.existsById(id)) throw new NotFoundException("DutyLog", id);
        d.setId(id);
        return repo.save(d);
    }

    @Override
    public void delete(Long id) {
        repo.deleteById(id);
    }
    @Override
    @Transactional(readOnly = true)
    public List<DutyLog> findByTaId(Long taId) {
        return repo.findByTa_Id(taId);
    }
}