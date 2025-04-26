package edu.bilkent.cs319.team9.ta_management_system.service;

import edu.bilkent.cs319.team9.ta_management_system.model.ProctorAssignment;
import edu.bilkent.cs319.team9.ta_management_system.model.SwapRequest;
import edu.bilkent.cs319.team9.ta_management_system.model.SwapStatus;

import java.util.List;

public interface SwapRequestService {
    SwapRequest createSwapRequest(SwapRequest swapRequest);
    SwapRequest getSwapRequest(Long id);
    List<SwapRequest> getAllSwapRequests();
    SwapRequest updateSwapRequest(Long id, SwapRequest swapRequest);
    void deleteSwapRequest(Long id);
    List<ProctorAssignment> findEligibleTargets(Long originalAssignmentId);
    SwapRequest sendSwapRequest(Long originalAssignmentId, Long targetAssignmentId, Long requestingTaId);
    SwapRequest respondToSwapRequest(Long swapRequestId, SwapStatus newStatus);
}