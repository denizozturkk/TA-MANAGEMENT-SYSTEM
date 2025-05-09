package edu.bilkent.cs319.team9.ta_management_system.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.DayOfWeek;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class BusyHour {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "ta_id", nullable = false)
    private TA ta;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startDateTime;

    @Column(name = "end_time", nullable = false)
    private LocalDateTime endDateTime;

    public DayOfWeek getDayOfWeek() {
        return startDateTime.getDayOfWeek();
    }

    public boolean overlaps(LocalDateTime otherStart, LocalDateTime otherEnd) {
        return otherStart.isBefore(this.endDateTime) && otherEnd.isAfter(this.startDateTime);
    }
}