package com.examly.springapp.controller;

import com.examly.springapp.model.Reservation;
import com.examly.springapp.model.ReservationStatus;
import com.examly.springapp.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @PostMapping("/restaurants/{restaurantId}/reservations")
    public ResponseEntity<Reservation> createReservation(@PathVariable Long restaurantId, @RequestBody Reservation reservation) {
        return new ResponseEntity<>(reservationService.createReservation(reservation, restaurantId), HttpStatus.CREATED);
    }

    @GetMapping("/reservations/{id}")
    public ResponseEntity<Reservation> getReservationById(@PathVariable Long id) {
        return new ResponseEntity<>(reservationService.getReservationById(id), HttpStatus.OK);
    }

    @GetMapping("/reservations")
    public ResponseEntity<List<Reservation>> getAllReservations() {
        return new ResponseEntity<>(reservationService.getAllReservations(), HttpStatus.OK);
    }

    @GetMapping("/users/{userEmail}/reservations")
    public ResponseEntity<List<Reservation>> getReservationsByUser(@PathVariable String userEmail) {
        return new ResponseEntity<>(reservationService.getReservationsByUserEmail(userEmail), HttpStatus.OK);
    }

    @PutMapping("/reservations/{id}/status")
    public ResponseEntity<Reservation> updateReservationStatus(@PathVariable Long id, @RequestBody Map<String, String> statusUpdate) {
        ReservationStatus status = ReservationStatus.valueOf(statusUpdate.get("status").toUpperCase());
        return new ResponseEntity<>(reservationService.updateReservationStatus(id, status), HttpStatus.OK);
    }

    @DeleteMapping("/reservations/{id}")
    public ResponseEntity<Void> cancelReservation(@PathVariable Long id) {
        reservationService.cancelReservation(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
