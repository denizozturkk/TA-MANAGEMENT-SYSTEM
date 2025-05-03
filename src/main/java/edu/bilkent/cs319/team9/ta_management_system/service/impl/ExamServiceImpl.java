package edu.bilkent.cs319.team9.ta_management_system.service.impl;


import edu.bilkent.cs319.team9.ta_management_system.exception.NotFoundException;
import edu.bilkent.cs319.team9.ta_management_system.model.Exam;
import edu.bilkent.cs319.team9.ta_management_system.repository.ExamRepository;
import edu.bilkent.cs319.team9.ta_management_system.service.ExamService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class ExamServiceImpl implements ExamService {
    private final ExamRepository repo;

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
    public Exam update(Long id, Exam e) {
        if (!repo.existsById(id)) throw new NotFoundException("Exam", id);
        e.setId(id);
        return repo.save(e);
    }

    @Override
    public void delete(Long id) {
        repo.deleteById(id);
    }
}
