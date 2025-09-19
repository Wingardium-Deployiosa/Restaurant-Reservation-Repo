package com.examly.springapp.controller;

import com.examly.springapp.model.Reservation;
import com.examly.springapp.model.ReservationStatus;
import com.examly.springapp.model.Restaurant;
import com.examly.springapp.repository.ReservationRepository;
import com.examly.springapp.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*")
public class TestController {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @PostMapping("/add-sample-reservations")
    public ResponseEntity<String> addSampleReservations() {
        try {
            List<Restaurant> restaurants = restaurantRepository.findAll();
            
            if (restaurants.isEmpty()) {
                return ResponseEntity.badRequest().body("No restaurants found. Please add restaurants first.");
            }
            
            Restaurant firstRestaurant = restaurants.get(0);
            
            reservationRepository.deleteAll();
            
            Reservation reservation1 = new Reservation();
            reservation1.setCustomerName("John Doe");
            reservation1.setCustomerEmail("john.doe@example.com");
            reservation1.setCustomerPhone("123-456-7890");
            reservation1.setReservationDate(LocalDate.now().plusDays(1));
            reservation1.setReservationTime(LocalTime.of(19, 0));
            reservation1.setPartySize(4);
            reservation1.setSpecialRequests("Window seat preferred");
            reservation1.setStatus(ReservationStatus.PENDING);
            reservation1.setRestaurant(firstRestaurant);
            
            Reservation reservation2 = new Reservation();
            reservation2.setCustomerName("Jane Smith");
            reservation2.setCustomerEmail("jane.smith@example.com");
            reservation2.setCustomerPhone("098-765-4321");
            reservation2.setReservationDate(LocalDate.now().plusDays(2));
            reservation2.setReservationTime(LocalTime.of(18, 30));
            reservation2.setPartySize(2);
            reservation2.setSpecialRequests("Anniversary dinner");
            reservation2.setStatus(ReservationStatus.CONFIRMED);
            reservation2.setRestaurant(firstRestaurant);
            
            Reservation reservation3 = new Reservation();
            reservation3.setCustomerName("Bob Johnson");
            reservation3.setCustomerEmail("bob.johnson@example.com");
            reservation3.setCustomerPhone("555-123-4567");
            reservation3.setReservationDate(LocalDate.now().plusDays(3));
            reservation3.setReservationTime(LocalTime.of(20, 0));
            reservation3.setPartySize(6);
            reservation3.setSpecialRequests("Birthday celebration");
            reservation3.setStatus(ReservationStatus.PENDING);
            reservation3.setRestaurant(firstRestaurant);
            
            reservationRepository.save(reservation1);
            reservationRepository.save(reservation2);
            reservationRepository.save(reservation3);
            
            long count = reservationRepository.count();
            return ResponseEntity.ok("Successfully added 3 sample reservations. Total reservations: " + count);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error adding sample reservations: " + e.getMessage());
        }
    }

    @GetMapping("/reservations-count")
    public ResponseEntity<String> getReservationsCount() {
        long count = reservationRepository.count();
        return ResponseEntity.ok("Total reservations in database: " + count);
    }

    @GetMapping("/reservations-debug")
    public ResponseEntity<List<Reservation>> getAllReservationsDebug() {
        List<Reservation> reservations = reservationRepository.findAll();
        return ResponseEntity.ok(reservations);
    }

    @PostMapping("/reset-restaurant-id")
    @Transactional
    public ResponseEntity<String> resetRestaurantId() {
        try {
            entityManager.createNativeQuery("ALTER TABLE restaurant AUTO_INCREMENT = 1").executeUpdate();
            return ResponseEntity.ok("Restaurant ID reset to start from 1");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error resetting restaurant ID: " + e.getMessage());
        }
    }

    @PostMapping("/reset-reservation-id")
    @Transactional
    public ResponseEntity<String> resetReservationId() {
        try {
            entityManager.createNativeQuery("ALTER TABLE reservation AUTO_INCREMENT = 1").executeUpdate();
            return ResponseEntity.ok("Reservation ID reset to start from 1");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error resetting reservation ID: " + e.getMessage());
        }
    }
}