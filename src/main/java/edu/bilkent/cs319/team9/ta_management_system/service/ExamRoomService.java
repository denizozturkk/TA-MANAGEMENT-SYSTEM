package edu.bilkent.cs319.team9.ta_management_system.service;

import edu.bilkent.cs319.team9.ta_management_system.model.ExamRoom;
import edu.bilkent.cs319.team9.ta_management_system.model.ExamRoomId;

import java.util.List;

public interface ExamRoomService {
    ExamRoom create(ExamRoom examRoom);
    ExamRoom findById(ExamRoomId id);
    List<ExamRoom> findAll();
    ExamRoom update(ExamRoomId id, ExamRoom examRoom);
    void delete(ExamRoomId id);

    List<ExamRoom> findByExamId(Long examId);
    List<ExamRoom> findByClassroomId(Long classroomId);
}
