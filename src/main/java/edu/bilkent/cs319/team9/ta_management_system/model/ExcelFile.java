package edu.bilkent.cs319.team9.ta_management_system.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "excel_uploads")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExcelFile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String filename;
    private String contentType;

    @Lob
    @Column(nullable = false)
    private byte[] data;

    private LocalDateTime uploadedAt;
}
