package edu.bilkent.cs319.team9.ta_management_system.repository;

import edu.bilkent.cs319.team9.ta_management_system.model.BusyHour;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BusyHourRepository extends JpaRepository<BusyHour, Long> {
    /** fetch all busy slots for a given TA */
    List<BusyHour> findByTa_Id(Long taId);
}
