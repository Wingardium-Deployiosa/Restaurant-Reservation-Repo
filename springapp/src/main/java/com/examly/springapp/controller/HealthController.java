    package com.examly.springapp.controller;

    import org.springframework.web.bind.annotation.*;
    import java.util.HashMap;
    import java.util.Map;

    @RestController
    @RequestMapping("/api")
    @CrossOrigin(origins = "*")
    public class HealthController {

        @GetMapping("/health")
        public Map<String, String> health() {
            Map<String, String> response = new HashMap<>();
            response.put("status", "OK");
            response.put("message", "Backend is running");
            return response;
        }
    }
//