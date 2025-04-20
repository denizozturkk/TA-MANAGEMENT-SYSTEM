package edu.bilkent.cs319.team9.ta_management_system.service.impl;

import edu.bilkent.cs319.team9.ta_management_system.exception.NotFoundException;
import edu.bilkent.cs319.team9.ta_management_system.model.ProctorAssignment;
import edu.bilkent.cs319.team9.ta_management_system.repository.ProctorAssignmentRepository;
import edu.bilkent.cs319.team9.ta_management_system.service.ProctorAssignmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class ProctorAssignmentServiceImpl implements ProctorAssignmentService {
    private final ProctorAssignmentRepository repo;

    @Override
    public ProctorAssignment create(ProctorAssignment p) {
        return repo.save(p);
    }

    @Override
    @Transactional(readOnly = true)
    public ProctorAssignment findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new NotFoundException("ProctorAssignment", id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProctorAssignment> findAll() {
        return repo.findAll();
    }

    @Override
    public ProctorAssignment update(Long id, ProctorAssignment p) {
        if (!repo.existsById(id)) throw new NotFoundException("ProctorAssignment", id);
        p.setId(id);
        return repo.save(p);
    }

    @Override
    public void delete(Long id) {
        repo.deleteById(id);
    }
}
