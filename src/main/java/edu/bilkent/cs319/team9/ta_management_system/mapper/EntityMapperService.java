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

        if (dto.getOfferingId() != null) {
            Offering off = new Offering();
            off.setId(dto.getOfferingId());
             d.setOffering(off);
        }

        if (dto.getReason() != null) {
            d.setReason(dto.getReason());
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

        if (e.getExamRooms() != null) {
            List<ExamRoomDto> examRoomDtos = e.getExamRooms().stream().map(er -> {
                ExamRoomDto rdto = new ExamRoomDto();
                rdto.setClassroomId(er.getClassroom().getId());
                rdto.setNumProctors(er.getNumProctors());
                return rdto;
            }).toList();
            dto.setExamRooms(examRoomDtos);
        }


        return dto;
    }

    public Exam toEntity(ExamDto dto) {

        Exam e = modelMapper.map(dto, Exam.class);

        if (dto.getOfferingId() != null) {
            Offering off = new Offering();
            off.setId(dto.getOfferingId());
            e.setOffering(off);
        }

        if (dto.getFacultyId() != null) {
            FacultyMember fm = new FacultyMember();
            fm.setId(dto.getFacultyId());
            e.setFaculty(fm);
        }


        if (dto.getExamRooms() != null) {
            Set<ExamRoom> examRooms = dto.getExamRooms().stream().map(rdto -> {
                ExamRoom er = new ExamRoom();
                Classroom classroom = new Classroom(); classroom.setId(rdto.getClassroomId());
                er.setClassroom(classroom);
                er.setNumProctors(rdto.getNumProctors());

                ExamRoomId id = new ExamRoomId(); // key is composed of exam + classroom
                id.setClassroomId(rdto.getClassroomId());
                er.setId(id);

                er.setExam(e); // back-reference
                return er;
            }).collect(Collectors.toSet());

            // Update embedded IDs now that `e` has an ID
            e.setExamRooms(examRooms);
            examRooms.forEach(er -> er.getId().setExamId(e.getId()));
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
        dto.setReason(dl.getReason());
        // Relationships → just IDs
        dto.setTaId(dl.getTa().getId());
        dto.setFacultyId(dl.getFaculty().getId());
        dto.setClassroomIds(
                dl.getClassrooms()
                        .stream()
                        .map(Classroom::getId)
                        .collect(Collectors.toSet())
        );

        dto.setOfferingId(dl.getOffering() != null
            ? dl.getOffering().getId()
                : null
                );
        return dto;
    }

    public OfferingDto toDto(Offering offering) {
        OfferingDto dto = new OfferingDto();
        dto.setId(offering.getId());
        dto.setSection(offering.getSection());
        dto.setSemester(offering.getSemester());
        dto.setYear(offering.getYear());

        dto.setInstructorId(offering.getInstructor() != null ? offering.getInstructor().getId() : null);
        dto.setCourseId(offering.getCourse() != null ? offering.getCourse().getId() : null);
        dto.setSemesterDataId(offering.getSemesterData() != null ? offering.getSemesterData().getId() : null);

        dto.setTaIds(offering.getTas() != null ?
                offering.getTas().stream().map(TA::getId).collect(Collectors.toSet()) : null);

        dto.setStudentIds(offering.getStudents() != null ?
                offering.getStudents().stream().map(Student::getId).collect(Collectors.toSet()) : null);

        dto.setExamIds(offering.getExams() != null ?
                offering.getExams().stream().map(Exam::getId).collect(Collectors.toSet()) : null);
        return dto;
    }

    public Offering toEntity(OfferingDto dto) {
        Offering offering = new Offering();
        offering.setId(dto.getId());
        offering.setSection(dto.getSection());
        offering.setSemester(dto.getSemester());
        offering.setYear(dto.getYear());

        if (dto.getInstructorId() != null) {
            FacultyMember instructor = new FacultyMember();
            instructor.setId(dto.getInstructorId());
            offering.setInstructor(instructor);
        }

        if (dto.getCourseId() != null) {
            Course course = new Course();
            course.setId(dto.getCourseId());
            offering.setCourse(course);
        }

        if (dto.getSemesterDataId() != null) {
            SemesterData sd = new SemesterData();
            sd.setId(dto.getSemesterDataId());
            offering.setSemesterData(sd);
        }

        if (dto.getTaIds() != null) {
            Set<TA> tas = dto.getTaIds().stream().map(id -> {
                TA ta = new TA();
                ta.setId(id);
                return ta;
            }).collect(Collectors.toSet());
            offering.setTas(tas);
        }

        if (dto.getStudentIds() != null) {
            Set<Student> students = dto.getStudentIds().stream().map(id -> {
                Student student = new Student();
                student.setId(id);
                return student;
            }).collect(Collectors.toSet());
            offering.setStudents(students);
        }

        if (dto.getExamIds() != null) {
            Set<Exam> exams = dto.getExamIds().stream().map(id -> {
                Exam exam = new Exam();
                exam.setId(id);
                return exam;
            }).collect(Collectors.toSet());
            offering.setExams(exams);
        }

        return offering;
    }

    public StudentDto toDto(Student s) {
        return StudentDto.builder()
                .id(s.getId())
                .studentID(s.getStudentID())
                .firstName(s.getFirstName())
                .lastName(s.getLastName())
                .offeringIds(
                        s.getOfferings() == null
                                ? null
                                : s.getOfferings()
                                .stream()
                                .map(Offering::getId)
                                .collect(Collectors.toSet())
                )
                .build();
    }

    // ---- toEntity ----
    public Student toEntity(StudentDto dto) {
        Student s = new Student();
        s.setId(dto.getId());
        s.setStudentID(dto.getStudentID());
        s.setFirstName(dto.getFirstName());
        s.setLastName(dto.getLastName());

        if (dto.getOfferingIds() != null) {
            Set<Offering> offers = dto.getOfferingIds().stream()
                    .map(id -> {
                        Offering o = new Offering();
                        o.setId(id);
                        return o;
                    })
                    .collect(Collectors.toSet());
            s.setOfferings(offers);
        }
        return s;
    }

    // --- FacultyMember ---
    public FacultyMemberDto toDto(FacultyMember fm) {
        return FacultyMemberDto.builder()
                .id(fm.getId())
                .firstName(fm.getFirstName())
                .lastName(fm.getLastName())
                .email(fm.getEmail())
                .password(fm.getPassword())
                .phoneNumber(fm.getPhoneNumber())
                .photoURL(fm.getPhotoURL())
                // don't include password in toDto if you don't want to expose it
                .role(fm.getRole())
                .department(fm.getDepartment())
                .offeringIds(fm.getOfferings() == null
                        ? Set.of()
                        : fm.getOfferings().stream().map(Offering::getId).collect(Collectors.toSet()))
                .approvedDutyLogIds(fm.getApprovedDuties() == null
                        ? Set.of()
                        : fm.getApprovedDuties().stream().map(DutyLog::getId).collect(Collectors.toSet()))
                .examIds(fm.getExams() == null
                        ? Set.of()
                        : fm.getExams().stream().map(Exam::getId).collect(Collectors.toSet()))
                .build();
    }

    public FacultyMember toEntity(FacultyMemberDto dto) {
        FacultyMember fm = new FacultyMember();
        fm.setId(dto.getId());
        fm.setFirstName(dto.getFirstName());
        fm.setLastName(dto.getLastName());
        fm.setEmail(dto.getEmail());
        fm.setPhoneNumber(dto.getPhoneNumber());
        fm.setPhotoURL(dto.getPhotoURL());
        // password should be encoded in service layer
        fm.setRole(dto.getRole());
        fm.setDepartment(dto.getDepartment());
        fm.setPassword(dto.getPassword());

        if (dto.getOfferingIds() != null) {
            fm.setOfferings(dto.getOfferingIds().stream()
                    .map(id -> {
                        Offering o = new Offering();
                        o.setId(id);
                        return o;
                    })
                    .collect(Collectors.toSet()));
        }
        // approved duties / exams are usually set by service logic
        return fm;
    }

    // --- Coordinator ---
    public CoordinatorDto toDto(Coordinator c) {
        return CoordinatorDto.builder()
                .id(c.getId())
                .firstName(c.getFirstName())
                .lastName(c.getLastName())
                .email(c.getEmail())
                .phoneNumber(c.getPhoneNumber())
                .photoURL(c.getPhotoURL())
                // omit password here too if you don't want to send it back
                .role(c.getRole())
                .department(c.getDepartment())
                .build();
    }

    public Coordinator toEntity(CoordinatorDto dto) {
        Coordinator c = new Coordinator();
        c.setId(dto.getId());
        c.setFirstName(dto.getFirstName());
        c.setLastName(dto.getLastName());
        c.setEmail(dto.getEmail());
        c.setPhoneNumber(dto.getPhoneNumber());
        c.setPhotoURL(dto.getPhotoURL());
        // password handling / encoding in service layer
        c.setRole(dto.getRole());
        c.setDepartment(dto.getDepartment());
        return c;
    }

    public CourseDto toDto(Course c) {
        CourseDto dto = modelMapper.map(c, CourseDto.class);
        if (c.getOfferings() != null) {
            dto.setOfferingIds(
                    c.getOfferings()
                            .stream()
                            .map(Offering::getId)
                            .collect(Collectors.toSet())
            );
        }
        return dto;
    }

    public Course toEntity(CourseDto dto) {
        Course c = modelMapper.map(dto, Course.class);
        if (dto.getOfferingIds() != null) {
            Set<Offering> offs = dto.getOfferingIds().stream()
                    .map(id -> {
                        Offering o = new Offering();
                        o.setId(id);
                        return o;
                    })
                    .collect(Collectors.toSet());
            c.setOfferings(offs);
        }
        return c;
    }
}
