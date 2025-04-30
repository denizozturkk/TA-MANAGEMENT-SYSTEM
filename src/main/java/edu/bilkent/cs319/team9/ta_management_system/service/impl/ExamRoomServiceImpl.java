package edu.bilkent.cs319.team9.ta_management_system.service.impl;

import edu.bilkent.cs319.team9.ta_management_system.exception.NotFoundException;
import edu.bilkent.cs319.team9.ta_management_system.model.ExamRoom;
import edu.bilkent.cs319.team9.ta_management_system.model.ExamRoomId;
import edu.bilkent.cs319.team9.ta_management_system.repository.ExamRoomRepository;
import edu.bilkent.cs319.team9.ta_management_system.service.ExamRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class ExamRoomServiceImpl implements ExamRoomService {
    private final ExamRoomRepository repo;

    @Override
    public ExamRoom create(ExamRoom examRoom) {
        return repo.save(examRoom);
    }

    @Override
    @Transactional(readOnly = true)
    public ExamRoom findById(ExamRoomId id) {
        return repo.findById(id)
                .orElseThrow(() -> new NotFoundException("ExamRoom", id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExamRoom> findAll() {
        return repo.findAll();
    }

    @Override
    public ExamRoom update(ExamRoomId id, ExamRoom examRoom) {
        if (!repo.existsById(id)) throw new NotFoundException("ExamRoom", id);
        examRoom.setId(id);
        return repo.save(examRoom);
    }

    @Override
    public void delete(ExamRoomId id) {
        repo.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExamRoom> findByExamId(Long examId) {
        return repo.findByExam_Id(examId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExamRoom> findByClassroomId(Long classroomId) {
        return repo.findByClassroom_Id(classroomId);
    }

    @Override
    public void deleteByExamIdAndClassroomId(Long examId, Long classroomId) {
        ExamRoomId id = new ExamRoomId(examId, classroomId);
        repo.deleteById(id);
    }

}
