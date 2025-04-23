package edu.bilkent.cs319.team9.ta_management_system.model;

/**
 * Tracks the lifecycle of a proctor assignment.
 */
public enum ProctorStatus {
    PENDING,    // assignment created but not yet confirmed
    ASSIGNED,   // confirmed and active
    COMPLETED,  // exam has taken place
    CANCELLED   // assignment was revoked
}
