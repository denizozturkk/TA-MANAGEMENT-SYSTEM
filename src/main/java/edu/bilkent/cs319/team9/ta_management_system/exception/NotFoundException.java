package edu.bilkent.cs319.team9.ta_management_system.exception;

import edu.bilkent.cs319.team9.ta_management_system.model.ExamRoomId;

public class NotFoundException extends RuntimeException {
    public NotFoundException(String entity, Long id) {
        super(entity + " not found with id " + id);
    }
    public NotFoundException(String entity, ExamRoomId id) {
        super(entity + " not found with id " + id);
    }
}
