package edu.bilkent.cs319.team9.ta_management_system.service.impl;


import edu.bilkent.cs319.team9.ta_management_system.exception.NotFoundException;
import edu.bilkent.cs319.team9.ta_management_system.model.Classroom;
import edu.bilkent.cs319.team9.ta_management_system.model.Exam;
import edu.bilkent.cs319.team9.ta_management_system.model.ExamRoom;
import edu.bilkent.cs319.team9.ta_management_system.model.ExamRoomId;
import edu.bilkent.cs319.team9.ta_management_system.repository.ClassroomRepository;
import edu.bilkent.cs319.team9.ta_management_system.repository.ExamRepository;
import edu.bilkent.cs319.team9.ta_management_system.repository.ExamRoomRepository;
import edu.bilkent.cs319.team9.ta_management_system.service.ExamService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@Transactional
@RequiredArgsConstructor
public class ExamServiceImpl implements ExamService {
    private final ExamRepository repo;
    private final ClassroomRepository classroomRepo;
    private final ExamRoomRepository examRoomRepo;

    @Override
    public Exam create(Exam exam) {
        // Step 1: Detach exam rooms
        var rooms = exam.getExamRooms();
        exam.setExamRooms(null);

        // Step 2: Save exam to generate ID
        Exam saved = repo.save(exam);

        // Step 3: Patch examId into each room's composite key
        if (rooms != null) {
            for (var room : rooms) {
                room.setExam(saved); // set owning side
                room.getId().setExamId(saved.getId()); // patch composite key
            }
            saved.setExamRooms(rooms); // re-attach
        }

        // Step 4: Save again to persist rooms
        return repo.save(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public Exam findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Exam", id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Exam> findAll() {
        return repo.findAll();
    }

    @Override
    @Transactional
    public Exam update(Long id, Exam e) {
        Exam existing = repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Exam not found"));

        // Step 1: Delete old examRooms at DB level (optional but recommended)
        examRoomRepo.deleteByExamId(existing.getId());
        existing.getExamRooms().clear();

        // Step 2: Create NEW ExamRoom entities
        Set<ExamRoom> newRooms = new HashSet<>();
        for (ExamRoom er : e.getExamRooms()) {
            Classroom cls = classroomRepo.findById(er.getClassroom().getId())
                    .orElseThrow(() -> new NotFoundException("Classroom not found"));

            ExamRoom newEr = new ExamRoom();
            newEr.setId(new ExamRoomId(existing.getId(), cls.getId()));
            newEr.setExam(existing);
            newEr.setClassroom(cls);
            newEr.setNumProctors(er.getNumProctors());

            newRooms.add(newEr);
        }

        // Step 3: Update mutable fields
        existing.setExamName(e.getExamName());
        existing.setDateTime(e.getDateTime());
        existing.setDuration(e.getDuration());
        existing.setNumProctors(e.getNumProctors());
        existing.setDepartment(e.getDepartment());
        existing.setExamType(e.getExamType());
        existing.setOffering(e.getOffering());
        existing.setFaculty(e.getFaculty());

        // Step 4: Do NOT replace collection — modify it!
        existing.getExamRooms().addAll(newRooms);

        return repo.save(existing);
    }




    @Override
    public void delete(Long id) {
        repo.deleteById(id);
    }
}
