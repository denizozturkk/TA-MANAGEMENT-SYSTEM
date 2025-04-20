package edu.bilkent.cs319.team9.ta_management_system.service;

import edu.bilkent.cs319.team9.ta_management_system.dto.LoginRequest;
import edu.bilkent.cs319.team9.ta_management_system.dto.LoginResponse;
import edu.bilkent.cs319.team9.ta_management_system.dto.PasswordChangeRequest;
import edu.bilkent.cs319.team9.ta_management_system.dto.RegisterRequest;

import edu.bilkent.cs319.team9.ta_management_system.model.User;
import java.util.List;

public interface UserService {
    User create(User user);
    User findById(Long id);
    List<User> findAll();
    User update(Long id, User user);
    void delete(Long id);
}
