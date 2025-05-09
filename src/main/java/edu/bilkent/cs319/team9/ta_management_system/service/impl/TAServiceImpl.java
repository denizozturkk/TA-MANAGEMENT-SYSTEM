package edu.bilkent.cs319.team9.ta_management_system.service.impl;

import edu.bilkent.cs319.team9.ta_management_system.dto.TADto;
import edu.bilkent.cs319.team9.ta_management_system.exception.NotFoundException;
import edu.bilkent.cs319.team9.ta_management_system.mapper.EntityMapperService;
import edu.bilkent.cs319.team9.ta_management_system.model.TA;
import edu.bilkent.cs319.team9.ta_management_system.repository.TARepository;
import edu.bilkent.cs319.team9.ta_management_system.service.TAService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class TAServiceImpl implements TAService {
    private final TARepository repo;

    @Override
    public TA create(TA ta) {
        return repo.save(ta);
    }

    @Override
    @Transactional(readOnly = true)
    public TA findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new NotFoundException("TA", id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<TA> findAll() {
        return repo.findAll();
    }

    @Override
    public TA update(Long id, TA ta) {
        if (!repo.existsById(id)) throw new NotFoundException("TA", id);
        ta.setId(id);
        return repo.save(ta);
    }

    @Override
    public void delete(Long id) {
        repo.deleteById(id);
    }

    public List<TA> findTAsByOfferingId(Long offeringId) {
        return repo.findTAsByOfferingId(offeringId);
    }

}
