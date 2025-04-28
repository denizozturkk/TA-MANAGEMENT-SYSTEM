package edu.bilkent.cs319.team9.ta_management_system.service.impl;

import edu.bilkent.cs319.team9.ta_management_system.exception.NotFoundException;
import edu.bilkent.cs319.team9.ta_management_system.model.LogEntry;
import edu.bilkent.cs319.team9.ta_management_system.model.LogType;
import edu.bilkent.cs319.team9.ta_management_system.repository.LogEntryRepository;
import edu.bilkent.cs319.team9.ta_management_system.service.LogEntryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class LogEntryServiceImpl implements LogEntryService {
    private final LogEntryRepository repo;

    @Override
    public LogEntry create(LogEntry l) {
        return repo.save(l);
    }

    @Override
    @Transactional(readOnly = true)
    public LogEntry findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new NotFoundException("LogEntry", id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<LogEntry> findAll() {
        return repo.findAll();
    }

    @Override
    public LogEntry update(Long id, LogEntry l) {
        if (!repo.existsById(id)) throw new NotFoundException("LogEntry", id);
        l.setId(id);
        return repo.save(l);
    }

    @Override
    public void delete(Long id) {
        repo.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LogEntry> findByActorId(String actorId) {
        return repo.findByActorID(actorId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LogEntry> searchLogs(String actorId, LogType type, LocalDateTime startDate, LocalDateTime endDate, Integer limit) {
        List<LogEntry> logs = repo.searchLogs(actorId, type, startDate, endDate);
        if (limit != null && logs.size() > limit) {
            return logs.subList(0, limit);
        }
        return logs;
    }
}
