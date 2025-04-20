package edu.bilkent.cs319.team9.ta_management_system.service;

import edu.bilkent.cs319.team9.ta_management_system.model.Admin;
import java.util.List;

public interface AdminService {
    Admin create(Admin a);
    Admin findById(Long id);
    List<Admin> findAll();
    Admin update(Long id, Admin a);
    void delete(Long id);
}