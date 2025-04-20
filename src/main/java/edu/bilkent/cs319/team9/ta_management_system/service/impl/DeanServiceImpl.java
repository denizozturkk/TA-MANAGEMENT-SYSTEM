package edu.bilkent.cs319.team9.ta_management_system.service.impl;

import edu.bilkent.cs319.team9.ta_management_system.exception.NotFoundException;
import edu.bilkent.cs319.team9.ta_management_system.model.Dean;
import edu.bilkent.cs319.team9.ta_management_system.repository.DeanRepository;
import edu.bilkent.cs319.team9.ta_management_system.service.DeanService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class DeanServiceImpl implements DeanService {
    private final DeanRepository repo;

    @Override
    public Dean create(Dean d) {
        return repo.save(d);
    }

    @Override
    @Transactional(readOnly = true)
    public Dean findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Dean", id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Dean> findAll() {
        return repo.findAll();
    }

    @Override
    public Dean update(Long id, Dean d) {
        if (!repo.existsById(id)) throw new NotFoundException("Dean", id);
        d.setUserID(id);
        return repo.save(d);
    }

    @Override
    public void delete(Long id) {
        repo.deleteById(id);
    }
}
