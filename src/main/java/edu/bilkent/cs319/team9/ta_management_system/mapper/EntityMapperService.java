package edu.bilkent.cs319.team9.ta_management_system.mapper;


import edu.bilkent.cs319.team9.ta_management_system.dto.*;
import edu.bilkent.cs319.team9.ta_management_system.model.*;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class EntityMapperService {
    private final ModelMapper modelMapper;

    public EntityMapperService(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    public TADto toDto(TA ta) {
        TADto dto = modelMapper.map(ta, TADto.class);
        dto.setFullName(ta.getFirstName() + " " + ta.getLastName());
        return dto;
    }

    public TA toEntity(TADto dto) {
        return modelMapper.map(dto, TA.class);
    }

    public SwapRequestDto toDto(SwapRequest sr) {
        SwapRequestDto dto = modelMapper.map(sr, SwapRequestDto.class);
        dto.setTaId(sr.getTa() != null ? sr.getTa().getId() : null);
        dto.setProctorAssignmentId(sr.getProctorAssignment() != null ? sr.getProctorAssignment().getId() : null);
        dto.setTargetProctorAssignmentId(sr.getTargetProctorAssignment() != null ? sr.getTargetProctorAssignment().getId() : null);
        return dto;
    }

    public SwapRequest toEntity(SwapRequestDto dto) {
        SwapRequest sr = modelMapper.map(dto, SwapRequest.class);

        // Entity ID'leri ile sadece ilişki kuruyoruz (örnek)
        TA ta = new TA(); ta.setId(dto.getTaId());
        sr.setTa(ta);

        ProctorAssignment original = new ProctorAssignment(); original.setId(dto.getProctorAssignmentId());
        ProctorAssignment target = new ProctorAssignment(); target.setId(dto.getTargetProctorAssignmentId());
        sr.setProctorAssignment(original);
        sr.setTargetProctorAssignment(target);

        return sr;
    }

    public DutyLog toEntity(DutyLogDto dto) {
        DutyLog d = modelMapper.map(dto, DutyLog.class);

        if (dto.getTaId() != null) {
            TA ta = new TA(); ta.setId(dto.getTaId());
            d.setTa(ta);
        }

        if (dto.getFacultyId() != null) {
            FacultyMember fm = new FacultyMember(); fm.setId(dto.getFacultyId());
            d.setFaculty(fm);
        }

        if (dto.getClassroomIds() != null) {
            Set<Classroom> classrooms = dto.getClassroomIds().stream().map(id -> {
                Classroom c = new Classroom();
                c.setId(id);
                return c;
            }).collect(Collectors.toSet());
            d.setClassrooms(classrooms);
        }

        return d;
    }

    public LeaveRequestDto toDto(LeaveRequest lr) {
        LeaveRequestDto dto = modelMapper.map(lr, LeaveRequestDto.class);
        dto.setTaId(lr.getTa() != null ? lr.getTa().getId() : null);
        dto.setProctorAssignmentId(lr.getProctorAssignment() != null ? lr.getProctorAssignment().getId() : null);
        return dto;
    }

    public LeaveRequest toEntity(LeaveRequestDto dto) {
        LeaveRequest lr = modelMapper.map(dto, LeaveRequest.class);

        if (dto.getTaId() != null) {
            TA ta = new TA();
            ta.setId(dto.getTaId());
            lr.setTa(ta);
        }

        if (dto.getProctorAssignmentId() != null) {
            ProctorAssignment pa = new ProctorAssignment();
            pa.setId(dto.getProctorAssignmentId());
            lr.setProctorAssignment(pa);
        }

        return lr;
    }

    public DeanDto toDto(Dean dean) {
        return modelMapper.map(dean, DeanDto.class);
    }

    public Dean toEntity(DeanDto dto) {
        return modelMapper.map(dto, Dean.class);
    }

    public ExamDto toDto(Exam e) {
        ExamDto dto = modelMapper.map(e, ExamDto.class);
        dto.setOfferingId(e.getOffering() != null ? e.getOffering().getId() : null);
        dto.setFacultyId(e.getFaculty() != null ? e.getFaculty().getId() : null);
        return dto;
    }

    public Exam toEntity(ExamDto dto) {
        Exam e = modelMapper.map(dto, Exam.class);
        if (dto.getOfferingId() != null) {
            Offering o = new Offering(); o.setId(dto.getOfferingId());
            e.setOffering(o);
        }
        if (dto.getFacultyId() != null) {
            FacultyMember fm = new FacultyMember(); fm.setId(dto.getFacultyId());
            e.setFaculty(fm);
        }
        return e;
    }

    public ClassroomDto toDto(Classroom c) {
        return modelMapper.map(c, ClassroomDto.class);
    }

    public Classroom toEntity(ClassroomDto dto) {
        return modelMapper.map(dto, Classroom.class);
    }


    public ProctorAssignmentDto toDto(ProctorAssignment pa) {
        ProctorAssignmentDto dto = modelMapper.map(pa, ProctorAssignmentDto.class);
        dto.setTaId(pa.getAssignedTA() != null ? pa.getAssignedTA().getId() : null);
        dto.setExamId(pa.getExam() != null ? pa.getExam().getId() : null);
        dto.setClassroomId(pa.getClassroom() != null ? pa.getClassroom().getId() : null);
        return dto;
    }

    public ProctorAssignment toEntity(ProctorAssignmentDto dto) {
        ProctorAssignment pa = modelMapper.map(dto, ProctorAssignment.class);
        if (dto.getTaId() != null) {
            TA ta = new TA(); ta.setId(dto.getTaId());
            pa.setAssignedTA(ta);
        }
        if (dto.getExamId() != null) {
            Exam exam = new Exam(); exam.setId(dto.getExamId());
            pa.setExam(exam);
        }
        if (dto.getClassroomId() != null) {
            Classroom c = new Classroom(); c.setId(dto.getClassroomId());
            pa.setClassroom(c);
        }
        return pa;
    }

    public LogEntryDto toDto(LogEntry logEntry) {
        return modelMapper.map(logEntry, LogEntryDto.class);
    }

    public LogEntry toEntity(LogEntryDto dto) {
        return modelMapper.map(dto, LogEntry.class);
    }

    public DutyExtensionRequestDto toDto(DutyExtensionRequest e) {
        DutyExtensionRequestDto dto = modelMapper.map(e, DutyExtensionRequestDto.class);
        dto.setTaId(e.getTa() != null ? e.getTa().getId() : null);
        dto.setInstructorId(e.getInstructor() != null ? e.getInstructor().getId() : null);
        dto.setDutyLogId(e.getDutyLog() != null ? e.getDutyLog().getId() : null);
        return dto;
    }

    public DutyExtensionRequest toEntity(DutyExtensionRequestDto dto) {
        DutyExtensionRequest e = modelMapper.map(dto, DutyExtensionRequest.class);

        if (dto.getTaId() != null) {
            TA ta = new TA(); ta.setId(dto.getTaId());
            e.setTa(ta);
        }
        if (dto.getInstructorId() != null) {
            FacultyMember fm = new FacultyMember(); fm.setId(dto.getInstructorId());
            e.setInstructor(fm);
        }
        if (dto.getDutyLogId() != null) {
            DutyLog dl = new DutyLog(); dl.setId(dto.getDutyLogId());
            e.setDutyLog(dl);
        }
        return e;
    }

    public TutorGraderApplicationDto toDto(TutorGraderApplication app) {
        return modelMapper.map(app, TutorGraderApplicationDto.class);
    }

    public TutorGraderApplication toEntity(TutorGraderApplicationDto dto) {
        return modelMapper.map(dto, TutorGraderApplication.class);
    }

    public DistributionDto toDto(ExamRoomId examRoomId, List<Student> students) {
        DistributionDto dto = new DistributionDto();
        dto.setExamId(examRoomId.getExamId());
        dto.setClassroomId(examRoomId.getClassroomId());
        dto.setStudentIds(
                students.stream()
                        .map(Student::getId)
                        .collect(Collectors.toList())
        );
        return dto;
    }

    // Mapper (EntityMapperService)
    public DutyLogDto toDto(DutyLog dl) {
        DutyLogDto dto = new DutyLogDto();
        // Entity fields
        dto.setId(dl.getId());
        dto.setTaskType(dl.getTaskType().name());
        dto.setWorkload(dl.getWorkload().intValue());
        dto.setStartTime(dl.getStartTime());
        dto.setDateTime(dl.getDateTime());
        dto.setStatus(dl.getStatus());
        // Relationships → just IDs
        dto.setTaId(dl.getTa().getId());
        dto.setFacultyId(dl.getFaculty().getId());
        dto.setClassroomIds(
                dl.getClassrooms()
                        .stream()
                        .map(Classroom::getId)
                        .collect(Collectors.toSet())
        );
        return dto;
    }

}
