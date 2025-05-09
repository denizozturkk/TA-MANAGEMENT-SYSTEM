package edu.bilkent.cs319.team9.ta_management_system.service;

import edu.bilkent.cs319.team9.ta_management_system.model.TA;
import java.util.List;

public interface TAService {
    TA create(TA ta);
    TA findById(Long id);
    List<TA> findAll();
    TA update(Long id, TA ta);
    void delete(Long id);
    public List<TA> findTAsByOfferingId(Long offeringId);
}