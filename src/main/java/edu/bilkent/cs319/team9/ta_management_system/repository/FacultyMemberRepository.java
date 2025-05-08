package edu.bilkent.cs319.team9.ta_management_system.repository;

import edu.bilkent.cs319.team9.ta_management_system.model.FacultyMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FacultyMemberRepository extends JpaRepository<FacultyMember, Long> {
    boolean existsByEmail(String email);
    Optional<FacultyMember> findByEmail(String email);
}