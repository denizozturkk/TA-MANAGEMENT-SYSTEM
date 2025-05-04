package edu.bilkent.cs319.team9.ta_management_system.service;

import edu.bilkent.cs319.team9.ta_management_system.model.ExcelImport;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface ExcelImportService {
    void importTaSheet(MultipartFile file) throws IOException;
    void importStudentSheet(MultipartFile file) throws IOException;
    void importFacultySheet(MultipartFile file) throws IOException;
    void importOfferingSheet(MultipartFile file) throws IOException;
    void importEnrollmentSheet(MultipartFile file) throws IOException;
}
