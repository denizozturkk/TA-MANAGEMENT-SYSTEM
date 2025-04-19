//package edu.bilkent.cs319.team9.ta_management_system.controller;
//
//import edu.bilkent.cs319.team9.ta_management_system.dto.LoginRequest;
//import edu.bilkent.cs319.team9.ta_management_system.dto.LoginResponse;
//import edu.bilkent.cs319.team9.ta_management_system.dto.PasswordChangeRequest;
//import edu.bilkent.cs319.team9.ta_management_system.dto.RegisterRequest;
//import edu.bilkent.cs319.team9.ta_management_system.service.UserService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.core.annotation.AuthenticationPrincipal;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//@RestController
//@RequestMapping("/api/auth")
//public class AuthController {
//    @Autowired
//    UserService userService;
//
//    @PostMapping("/login")
//    public LoginResponse login(@RequestBody LoginRequest req) {
//        return userService.login(req);
//    }
//
//    @PostMapping("/register")
//    public void register(@RequestBody RegisterRequest req) {
//        userService.register(req);
//    }
//
//    @PostMapping("/change-password")
//    public void changePassword(
//            @AuthenticationPrincipal Long userId,
//            @RequestBody PasswordChangeRequest req) {
//        userService.changePassword(userId, req);
//    }
//}
//
