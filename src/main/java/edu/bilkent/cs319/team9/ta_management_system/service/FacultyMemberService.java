package edu.bilkent.cs319.team9.ta_management_system.service;

import edu.bilkent.cs319.team9.ta_management_system.dto.DistributionDto;
import edu.bilkent.cs319.team9.ta_management_system.model.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;

public interface FacultyMemberService {
    FacultyMember create(FacultyMember f);
    FacultyMember findById(Long id);
    List<FacultyMember> findAll();
    FacultyMember update(Long id, FacultyMember f);
    void delete(Long id);


    void assignProctor(Long examId, AssignmentType mode, Long taId);


    LeaveRequest approveLeaveRequest(Long requestId);
    LeaveRequest rejectLeaveRequest(Long requestId);
    List<LeaveRequest> listLeaveRequests(Long facultyId);
    DutyLog uploadDutyLog(Long facultyId,
                                 Long taId,
                                 Offering offering,
                                 MultipartFile file,
                                 DutyType taskType,
                                 Float workload,
                                 LocalDateTime startTime,
                                 LocalDateTime endTime,
                                 Long duration,
                                 DutyStatus status,
                                 Set<Classroom> classrooms);

    DutyLog uploadDutyLogAutomatic(
            Long facultyId,
            Offering offering,
            MultipartFile file,
            DutyType taskType,
            Float workload,
            LocalDateTime startTime,
            LocalDateTime endTime,
            Long duration,
            DutyStatus status,
            Set<Classroom> classrooms
    );

    DutyLog reviewDutyLog(Long facultyId, Long taId, Long dutyLogId, DutyStatus status, String reason);
}