package edu.bilkent.cs319.team9.ta_management_system.service.impl;

import edu.bilkent.cs319.team9.ta_management_system.exception.NotFoundException;
import edu.bilkent.cs319.team9.ta_management_system.model.Coordinator;
import edu.bilkent.cs319.team9.ta_management_system.model.Offering;
import edu.bilkent.cs319.team9.ta_management_system.model.ProctorAssignment;
import edu.bilkent.cs319.team9.ta_management_system.model.TA;
import edu.bilkent.cs319.team9.ta_management_system.repository.CoordinatorRepository;
import edu.bilkent.cs319.team9.ta_management_system.repository.OfferingRepository;
import edu.bilkent.cs319.team9.ta_management_system.repository.TARepository;
import edu.bilkent.cs319.team9.ta_management_system.repository.ProctorAssignmentRepository;
import edu.bilkent.cs319.team9.ta_management_system.service.CoordinatorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class CoordinatorServiceImpl implements CoordinatorService {

    private final CoordinatorRepository coordRepo;
    private final OfferingRepository   offeringRepo;
    private final TARepository         taRepo;
    private final ProctorAssignmentRepository     paRepo;

    @Override
    public Coordinator create(Coordinator c) {
        return coordRepo.save(c);
    }

    @Override
    @Transactional(readOnly = true)
    public Coordinator findById(Long id) {
        return coordRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("Coordinator", id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Coordinator> findAll() {
        return coordRepo.findAll();
    }

    @Override
    public Coordinator update(Long id, Coordinator c) {
        if (!coordRepo.existsById(id))
            throw new NotFoundException("Coordinator", id);
        c.setId(id);
        return coordRepo.save(c);
    }

    @Override
    public void delete(Long id) {
        coordRepo.deleteById(id);
    }

    @Override
    @Transactional
    public void replaceTa(Long coordId, Long offeringId, Long oldTaId, Long newTaId) {
        // 1) ensure coordinator exists
        coordRepo.findById(coordId)
                .orElseThrow(() -> new NotFoundException("Coordinator", coordId));

        // 2) fire the raw UPDATE
        int updated = offeringRepo
                .replaceTaInJoinTable(offeringId, oldTaId, newTaId);
        if (updated == 0) {
            throw new IllegalArgumentException(
                    "No row in offering_ta for offering=" + offeringId +
                            " and ta=" + oldTaId
            );
        }
    }
    @Override
    @Transactional
    public void replaceProctorAssignmentTa(Long coordId,
                                           Long paId,
                                           Long newTaId) {
        // 1) validate coordinator
        coordRepo.findById(coordId)
                .orElseThrow(() -> new NotFoundException("Coordinator", coordId));

        // 2) fire raw UPDATE
        int updated = paRepo.replaceTa(paId, newTaId);
        if (updated == 0) {
            throw new IllegalArgumentException(
                    "No ProctorAssignment with id=" + paId + " to reassign");
        }
    }
}
