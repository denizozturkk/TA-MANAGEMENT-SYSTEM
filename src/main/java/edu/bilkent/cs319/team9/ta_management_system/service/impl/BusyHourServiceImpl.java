package edu.bilkent.cs319.team9.ta_management_system.service.impl;


import edu.bilkent.cs319.team9.ta_management_system.exception.NotFoundException;
import edu.bilkent.cs319.team9.ta_management_system.model.BusyHour;
import edu.bilkent.cs319.team9.ta_management_system.model.TA;
import edu.bilkent.cs319.team9.ta_management_system.repository.BusyHourRepository;
import edu.bilkent.cs319.team9.ta_management_system.service.BusyHourService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class BusyHourServiceImpl implements BusyHourService {

    private final BusyHourRepository repo;
    private static final int LOCAL_UTC_SHIFT_HOURS = 3;

    @Override
    public BusyHour create(BusyHour busyHour) {
        return repo.save(busyHour);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BusyHour> findByTaId(Long taId) {
        return repo.findByTa_Id(taId);
    }

    @Override
    public BusyHour update(Long id, BusyHour busyHour) {
        BusyHour existing = repo.findById(id)
                .orElseThrow(() -> new NotFoundException("BusyHour", id));
        existing.setDayOfWeek(busyHour.getDayOfWeek());
        existing.setStartTime(busyHour.getStartTime());
        existing.setEndTime(busyHour.getEndTime());
        // ensure the TA reference stays correct
        existing.setTa(busyHour.getTa());
        return repo.save(existing);
    }
    @Override
    @Transactional(readOnly = true)
    public BusyHour findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new NotFoundException("BusyHour", id));
    }

    @Override
    public void delete(Long id) {
        repo.deleteById(id);
    }
    @Override
    public boolean isTAAvailable(Long taId, LocalDateTime start, LocalDateTime end) {
        DayOfWeek day = start.getDayOfWeek();
        LocalTime startTime = start.toLocalTime();
        LocalTime endTime = end.toLocalTime();
        List<BusyHour> overlaps = repo.findOverlappingBusyHours(taId, day, startTime, endTime);
        return overlaps.isEmpty();
    }
    @Override
    public BusyHour makeBusyHour(TA ta,
                                 LocalDateTime start,
                                 LocalDateTime end) {

        return BusyHour.builder()
                .ta(ta)
                .dayOfWeek(start.getDayOfWeek())
                .startTime(start.minusHours(LOCAL_UTC_SHIFT_HOURS).toLocalTime())
                .endTime(end.  minusHours(LOCAL_UTC_SHIFT_HOURS).toLocalTime())
                .build();
    }
}
