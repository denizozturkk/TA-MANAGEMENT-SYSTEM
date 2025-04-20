package edu.bilkent.cs319.team9.ta_management_system.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class SemesterData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // your existing domain fields
    private String semesterID;
    private String term;
    private Integer year;

    // new upload‐file fields
    private String fileName;
    private String contentType;

    @Lob
    @Column(length = Integer.MAX_VALUE)
    private byte[] data;

    private LocalDateTime uploadedAt;

    @OneToMany(mappedBy = "semesterData")
    private Set<Offering> offerings;
}
