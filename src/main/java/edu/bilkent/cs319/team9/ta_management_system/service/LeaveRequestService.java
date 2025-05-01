package edu.bilkent.cs319.team9.ta_management_system.service;

import edu.bilkent.cs319.team9.ta_management_system.model.LeaveRequest;
import java.util.List;

public interface LeaveRequestService {
    LeaveRequest create(LeaveRequest l);
    LeaveRequest findById(Long id);
    List<LeaveRequest> findAll();
    LeaveRequest update(Long id, LeaveRequest l);
    void delete(Long id);
    List<LeaveRequest> findByTaId(Long taId);

}