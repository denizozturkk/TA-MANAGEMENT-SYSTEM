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
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
public class TA extends User {
    private Float totalWorkload;
    private String department;

    @Enumerated(EnumType.STRING)
    private DegreeStatus msPhdStatus;

    @ManyToMany
    @JoinTable(
            name = "offering_ta",
            joinColumns = @JoinColumn(name = "ta_id"),
            inverseJoinColumns = @JoinColumn(name = "offering_id"))
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
