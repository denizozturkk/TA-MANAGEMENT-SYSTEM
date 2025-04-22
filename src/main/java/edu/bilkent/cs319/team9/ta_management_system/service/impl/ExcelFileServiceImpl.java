package edu.bilkent.cs319.team9.ta_management_system.service.impl;


import edu.bilkent.cs319.team9.ta_management_system.model.ExcelFile;
import edu.bilkent.cs319.team9.ta_management_system.repository.ExcelFileRepository;
import edu.bilkent.cs319.team9.ta_management_system.service.ExcelFileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class ExcelFileServiceImpl implements ExcelFileService {

    private final ExcelFileRepository repository;

    @Override
    public Long store(MultipartFile file) throws java.io.IOException {
        ExcelFile upload = ExcelFile.builder()
                .filename(file.getOriginalFilename())
                .contentType(file.getContentType())
                .data(file.getBytes())
                .uploadedAt(LocalDateTime.now())
                .build();
        return repository.save(upload).getId();
    }
}
