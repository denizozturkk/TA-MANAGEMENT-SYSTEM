package edu.bilkent.cs319.team9.ta_management_system.service.impl;

import edu.bilkent.cs319.team9.ta_management_system.exception.NotFoundException;
import edu.bilkent.cs319.team9.ta_management_system.model.Report;
import edu.bilkent.cs319.team9.ta_management_system.repository.ReportRepository;
import edu.bilkent.cs319.team9.ta_management_system.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {
    private final ReportRepository repo;

    @Override
    public Report create(Report r) {
        return repo.save(r);
    }

    @Override
    @Transactional(readOnly = true)
    public Report findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Report", id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Report> findAll() {
        return repo.findAll();
    }

    @Override
    public Report update(Long id, Report r) {
        if (!repo.existsById(id)) throw new NotFoundException("Report", id);
        r.setId(id);
        return repo.save(r);
    }

    @Override
    public void delete(Long id) {
        repo.deleteById(id);
    }
}


