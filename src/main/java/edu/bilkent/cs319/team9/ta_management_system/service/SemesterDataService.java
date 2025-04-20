package edu.bilkent.cs319.team9.ta_management_system.service;

import edu.bilkent.cs319.team9.ta_management_system.model.SemesterData;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface SemesterDataService {
    SemesterData create(SemesterData s);
    SemesterData findById(Long id);
    List<SemesterData> findAll();
    SemesterData update(Long id, SemesterData s);
    void delete(Long id);
    void upload(MultipartFile file);
}