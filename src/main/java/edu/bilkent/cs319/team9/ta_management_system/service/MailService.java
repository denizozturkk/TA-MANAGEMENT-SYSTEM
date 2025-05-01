package edu.bilkent.cs319.team9.ta_management_system.service;

public interface MailService {
    void sendEmail(String to, String subject, String text);
}

