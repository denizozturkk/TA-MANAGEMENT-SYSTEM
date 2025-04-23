package edu.bilkent.cs319.team9.ta_management_system.repository;

import edu.bilkent.cs319.team9.ta_management_system.model.ExamRoom;
import edu.bilkent.cs319.team9.ta_management_system.model.ExamRoomId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExamRoomRepository extends JpaRepository<ExamRoom, ExamRoomId> {
    List<ExamRoom> findByExam_Id(Long examId);
    List<ExamRoom> findByClassroom_Id(Long classroomId);
}