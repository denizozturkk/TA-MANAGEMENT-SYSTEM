package edu.bilkent.cs319.team9.ta_management_system.service.impl;

import edu.bilkent.cs319.team9.ta_management_system.exception.NotFoundException;
import edu.bilkent.cs319.team9.ta_management_system.model.Admin;
import edu.bilkent.cs319.team9.ta_management_system.repository.AdminRepository;
import edu.bilkent.cs319.team9.ta_management_system.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {
    private final AdminRepository repo;

    @Override
    public Admin create(Admin a) {
        return repo.save(a);
    }

    @Override
    @Transactional(readOnly = true)
    public Admin findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Admin", id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Admin> findAll() {
        return repo.findAll();
    }

    @Override
    public Admin update(Long id, Admin a) {
        if (!repo.existsById(id)) throw new NotFoundException("Admin", id);
        a.setUser_id(id);
        return repo.save(a);
    }

    @Override
    public void delete(Long id) {
        repo.deleteById(id);
    }
}
