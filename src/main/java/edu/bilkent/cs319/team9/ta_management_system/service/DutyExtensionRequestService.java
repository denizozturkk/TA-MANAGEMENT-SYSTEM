package edu.bilkent.cs319.team9.ta_management_system.service;

import edu.bilkent.cs319.team9.ta_management_system.model.DutyExtensionRequest;
import edu.bilkent.cs319.team9.ta_management_system.model.ExtensionRequestStatus;

import java.util.List;

public interface DutyExtensionRequestService {

    DutyExtensionRequest create(DutyExtensionRequest request);
    DutyExtensionRequest respond(Long requestId, ExtensionRequestStatus status);
    List<DutyExtensionRequest> getAll();
    List<DutyExtensionRequest> getByInstructorId(Long instructorId);
    List<DutyExtensionRequest> getByTaId(Long taId);
    DutyExtensionRequest getById(Long id);
}
