package edu.bilkent.cs319.team9.ta_management_system.service.impl;

import edu.bilkent.cs319.team9.ta_management_system.dto.ClassroomDistributionDto;
import edu.bilkent.cs319.team9.ta_management_system.dto.DistributionDto;
import edu.bilkent.cs319.team9.ta_management_system.mapper.EntityMapperService;
import edu.bilkent.cs319.team9.ta_management_system.model.Exam;
import edu.bilkent.cs319.team9.ta_management_system.model.ExamRoom;
import edu.bilkent.cs319.team9.ta_management_system.model.Student;
import edu.bilkent.cs319.team9.ta_management_system.repository.ExamRepository;
import edu.bilkent.cs319.team9.ta_management_system.service.ClassroomDistributionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@Transactional(readOnly = true)
public class ClassroomDistributionServiceImpl implements ClassroomDistributionService {

    private final ExamRepository examRepository;
    private final EntityMapperService mapper;

    public ClassroomDistributionServiceImpl(ExamRepository examRepository,
                                            EntityMapperService mapper) {
        this.examRepository = examRepository;
        this.mapper = mapper;
    }

    @Override
    public ClassroomDistributionDto distribute(Long examId, boolean randomize) {
        // 1) Fetch the exam with offering→students and examRooms→classroom all loaded
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new NoSuchElementException("Exam not found: " + examId));

        // 2) Copy into mutable Lists
        List<Student> students = new ArrayList<>(exam.getOffering().getStudents());
        List<ExamRoom> rooms    = new ArrayList<>(exam.getExamRooms());
        rooms.sort(Comparator.comparing(er -> er.getClassroom().getId()));

        // 3) Order once on the copy
        if (randomize) {
            Collections.shuffle(students);
        } else {
            students.sort(Comparator
                    .comparing(Student::getLastName)
                    .thenComparing(Student::getFirstName));
        }

        int totalStudents = students.size();
        int totalCapacity = rooms.stream()
                .mapToInt(er -> er.getClassroom().getExamCapacity())
                .sum();

        // 4) Compute how many go in each room
        List<Integer> counts = new ArrayList<>(rooms.size());
        int assigned = 0;
        for (int i = 0; i < rooms.size(); i++) {
            if (i < rooms.size() - 1) {
                int cap = rooms.get(i).getClassroom().getExamCapacity();
                int cnt = cap * totalStudents / totalCapacity;
                counts.add(cnt);
                assigned += cnt;
            } else {
                // last room takes the remainder
                counts.add(totalStudents - assigned);
            }
        }

        // 5) Slice the student list by index—no removals!
        List<DistributionDto> distributions = new ArrayList<>(rooms.size());
        int idx = 0;
        for (int i = 0; i < rooms.size(); i++) {
            int cnt = counts.get(i);
            List<Student> slice = students.subList(idx, idx + cnt);
            distributions.add(mapper.toDto(rooms.get(i).getId(), slice));
            idx += cnt;
        }

        // 6) Return the DTO
        return new ClassroomDistributionDto(examId, distributions);
    }
}