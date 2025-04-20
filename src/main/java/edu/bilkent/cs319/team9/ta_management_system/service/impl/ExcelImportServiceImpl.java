package edu.bilkent.cs319.team9.ta_management_system.service.impl;

import edu.bilkent.cs319.team9.ta_management_system.exception.NotFoundException;
import edu.bilkent.cs319.team9.ta_management_system.model.ExcelImport;
import edu.bilkent.cs319.team9.ta_management_system.repository.ExcelImportRepository;
import edu.bilkent.cs319.team9.ta_management_system.service.ExcelImportService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class ExcelImportServiceImpl implements ExcelImportService {
    private final ExcelImportRepository repo;

    @Override
    public ExcelImport create(ExcelImport e) {
        return repo.save(e);
    }

    @Override
    @Transactional(readOnly = true)
    public ExcelImport findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new NotFoundException("ExcelImport", id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExcelImport> findAll() {
        return repo.findAll();
    }

    @Override
    public ExcelImport update(Long id, ExcelImport e) {
        if (!repo.existsById(id)) throw new NotFoundException("ExcelImport", id);
        e.setId(id);
        return repo.save(e);
    }

    @Override
    public void delete(Long id) {
        repo.deleteById(id);
    }

    @Override
    public void importExcel(MultipartFile file) {
        // TODO: your real parsing logic here.
        // For now, just store the original file bytes + metadata:
        try {
            ExcelImport record = ExcelImport.builder()
                    .fileName(file.getOriginalFilename())
                    .contentType(file.getContentType())
                    .data(file.getBytes())
                    .build();
            repo.save(record);
        } catch (IOException ex) {
            throw new RuntimeException("Failed to read Excel file", ex);
        }
    }
}