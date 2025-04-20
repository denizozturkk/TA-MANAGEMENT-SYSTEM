package edu.bilkent.cs319.team9.ta_management_system.service.impl;


import edu.bilkent.cs319.team9.ta_management_system.exception.NotFoundException;
import edu.bilkent.cs319.team9.ta_management_system.model.FacultyMember;
import edu.bilkent.cs319.team9.ta_management_system.repository.FacultyMemberRepository;
import edu.bilkent.cs319.team9.ta_management_system.service.FacultyMemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class FacultyMemberServiceImpl implements FacultyMemberService {
    private final FacultyMemberRepository repo;

    @Override
    public FacultyMember create(FacultyMember f) {
        return repo.save(f);
    }

    @Override
    @Transactional(readOnly = true)
    public FacultyMember findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new NotFoundException("FacultyMember", id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<FacultyMember> findAll() {
        return repo.findAll();
    }

    @Override
    public FacultyMember update(Long id, FacultyMember f) {
        if (!repo.existsById(id)) throw new NotFoundException("FacultyMember", id);
        f.setUserID(id);
        return repo.save(f);
    }

    @Override
    public void delete(Long id) {
        repo.deleteById(id);
    }
}