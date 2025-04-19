package edu.bilkent.cs319.team9.ta_management_system.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import edu.bilkent.cs319.team9.ta_management_system.model.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {
    Optional<User> findByEmail(String email);
}
