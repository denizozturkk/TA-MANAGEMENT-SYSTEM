package edu.bilkent.cs319.team9.ta_management_system.service.impl;

import edu.bilkent.cs319.team9.ta_management_system.model.SwapRequest;
import edu.bilkent.cs319.team9.ta_management_system.repository.SwapRequestRepository;
import edu.bilkent.cs319.team9.ta_management_system.service.SwapRequestService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class SwapRequestServiceImpl implements SwapRequestService {

    private final SwapRequestRepository swapRequestRepository;

    public SwapRequestServiceImpl(SwapRequestRepository swapRequestRepository) {
        this.swapRequestRepository = swapRequestRepository;
    }

    @Override
    public SwapRequest createSwapRequest(SwapRequest swapRequest) {
        return swapRequestRepository.save(swapRequest);
    }

    @Override
    @Transactional(readOnly = true)
    public SwapRequest getSwapRequest(Long id) {
        return swapRequestRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("SwapRequest not found: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<SwapRequest> getAllSwapRequests() {
        return swapRequestRepository.findAll();
    }

    @Override
    public SwapRequest updateSwapRequest(Long id, SwapRequest details) {
        SwapRequest sr = getSwapRequest(id);
        sr.setStatus(details.getStatus());
        sr.setRequestDate(details.getRequestDate());
        sr.setTa(details.getTa());
        sr.setProctorAssignment(details.getProctorAssignment());
        return swapRequestRepository.save(sr);
    }

    @Override
    public void deleteSwapRequest(Long id) {
        SwapRequest sr = getSwapRequest(id);
        swapRequestRepository.delete(sr);
    }
}
