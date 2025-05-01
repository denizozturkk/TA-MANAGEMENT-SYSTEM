package edu.bilkent.cs319.team9.ta_management_system.service;

import edu.bilkent.cs319.team9.ta_management_system.model.TutorGraderApplication;

import java.util.List;

public interface TutorGraderApplicationService {
    TutorGraderApplication create(TutorGraderApplication app);
    TutorGraderApplication findById(Long id);
    List<TutorGraderApplication> findAll();
    TutorGraderApplication update(Long id, TutorGraderApplication app);
    void delete(Long id);
}
