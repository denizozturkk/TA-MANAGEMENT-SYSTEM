package edu.bilkent.cs319.team9.ta_management_system.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;

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

    /**
     * which TA this slot belongs to
     */
    @ManyToOne(optional = false)
    @JoinColumn(name = "ta_id", nullable = false)
    private TA ta;

    /**
     * day of week, e.g. MONDAY, TUESDAY…
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DayOfWeek dayOfWeek;

    /**
     * start of busy period (e.g. 13:30)
     */
    @Column(nullable = false)
    private LocalTime startTime;

    /**
     * end of busy period (e.g. 14:30)
     */
    @Column(nullable = false)
    private LocalTime endTime;

    public boolean overlaps(LocalDateTime otherStart, LocalDateTime otherEnd) {
        if (!otherStart.getDayOfWeek().equals(this.dayOfWeek)) {
            return false;
        }
        LocalTime oStart = otherStart.toLocalTime();
        LocalTime oEnd   = otherEnd.toLocalTime();
        // overlap occurs if oStart < this.endTime && oEnd > this.startTime
        return oStart.isBefore(this.endTime) && oEnd.isAfter(this.startTime);
    }
}
