package edu.bilkent.cs319.team9.ta_management_system.service;

import edu.bilkent.cs319.team9.ta_management_system.model.Coordinator;
import java.util.List;

public interface CoordinatorService {
    Coordinator create(Coordinator c);
    Coordinator findById(Long id);
    List<Coordinator> findAll();
    Coordinator update(Long id, Coordinator c);
    void delete(Long id);

    void replaceTa(Long coordinatorId,
                   Long offeringId,
                   Long oldTaId,
                   Long newTaId);

    void replaceProctorAssignmentTa(Long coordinatorId,
                                    Long proctorAssignmentId,
                                    Long newTaId);
}
