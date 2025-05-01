package edu.bilkent.cs319.team9.ta_management_system.service.impl;

import edu.bilkent.cs319.team9.ta_management_system.exception.NotFoundException;
import edu.bilkent.cs319.team9.ta_management_system.model.*;
import edu.bilkent.cs319.team9.ta_management_system.repository.DutyExtensionRequestRepository;
import edu.bilkent.cs319.team9.ta_management_system.repository.DutyLogRepository;
import edu.bilkent.cs319.team9.ta_management_system.service.DutyExtensionRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class DutyExtensionRequestServiceImpl implements DutyExtensionRequestService {

    private final DutyExtensionRequestRepository repo;
    private final DutyLogRepository dutyLogRepository;

    @Override
    public DutyExtensionRequest create(DutyExtensionRequest request) {
        request.setStatus(ExtensionRequestStatus.PENDING);
        request.setRequestedAt(LocalDateTime.now());
        return repo.save(request);
    }

    @Override
    public DutyExtensionRequest respond(Long id, ExtensionRequestStatus status) {
        DutyExtensionRequest req = repo.findById(id)
                .orElseThrow(() -> new NotFoundException("DutyExtensionRequest", id));

        req.setStatus(status);

        if (status == ExtensionRequestStatus.ACCEPTED) {
            DutyLog dl = req.getDutyLog();
            LocalDateTime newDeadline = dl.getDateTime().plusDays(req.getRequestedExtensionDays());
            dl.setDateTime(newDeadline);
            dutyLogRepository.save(dl); // güncellenmiş deadline kaydedilir
        }

        return repo.save(req);
    }

    @Override
    public List<DutyExtensionRequest> getAll() {
        return repo.findAll();
    }

    @Override
    public List<DutyExtensionRequest> getByInstructorId(Long instructorId) {
        return repo.findByInstructorId(instructorId);
    }

    @Override
    public List<DutyExtensionRequest> getByTaId(Long taId) {
        return repo.findByTaId(taId);
    }

    @Override
    public DutyExtensionRequest getById(Long id) {
        return repo.findById(id).orElseThrow(() -> new NotFoundException("DutyExtensionRequest", id));
    }
}
