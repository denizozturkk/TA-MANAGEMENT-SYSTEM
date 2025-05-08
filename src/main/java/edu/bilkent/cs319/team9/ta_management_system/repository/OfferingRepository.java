package edu.bilkent.cs319.team9.ta_management_system.repository;

import edu.bilkent.cs319.team9.ta_management_system.model.Course;
import edu.bilkent.cs319.team9.ta_management_system.model.FacultyMember;
import edu.bilkent.cs319.team9.ta_management_system.model.Offering;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface OfferingRepository extends JpaRepository<Offering, Long> {
    @Modifying
    @Transactional
    @Query(
            value = "UPDATE offering_ta " +
                    "SET ta_id    = :newTaId " +
                    "WHERE offering_id = :offeringId " +
                    "  AND ta_id       = :oldTaId",
            nativeQuery = true
    )
    int replaceTaInJoinTable(
            @Param("offeringId") Long offeringId,
            @Param("oldTaId")    Long oldTaId,
            @Param("newTaId")    Long newTaId
    );
    Optional<Offering> findByCourse_CourseCodeAndSemesterAndYear(
            String courseCode,
            String semester,
            Integer year
    );

    Optional<Offering> findById(Long id);
    List<Offering> findByInstructor(FacultyMember instructor);

    Optional<Offering> findByCourseAndInstructorAndYearAndSemester(
            Course course,
            FacultyMember instructor,
            int year,
            String semester
    );
}