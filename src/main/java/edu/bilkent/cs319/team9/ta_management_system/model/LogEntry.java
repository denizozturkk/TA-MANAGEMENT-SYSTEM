package edu.bilkent.cs319.team9.ta_management_system.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
@Entity
@Table(name = "log_entries")
@org.hibernate.annotations.Check(
        constraints = "event_type IN (" +
                "'LOGIN_SUCCESS','LOGIN_FAILURE'," +
                "'LOGOUT_SUCCESS','LOGOUT_FAILURE'," +
                "'PASSWORD_RESET'" +
                ")"
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LogEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;                  // this will map to your table’s `id` column

    @Column(nullable = false)
    private LocalDateTime timestamp;  // maps to `timestamp`

    @Column(name = "actor_mail")
    private String email;             // maps to `actor_mail`

    @Enumerated(EnumType.STRING)
    @Column(
            name = "event_type",
            nullable = false,
            columnDefinition = "ENUM(" +
                    "'LOGIN_SUCCESS','LOGIN_FAILURE'," +
                    "'LOGOUT_SUCCESS','LOGOUT_FAILURE'," +
                    "'PASSWORD_RESET'" +
                    ")"
    )
    private LogEventType eventType;

    @Column(length = 1000)
    private String details;           // maps to `details`
}
