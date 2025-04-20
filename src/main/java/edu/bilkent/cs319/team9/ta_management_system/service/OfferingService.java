package edu.bilkent.cs319.team9.ta_management_system.service;

import edu.bilkent.cs319.team9.ta_management_system.model.Offering;
import java.util.List;

public interface OfferingService {
    Offering create(Offering o);
    Offering findById(Long id);
    List<Offering> findAll();
    Offering update(Long id, Offering o);
    void delete(Long id);
}
