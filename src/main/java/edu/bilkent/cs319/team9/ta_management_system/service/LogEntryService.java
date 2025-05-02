package edu.bilkent.cs319.team9.ta_management_system.service;

import edu.bilkent.cs319.team9.ta_management_system.model.LogEntry;
import edu.bilkent.cs319.team9.ta_management_system.model.LogType;

import java.time.LocalDateTime;
import java.util.List;

public interface LogEntryService {
    LogEntry create(LogEntry l);
    LogEntry findById(Long id);
    List<LogEntry> findAll();
    LogEntry update(Long id, LogEntry l);
    void delete(Long id);

//    List<LogEntry> findByActorId(String actorId);
//    List<LogEntry> searchLogs(String actorId, LogType type, LocalDateTime startDate, LocalDateTime endDate, Integer limit);


}