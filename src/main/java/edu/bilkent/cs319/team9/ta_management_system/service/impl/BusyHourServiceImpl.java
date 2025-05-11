package edu.bilkent.cs319.team9.ta_management_system.service.impl;

import edu.bilkent.cs319.team9.ta_management_system.exception.NotFoundException;
import edu.bilkent.cs319.team9.ta_management_system.model.BusyHour;
import edu.bilkent.cs319.team9.ta_management_system.model.TA;
import edu.bilkent.cs319.team9.ta_management_system.repository.BusyHourRepository;
import edu.bilkent.cs319.team9.ta_management_system.service.BusyHourService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
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
        existing.setStartDateTime(busyHour.getStartDateTime());
        existing.setEndDateTime(busyHour.getEndDateTime());
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
        List<BusyHour> overlaps = repo.findByTa_Id(taId).stream()
                .filter(bh -> bh.overlaps(start, end))
                .toList();
        return overlaps.isEmpty();
    }

    @Override
    public BusyHour makeBusyHour(TA ta, LocalDateTime start, LocalDateTime end) {
        return BusyHour.builder()
                .ta(ta)
                .startDateTime(start)
                .endDateTime(end)
                .build();
    }
}
