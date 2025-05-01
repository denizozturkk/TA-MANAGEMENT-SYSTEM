package edu.bilkent.cs319.team9.ta_management_system.repository;

import edu.bilkent.cs319.team9.ta_management_system.model.LogEntry;
import edu.bilkent.cs319.team9.ta_management_system.model.LogEventType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

import java.time.LocalDateTime;
import java.util.List;

public interface LogEntryRepository extends JpaRepository<LogEntry,Long> {
    List<LogEntry> findByEventTypeOrderByTimestampDesc(LogEventType eventType);
    List<LogEntry> findByEmailOrderByTimestampDesc(String email);
    List<LogEntry> findByTimestampBetween(LocalDateTime from, LocalDateTime to);

    List<LogEntry> findByEventTypeAndTimestampBetween(LogEventType eventType, LocalDateTime from, LocalDateTime to);

}
