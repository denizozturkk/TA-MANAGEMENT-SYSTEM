package edu.bilkent.cs319.team9.ta_management_system.service;

import org.springframework.web.multipart.MultipartFile;

public interface ExcelFileService {
    /**
     * Stores the raw Excel file and returns its generated ID.
     */
    Long store(MultipartFile file) throws java.io.IOException;
}
