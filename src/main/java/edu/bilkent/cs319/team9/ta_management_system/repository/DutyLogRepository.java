package edu.bilkent.cs319.team9.ta_management_system.repository;

import edu.bilkent.cs319.team9.ta_management_system.model.DutyLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface DutyLogRepository extends JpaRepository<DutyLog, Long> {
    List<DutyLog> findByDateTimeBetween(LocalDateTime from, LocalDateTime to);
    List<DutyLog> findByTa_Id(Long taId);

}