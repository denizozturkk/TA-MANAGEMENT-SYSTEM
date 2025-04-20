package edu.bilkent.cs319.team9.ta_management_system.model;


import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class ExcelImport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // new file‐metadata fields
    private String fileName;
    private String contentType;

    @Lob
    @Column(length = Integer.MAX_VALUE)
    private byte[] data;

    private LocalDateTime importDate;

    @ManyToOne
    @JoinColumn(name = "semester_data_id")
    private SemesterData semesterData;
}

