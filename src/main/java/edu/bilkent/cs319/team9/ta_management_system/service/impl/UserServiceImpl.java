package edu.bilkent.cs319.team9.ta_management_system.service.impl;


import edu.bilkent.cs319.team9.ta_management_system.exception.NotFoundException;
import edu.bilkent.cs319.team9.ta_management_system.model.User;
import edu.bilkent.cs319.team9.ta_management_system.repository.UserRepository;
import edu.bilkent.cs319.team9.ta_management_system.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository repo;

    @Override
    public User create(User user) {
        return repo.save(user);
    }

    @Override
    @Transactional(readOnly = true)
    public User findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new NotFoundException("User", id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<User> findAll() {
        return repo.findAll();
    }

    @Override
    public User update(Long id, User user) {
        if (!repo.existsById(id)) throw new NotFoundException("User", id);
        user.setId(id);
        return repo.save(user);
    }

    @Override
    public void delete(Long id) {
        repo.deleteById(id);
    }
}