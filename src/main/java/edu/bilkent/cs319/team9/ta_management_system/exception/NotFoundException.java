package edu.bilkent.cs319.team9.ta_management_system.exception;

public class NotFoundException extends RuntimeException {
    public NotFoundException(String entity, Long id) {
        super(entity + " not found with id " + id);
    }
}
