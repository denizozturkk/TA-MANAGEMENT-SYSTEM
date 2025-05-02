package edu.bilkent.cs319.team9.ta_management_system.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PdfAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;

    private String contentType;

    @Lob
    @Column(
            name           = "data",
            columnDefinition= "LONGBLOB",
            nullable       = false
    )
    private byte[] data;

    @CreationTimestamp
    private LocalDateTime uploadTime;

    @ManyToOne(optional = false)
    @JoinColumn(name = "faculty_member_id", nullable = false)
    private FacultyMember facultyMember;

    @ManyToOne(optional = false)
    @JoinColumn(name = "ta_id", nullable = false)
    private TA ta;
}
