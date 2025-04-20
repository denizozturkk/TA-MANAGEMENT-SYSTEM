package edu.bilkent.cs319.team9.ta_management_system.service.impl;

import edu.bilkent.cs319.team9.ta_management_system.exception.NotFoundException;
import edu.bilkent.cs319.team9.ta_management_system.model.DepartmentStaff;
import edu.bilkent.cs319.team9.ta_management_system.repository.DepartmentStaffRepository;
import edu.bilkent.cs319.team9.ta_management_system.service.DepartmentStaffService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class DepartmentStaffServiceImpl implements DepartmentStaffService {
    private final DepartmentStaffRepository repo;

    @Override
    public DepartmentStaff create(DepartmentStaff s) {
        return repo.save(s);
    }

    @Override
    @Transactional(readOnly = true)
    public DepartmentStaff findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new NotFoundException("DepartmentStaff", id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<DepartmentStaff> findAll() {
        return repo.findAll();
    }

    @Override
    public DepartmentStaff update(Long id, DepartmentStaff s) {
        if (!repo.existsById(id)) throw new NotFoundException("DepartmentStaff", id);
        s.setUserID(id);
        return repo.save(s);
    }

    @Override
    public void delete(Long id) {
        repo.deleteById(id);
    }
}
