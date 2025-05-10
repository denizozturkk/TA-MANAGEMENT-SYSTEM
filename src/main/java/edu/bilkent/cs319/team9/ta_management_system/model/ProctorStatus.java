package edu.bilkent.cs319.team9.ta_management_system.model;

/**
 * Tracks the lifecycle of a proctor assignment.
 */
public enum ProctorStatus {
    ASSIGNED,   // confirmed and active
    COMPLETED,  // exam has taken place
    CANCELLED   // assignment was revoked
}
