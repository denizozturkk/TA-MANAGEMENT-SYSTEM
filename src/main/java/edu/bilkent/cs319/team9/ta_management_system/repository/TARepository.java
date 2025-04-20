package edu.bilkent.cs319.team9.ta_management_system.repository;

import edu.bilkent.cs319.team9.ta_management_system.model.TA;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TARepository extends JpaRepository<TA, Long> {
}
