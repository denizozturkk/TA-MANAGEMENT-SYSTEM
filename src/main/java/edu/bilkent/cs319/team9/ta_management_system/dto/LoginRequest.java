package edu.bilkent.cs319.team9.ta_management_system.dto;

public class LoginRequest {
    public String email;
    public String password;

    public LoginRequest(String email, String password)
    {
        this.email = email;
        this.password = password;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
