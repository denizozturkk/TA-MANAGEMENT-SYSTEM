package edu.bilkent.cs319.team9.ta_management_system.repository;

import edu.bilkent.cs319.team9.ta_management_system.model.DepartmentStaff;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartmentStaffRepository extends JpaRepository<DepartmentStaff, Long> {
}
