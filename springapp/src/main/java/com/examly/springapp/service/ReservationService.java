package com.examly.springapp.service;

import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.exception.ValidationException;
import com.examly.springapp.model.Reservation;
import com.examly.springapp.model.ReservationStatus;
import com.examly.springapp.model.Restaurant;
import com.examly.springapp.repository.ReservationRepository;
import com.examly.springapp.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    public Reservation createReservation(Reservation reservation, Long restaurantId) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + restaurantId));

        if (reservation.getReservationTime().isBefore(restaurant.getOpeningTime()) || reservation.getReservationTime().isAfter(restaurant.getClosingTime())) {
            throw new ValidationException("Reservation time must be within restaurant opening hours.");
        }

        List<Reservation> existingReservations = reservationRepository.findByRestaurant_IdAndReservationDate(restaurantId, reservation.getReservationDate());
        if (existingReservations.size() >= restaurant.getTotalTables()) {
            throw new ValidationException("No available tables for the selected date.");
        }

        reservation.setRestaurant(restaurant);
        reservation.setStatus(ReservationStatus.PENDING);
        return reservationRepository.save(reservation);
    }

    public Reservation getReservationById(Long id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + id));
    }
    
    public List<Reservation> getAllReservations() {
        List<Reservation> reservations = reservationRepository.findAll();
        System.out.println("DEBUG: getAllReservations() returned " + reservations.size() + " reservations");
        return reservations;
    }

    public List<Reservation> getReservationsByUserEmail(String customerEmail) {
        return reservationRepository.findByCustomerEmail(customerEmail);
    }

    public Reservation updateReservationStatus(Long id, ReservationStatus status) {
        Reservation reservation = getReservationById(id);
        reservation.setStatus(status);
        return reservationRepository.save(reservation);
    }

    public void cancelReservation(Long id) {
        Reservation reservation = getReservationById(id);
        reservationRepository.delete(reservation);
    }
}
