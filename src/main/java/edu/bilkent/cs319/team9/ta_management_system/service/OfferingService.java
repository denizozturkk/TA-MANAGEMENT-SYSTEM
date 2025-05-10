package edu.bilkent.cs319.team9.ta_management_system.service;

import edu.bilkent.cs319.team9.ta_management_system.model.Offering;
import java.util.List;
import java.util.Optional;

public interface OfferingService {
    Offering create(Offering o);
    Offering findById(Long id);
    List<Offering> findAll();
    Offering update(Long id, Offering o);
    void delete(Long id);
    Optional<Offering> findByCourseCodeSemesterYear(
            String courseCode,
            String semester,
            Integer year
    );

    List<Offering> findByFacultyId(Long facultyId);
}
