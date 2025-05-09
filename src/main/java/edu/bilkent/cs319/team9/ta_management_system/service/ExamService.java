package edu.bilkent.cs319.team9.ta_management_system.service;

import edu.bilkent.cs319.team9.ta_management_system.model.Exam;
import java.util.List;

public interface ExamService {
    Exam create(Exam e);
    Exam findById(Long id);
    List<Exam> findAll();
    Exam update(Long id, Exam e);
    void delete(Long id);
    List<Exam> findByOfferingId(Long offeringId);
    List<Exam> findUnderProctoredByOfferingId(Long offeringId);
}
