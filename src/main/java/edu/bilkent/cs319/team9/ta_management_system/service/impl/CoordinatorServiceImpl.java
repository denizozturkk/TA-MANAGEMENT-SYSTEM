package edu.bilkent.cs319.team9.ta_management_system.service.impl;


import edu.bilkent.cs319.team9.ta_management_system.exception.NotFoundException;
import edu.bilkent.cs319.team9.ta_management_system.model.Coordinator;
import edu.bilkent.cs319.team9.ta_management_system.repository.CoordinatorRepository;
import edu.bilkent.cs319.team9.ta_management_system.service.CoordinatorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class CoordinatorServiceImpl implements CoordinatorService {
    private final CoordinatorRepository repo;

    @Override
    public Coordinator create(Coordinator c) {
        return repo.save(c);
    }

    @Override
    @Transactional(readOnly = true)
    public Coordinator findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Coordinator", id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Coordinator> findAll() {
        return repo.findAll();
    }

    @Override
    public Coordinator update(Long id, Coordinator c) {
        if (!repo.existsById(id)) throw new NotFoundException("Coordinator", id);
        c.setUserID(id);
        return repo.save(c);
    }

    @Override
    public void delete(Long id) {
        repo.deleteById(id);
    }
}