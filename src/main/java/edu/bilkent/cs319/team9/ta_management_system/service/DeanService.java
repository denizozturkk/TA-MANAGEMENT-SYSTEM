package edu.bilkent.cs319.team9.ta_management_system.service;

import edu.bilkent.cs319.team9.ta_management_system.model.Dean;
import java.util.List;

public interface DeanService {
    Dean create(Dean d);
    Dean findById(Long id);
    List<Dean> findAll();
    Dean update(Long id, Dean d);
    void delete(Long id);
}
