package com.examly.springapp.controller;

import com.examly.springapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        
        if ("customer@customer.com".equals(email) && "customer".equals(password)) {
            return ResponseEntity.ok(Map.of("role", "CUSTOMER", "email", email));
        } else if ("admin@admin.com".equals(email) && "admin".equals(password)) {
            return ResponseEntity.ok(Map.of("role", "ADMIN", "email", email));
        } else if (userService.validateOwnerCredentials(email, password)) {
            return ResponseEntity.ok(Map.of("role", "OWNER", "email", email));
        } else if (userService.validateUserCredentials(email, password)) {
            String role = userService.getUserRole(email);
            return ResponseEntity.ok(Map.of("role", role, "email", email));
        }
        
        return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
    }
}