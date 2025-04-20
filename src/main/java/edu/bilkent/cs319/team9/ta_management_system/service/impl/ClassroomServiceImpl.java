package edu.bilkent.cs319.team9.ta_management_system.service.impl;


import edu.bilkent.cs319.team9.ta_management_system.model.Classroom;
import edu.bilkent.cs319.team9.ta_management_system.repository.ClassroomRepository;
import edu.bilkent.cs319.team9.ta_management_system.service.ClassroomService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ClassroomServiceImpl implements ClassroomService {

    private final ClassroomRepository classroomRepository;

    public ClassroomServiceImpl(ClassroomRepository classroomRepository) {
        this.classroomRepository = classroomRepository;
    }

    @Override
    public Classroom createClassroom(Classroom classroom) {
        return classroomRepository.save(classroom);
    }

    @Override
    @Transactional(readOnly = true)
    public Classroom getClassroom(String roomNumber) {
        return classroomRepository.findById(roomNumber)
                .orElseThrow(() -> new EntityNotFoundException("Classroom not found: " + roomNumber));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Classroom> getAllClassrooms() {
        return classroomRepository.findAll();
    }

    @Override
    public Classroom updateClassroom(String roomNumber, Classroom details) {
        Classroom classroom = getClassroom(roomNumber);
        classroom.setCapacity(details.getCapacity());
        classroom.setExamCapacity(details.getExamCapacity());
        return classroomRepository.save(classroom);
    }

    @Override
    public void deleteClassroom(String roomNumber) {
        Classroom classroom = getClassroom(roomNumber);
        classroomRepository.delete(classroom);
    }
}