package edu.bilkent.cs319.team9.ta_management_system.repository;

import edu.bilkent.cs319.team9.ta_management_system.model.LogEntry;
import edu.bilkent.cs319.team9.ta_management_system.model.LogType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface LogEntryRepository extends JpaRepository<LogEntry, Long> {
    List<LogEntry> findByActorID(String actorId);

    // Filter implemented.
    @Query("SELECT l FROM LogEntry l " +
            "WHERE l.actorID = :actorId " +
            "AND (:type IS NULL OR l.type = :type) " +
            "AND (:startDate IS NULL OR l.timestamp >= :startDate) " +
            "AND (:endDate IS NULL OR l.timestamp <= :endDate) " +
            "ORDER BY l.timestamp DESC")
    List<LogEntry> searchLogs(@Param("actorId") String actorId,
                              @Param("type") LogType type,
                              @Param("startDate") LocalDateTime startDate,
                              @Param("endDate") LocalDateTime endDate);
}
