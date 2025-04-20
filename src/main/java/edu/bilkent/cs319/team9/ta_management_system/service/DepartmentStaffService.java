package edu.bilkent.cs319.team9.ta_management_system.service;

import edu.bilkent.cs319.team9.ta_management_system.model.DepartmentStaff;
import java.util.List;

public interface DepartmentStaffService {
    DepartmentStaff create(DepartmentStaff s);
    DepartmentStaff findById(Long id);
    List<DepartmentStaff> findAll();
    DepartmentStaff update(Long id, DepartmentStaff s);
    void delete(Long id);
}