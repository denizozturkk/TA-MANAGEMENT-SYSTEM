package edu.bilkent.cs319.team9.ta_management_system.service.impl;

import edu.bilkent.cs319.team9.ta_management_system.exception.NotFoundException;
import edu.bilkent.cs319.team9.ta_management_system.model.SemesterData;
import edu.bilkent.cs319.team9.ta_management_system.repository.SemesterDataRepository;
import edu.bilkent.cs319.team9.ta_management_system.service.SemesterDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class SemesterDataServiceImpl implements SemesterDataService {
    private final SemesterDataRepository repo;

    @Override
    public SemesterData create(SemesterData s) {
        return repo.save(s);
    }

    @Override
    @Transactional(readOnly = true)
    public SemesterData findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new NotFoundException("SemesterData", id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<SemesterData> findAll() {
        return repo.findAll();
    }

    @Override
    public SemesterData update(Long id, SemesterData s) {
        if (!repo.existsById(id)) throw new NotFoundException("SemesterData", id);
        s.setId(id);
        return repo.save(s);
    }

    @Override
    public void delete(Long id) {
        repo.deleteById(id);
    }
    @Override
    public void upload(MultipartFile file) {
        // TODO: your real Excel parsing & mapping logic here.
        // Example stub: save raw bytes + filename:
        try {
            SemesterData data = SemesterData.builder()
                    .fileName(file.getOriginalFilename())
                    .contentType(file.getContentType())
                    .data(file.getBytes())
                    .build();
            repo.save(data);
        } catch (IOException ex) {
            throw new RuntimeException("Failed to read semester data file", ex);
        }
    }
}
