package edu.bilkent.cs319.team9.ta_management_system.repository;

import edu.bilkent.cs319.team9.ta_management_system.model.TA;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface    TARepository extends JpaRepository<TA, Long> {
    Optional<TA> findByBilkentTaId(String bilkentId);
    @Query("SELECT t FROM TA t JOIN t.offerings o WHERE o.id = :offeringId")
    List<TA> findTAsByOfferingId(@Param("offeringId") Long offeringId);
}
