package edu.bilkent.cs319.team9.ta_management_system.service;

import edu.bilkent.cs319.team9.ta_management_system.model.ProctorAssignment;
import java.util.List;

public interface ProctorAssignmentService {
    ProctorAssignment create(ProctorAssignment p);
    ProctorAssignment findById(Long id);
    List<ProctorAssignment> findAll();
    ProctorAssignment update(Long id, ProctorAssignment p);
    void delete(Long id);
    void deleteAllByExamId(Long examId);
    List<ProctorAssignment> findByTaId(Long taId);
    List<ProctorAssignment> findByExamId(Long examId);
}