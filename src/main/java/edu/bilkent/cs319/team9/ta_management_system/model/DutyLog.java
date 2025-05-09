package edu.bilkent.cs319.team9.ta_management_system.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@SuperBuilder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class DutyLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    private LocalDateTime dateTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "task_type", nullable = true, length = 20)
    private DutyType taskType;

    private Long workload;

    @Column(nullable = false)
    private LocalDateTime startTime;

    @Column(nullable=false)
    private LocalDateTime endTime;

    private Long duration;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private DutyStatus status;



    @ManyToOne @JoinColumn(name = "ta_id")
    private TA ta;

    @ManyToOne @JoinColumn(name = "faculty_id")
    private FacultyMember faculty;

    @ManyToMany
    @JoinTable(
            name = "dutylog_classroom",
            joinColumns = @JoinColumn(name = "dutylog_id"),
            inverseJoinColumns = @JoinColumn(name = "classroom_id")
    )
    private Set<Classroom> classrooms;


    // --- NEW FIELDS FOR PDF UPLOAD ---
    private String fileName;
    private String contentType;

    @Lob
    @Column(name = "data", columnDefinition = "LONGBLOB", nullable = true)
    private byte[] data;


    @Column(name = "reason", length = 500)
    private String reason;

    @ManyToOne
    @JoinColumn(name = "offering_id", nullable = false)
    private Offering offering;

    private String fileNameTa;
    private String contentTypeTa;

    @Lob
    @Column(name = "data_ta", columnDefinition = "LONGBLOB", nullable = true)
    private byte[] dataTa;

}