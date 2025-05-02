package edu.bilkent.cs319.team9.ta_management_system.service;


import edu.bilkent.cs319.team9.ta_management_system.model.Classroom;
import java.util.List;

public interface ClassroomService {
    Classroom createClassroom(Classroom classroom);
    Classroom getClassroom(Long id);
    List<Classroom> getAllClassrooms();
    Classroom updateClassroom(Long id, Classroom classroom);
    void deleteClassroom(Long id);
}