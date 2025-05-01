package edu.bilkent.cs319.team9.ta_management_system.repository;

import edu.bilkent.cs319.team9.ta_management_system.model.ProctorAssignment;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProctorAssignmentRepository extends JpaRepository<ProctorAssignment, Long> {
    @Modifying
    @Transactional
    @Query(value =
            "UPDATE proctor_assignment " +
                    "   SET ta_id = :newTaId " +
                    " WHERE id    = :paId",
            nativeQuery = true
    )
    int replaceTa(
            @Param("paId")    Long paId,
            @Param("newTaId") Long newTaId
    );
}
