package edu.bilkent.cs319.team9.ta_management_system.service;

import edu.bilkent.cs319.team9.ta_management_system.model.FacultyMember;
import java.util.List;

public interface FacultyMemberService {
    FacultyMember create(FacultyMember f);
    FacultyMember findById(Long id);
    List<FacultyMember> findAll();
    FacultyMember update(Long id, FacultyMember f);
    void delete(Long id);
}