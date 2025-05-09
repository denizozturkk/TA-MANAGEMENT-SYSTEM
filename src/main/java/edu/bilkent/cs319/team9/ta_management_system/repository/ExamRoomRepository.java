package edu.bilkent.cs319.team9.ta_management_system.repository;

import edu.bilkent.cs319.team9.ta_management_system.model.ExamRoom;
import edu.bilkent.cs319.team9.ta_management_system.model.ExamRoomId;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ExamRoomRepository extends JpaRepository<ExamRoom, ExamRoomId> {
    List<ExamRoom> findByExam_Id(Long examId);
    List<ExamRoom> findByClassroom_Id(Long classroomId);
    @Modifying
    @Transactional
    @Query("DELETE FROM ExamRoom er WHERE er.id.examId = :examId")
    void deleteByExamId(@Param("examId") Long examId);

}