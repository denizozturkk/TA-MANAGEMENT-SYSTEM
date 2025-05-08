package edu.bilkent.cs319.team9.ta_management_system.service.impl;


import edu.bilkent.cs319.team9.ta_management_system.model.Classroom;
import edu.bilkent.cs319.team9.ta_management_system.repository.ClassroomRepository;
import edu.bilkent.cs319.team9.ta_management_system.service.ClassroomService;
import edu.bilkent.cs319.team9.ta_management_system.service.ExamRoomService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ClassroomServiceImpl implements ClassroomService {

    private final ClassroomRepository classroomRepository;
    private final ExamRoomService examRoomService;

    public ClassroomServiceImpl(ClassroomRepository classroomRepository, ExamRoomService examRoomService) {
        this.classroomRepository = classroomRepository;
        this.examRoomService = examRoomService;
    }

    @Override
    public Classroom createClassroom(Classroom classroom) {
        return classroomRepository.save(classroom);
    }

    @Override
    @Transactional(readOnly = true)
    public Classroom getClassroom(Long id) {

        return classroomRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Classroom not found: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Classroom> getAllClassrooms() {
        return classroomRepository.findAll();
    }

    @Override
    public Classroom updateClassroom(Long id, Classroom details) {
        Classroom classroom = getClassroom(id);
        classroom.setCapacity(details.getCapacity());
        classroom.setExamCapacity(details.getExamCapacity());
        return classroomRepository.save(classroom);
    }

    @Override
    public void deleteClassroom(Long id) {
        Classroom classroom = getClassroom(id);
        classroomRepository.delete(classroom);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Classroom> findUnassignedForExam(Long examId) {
        // 1) get the rooms already assigned for this exam
        List<Long> assigned = examRoomService
                .findByExamId(examId)
                .stream()
                .map(er -> er.getClassroom().getId())
                .toList();

        // 2) if none assigned, return all; else return those not in the list
        if (assigned.isEmpty()) {
            return classroomRepository.findAll();
        }
        return classroomRepository.findByIdNotIn(assigned);
    }
}