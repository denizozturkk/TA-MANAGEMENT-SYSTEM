package edu.bilkent.cs319.team9.ta_management_system.service;

import edu.bilkent.cs319.team9.ta_management_system.model.Report;
import java.util.List;

public interface ReportService {
    Report create(Report r);
    Report findById(Long id);
    List<Report> findAll();
    Report update(Long id, Report r);
    void delete(Long id);
}