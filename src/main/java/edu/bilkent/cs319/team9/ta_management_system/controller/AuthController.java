//package edu.bilkent.cs319.team9.ta_management_system.controller;
//
//
//
//import edu.bilkent.cs319.team9.ta_management_system.dto.LoginRequest;
//import edu.bilkent.cs319.team9.ta_management_system.dto.LoginResponse;
//import edu.bilkent.cs319.team9.ta_management_system.security.CustomUserDetails;
//import edu.bilkent.cs319.team9.ta_management_system.security.CustomUserDetailsService;
//import edu.bilkent.cs319.team9.ta_management_system.security.JwtUtil;
//import edu.bilkent.cs319.team9.ta_management_system.service.UserService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.Map;
//
//@CrossOrigin(origins = "http://localhost:3000")
//@RestController
//@RequestMapping("/api/auth")
//public class AuthController {
//
//    @Autowired
//    private CustomUserDetailsService userDetailsService;
//    @Autowired
//    private PasswordEncoder passwordEncoder;
//
//    @Autowired
//    private AuthenticationManager authManager;
//    @Autowired
//    private JwtUtil jwtUtil;
//
//    @Autowired
//    private UserService userService;
//
//    @PostMapping("/login")
//    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
//        try {
//            // 1) load & inspect the user
//            var userDetails = (CustomUserDetails) userDetailsService.loadUserByUsername(req.getEmail());
//            System.out.println(">>> Loaded user: " + userDetails.getUsername() + " / stored pw: " + userDetails.getPassword());
//            System.out.println(">>> bcrypt.match: " +
//                    passwordEncoder.matches(req.getPassword(), userDetails.getPassword()));
//
//            // 2) try to authenticate
//            var auth = authManager.authenticate(
//                    new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
//            );
//            System.out.println(">>> Authentication object: " + auth);
//
//            // 3) generate token
//            String token = jwtUtil.generateToken(userDetails.getUsername());
//            return ResponseEntity.ok(new LoginResponse(token, userDetails.getRole()));
//
//        } catch (Exception ex) {
//            ex.printStackTrace();   // this will let you see the real cause
//            return ResponseEntity
//                    .status(HttpStatus.UNAUTHORIZED)
//                    .body(Map.of("error", ex.getClass().getSimpleName(),
//                            "message", ex.getMessage()));
//        }
//    }
//
//
//    /** Recover & Logout **/
//    @PostMapping("/recover-password")
//    public ResponseEntity<Void> recoverPassword(@RequestBody Map<String,String> body) {
//        userService.recoverPassword(body.get("email"));
//        return ResponseEntity.ok().build();
//    }
//
//    @GetMapping("/ping")
//    public ResponseEntity<String> ping() {
//        return ResponseEntity.ok("pong");
//    }
//}

package edu.bilkent.cs319.team9.ta_management_system.controller;

import edu.bilkent.cs319.team9.ta_management_system.dto.LoginRequest;
import edu.bilkent.cs319.team9.ta_management_system.dto.LoginResponse;
import edu.bilkent.cs319.team9.ta_management_system.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        try {
            LoginResponse resp = authService.login(req);
            return ResponseEntity.ok(resp);
        } catch (Exception ex) {
            return ResponseEntity
                    .status(401)
                    .body(Map.of("error", ex.getClass().getSimpleName(),
                            "message", ex.getMessage()));
        }
    }

    @PostMapping("/recover-password")
    public ResponseEntity<Void> recoverPassword(@RequestBody Map<String,String> body) {
        authService.recoverPassword(body.get("email"));
        return ResponseEntity.ok().build();
    }

}

