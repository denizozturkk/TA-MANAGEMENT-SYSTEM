package edu.bilkent.cs319.team9.ta_management_system.repository;

import edu.bilkent.cs319.team9.ta_management_system.model.BusyHour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public interface BusyHourRepository extends JpaRepository<BusyHour, Long> {
    /** fetch all busy slots for a given TA */
    List<BusyHour> findByTa_Id(Long taId);
    @Query("SELECT b FROM BusyHour b WHERE b.ta.id = :taId AND b.startDateTime < :endTime AND b.endDateTime > :startTime")
    List<BusyHour> findByTAAndTimeRange(@Param("taId") Long taId,
                                        @Param("startTime") LocalDateTime startTime,
                                        @Param("endTime") LocalDateTime endTime);
}
