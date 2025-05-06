package edu.bilkent.cs319.team9.ta_management_system.service.impl;

import edu.bilkent.cs319.team9.ta_management_system.exception.NotFoundException;
import edu.bilkent.cs319.team9.ta_management_system.model.Offering;
import edu.bilkent.cs319.team9.ta_management_system.repository.OfferingRepository;
import edu.bilkent.cs319.team9.ta_management_system.service.OfferingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class OfferingServiceImpl implements OfferingService {
    private final OfferingRepository repo;

    @Override
    public Offering create(Offering o) {
        return repo.save(o);
    }

    @Override
    @Transactional(readOnly = true)
    public Offering findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Offering", id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Offering> findAll() {
        return repo.findAll();
    }

    @Override
    public Offering update(Long id, Offering o) {
        if (!repo.existsById(id)) throw new NotFoundException("Offering", id);
        o.setId(id);
        return repo.save(o);
    }

    @Override
    public void delete(Long id) {
        repo.deleteById(id);
    }
    @Override
    public Optional<Offering> findByCourseSemesterYear(
            Long courseId, String semester, Integer year
    ) {
        return repo.findByCourse_IdAndSemesterAndYear(courseId, semester, year);
    }
}
