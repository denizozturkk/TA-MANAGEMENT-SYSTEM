package edu.bilkent.cs319.team9.ta_management_system.mapper;


import edu.bilkent.cs319.team9.ta_management_system.dto.*;
import edu.bilkent.cs319.team9.ta_management_system.model.*;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

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

    public DutyLogDto toDto(DutyLog d) {
        DutyLogDto dto = modelMapper.map(d, DutyLogDto.class);
        dto.setTaId(d.getTa() != null ? d.getTa().getId() : null);
        dto.setFacultyId(d.getFaculty() != null ? d.getFaculty().getId() : null);
        dto.setClassroomIds(d.getClassrooms() != null
                ? d.getClassrooms().stream().map(Classroom::getId).collect(Collectors.toSet())
                : null);
        return dto;
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
}
