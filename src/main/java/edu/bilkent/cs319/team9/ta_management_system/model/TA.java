package edu.bilkent.cs319.team9.ta_management_system.model;

import lombok.*;
import jakarta.persistence.*;
import lombok.experimental.SuperBuilder;
import java.util.Set;

@Entity
@DiscriminatorValue("TA")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true, onlyExplicitlyIncluded = true)
@SuperBuilder
@Getter
@Setter
public class TA extends User {
    private Float totalWorkload;
    private String department;

    @Enumerated(EnumType.STRING)
    private DegreeStatus msPhdStatus;

    @Column(name = "bilkent_ta_id", unique = true, nullable = true)
    private String bilkentTaId;

    @ManyToMany(mappedBy = "tas")
    private Set<Offering> offerings;

    @OneToMany(mappedBy = "ta")
    private Set<DutyLog> dutyLogs;

    @OneToMany(mappedBy = "ta")
    private Set<LeaveRequest> leaveRequests;

    @OneToMany(mappedBy = "ta")
    private Set<SwapRequest> swapRequests;

    @OneToMany(mappedBy = "assignedTA")
    private Set<ProctorAssignment> proctorAssignments;

    /*
    + each TA can register multiple busy‐hour slots
    */
    @OneToMany(mappedBy = "ta", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<BusyHour> busyHours;
}