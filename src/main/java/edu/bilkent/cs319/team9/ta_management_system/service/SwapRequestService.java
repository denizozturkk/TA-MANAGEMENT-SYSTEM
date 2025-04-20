package edu.bilkent.cs319.team9.ta_management_system.service;

import edu.bilkent.cs319.team9.ta_management_system.model.SwapRequest;
import java.util.List;

public interface SwapRequestService {
    SwapRequest createSwapRequest(SwapRequest swapRequest);
    SwapRequest getSwapRequest(Long id);
    List<SwapRequest> getAllSwapRequests();
    SwapRequest updateSwapRequest(Long id, SwapRequest swapRequest);
    void deleteSwapRequest(Long id);
}