package edu.bilkent.cs319.team9.ta_management_system.service.impl;

import edu.bilkent.cs319.team9.ta_management_system.exception.NotFoundException;
import edu.bilkent.cs319.team9.ta_management_system.model.LeaveRequest;
import edu.bilkent.cs319.team9.ta_management_system.repository.LeaveRequestRepository;
import edu.bilkent.cs319.team9.ta_management_system.service.LeaveRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class LeaveRequestServiceImpl implements LeaveRequestService {
    private final LeaveRequestRepository repo;

    @Override
    public LeaveRequest create(LeaveRequest l) {
        return repo.save(l);
    }

    @Override
    @Transactional(readOnly = true)
    public LeaveRequest findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new NotFoundException("LeaveRequest", id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<LeaveRequest> findAll() {
        return repo.findAll();
    }

    @Override
    public LeaveRequest update(Long id, LeaveRequest l) {
        if (!repo.existsById(id)) throw new NotFoundException("LeaveRequest", id);
        l.setId(id);
        return repo.save(l);
    }

    @Override
    public void delete(Long id) {
        repo.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LeaveRequest> findByTaId(Long taId) {
        return repo.findAll().stream()
                .filter(lr -> lr.getTa() != null && lr.getTa().getId().equals(taId))
                .collect(Collectors.toList());
    }
}
