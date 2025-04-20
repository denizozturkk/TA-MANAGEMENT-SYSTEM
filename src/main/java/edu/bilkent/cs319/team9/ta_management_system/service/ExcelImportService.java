package edu.bilkent.cs319.team9.ta_management_system.service;

import edu.bilkent.cs319.team9.ta_management_system.model.ExcelImport;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ExcelImportService {
    ExcelImport create(ExcelImport e);
    ExcelImport findById(Long id);
    List<ExcelImport> findAll();
    ExcelImport update(Long id, ExcelImport e);
    void delete(Long id);
    void importExcel(MultipartFile file);
}
