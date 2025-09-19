package com.examly.springapp.service;

import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.model.Restaurant;
import com.examly.springapp.model.Reservation;
import com.examly.springapp.model.ReservationStatus;
import com.examly.springapp.repository.RestaurantRepository;
import com.examly.springapp.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class RestaurantService {

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    public Restaurant createRestaurant(Restaurant restaurant) {
        return restaurantRepository.save(restaurant);
    }

    public Restaurant getRestaurantById(Long id) {
        return restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + id));
    }

    public List<Restaurant> getAllRestaurants() {
        return restaurantRepository.findAll();
    }

    public Restaurant updateRestaurant(Long id, Restaurant restaurantDetails) {
        Restaurant restaurant = getRestaurantById(id);
        restaurant.setName(restaurantDetails.getName());
        restaurant.setAddress(restaurantDetails.getAddress());
        restaurant.setCuisine(restaurantDetails.getCuisine());
        restaurant.setOpeningTime(restaurantDetails.getOpeningTime());
        restaurant.setClosingTime(restaurantDetails.getClosingTime());
        restaurant.setTotalTables(restaurantDetails.getTotalTables());
        return restaurantRepository.save(restaurant);
    }

    public void deleteRestaurant(Long id) {
        Restaurant restaurant = getRestaurantById(id);
        
        List<Reservation> existingReservations = reservationRepository.findByRestaurant_Id(id);
        if (!existingReservations.isEmpty()) {
            throw new RuntimeException("Cannot delete restaurant while reservations exist for this restaurant");
        }
        
        restaurantRepository.delete(restaurant);
    }

    public List<Restaurant> searchByCuisine(String cuisine) {
        return restaurantRepository.findByCuisineIgnoreCase(cuisine);
    }

    public List<Restaurant> getRestaurantsByOwner(String ownerEmail) {
        return restaurantRepository.findByOwnerEmail(ownerEmail);
    }

    public java.util.Map<String, Integer> getAvailableSeats(Long restaurantId) {
        Restaurant restaurant = getRestaurantById(restaurantId);
        int totalTables = restaurant.getTotalTables();
        int totalSeats = totalTables * 4;
        
        try {
            List<Reservation> todayReservations = reservationRepository.findByRestaurant_IdAndReservationDate(
                restaurantId, LocalDate.now());
            
            int bookedSeats = todayReservations.stream()
                .filter(r -> r.getStatus() == ReservationStatus.CONFIRMED)
                .mapToInt(Reservation::getPartySize)
                .sum();
            
            int availableSeats = Math.max(0, totalSeats - bookedSeats);
            int occupiedTables = (int) Math.ceil((double) bookedSeats / 4);
            int availableTables = Math.max(0, totalTables - occupiedTables);
            
            java.util.Map<String, Integer> result = new java.util.HashMap<>();
            result.put("availableSeats", availableSeats);
            result.put("availableTables", availableTables);
            return result;
        } catch (Exception e) {
            java.util.Map<String, Integer> result = new java.util.HashMap<>();
            result.put("availableSeats", totalSeats);
            result.put("availableTables", totalTables);
            return result;
        }
    }

    public java.util.Map<String, Integer> getAvailableSeatsForDate(Long restaurantId, String dateString) {
        Restaurant restaurant = getRestaurantById(restaurantId);
        int totalTables = restaurant.getTotalTables();
        int totalSeats = totalTables * 4;
        
        try {
            LocalDate date = LocalDate.parse(dateString);
            List<Reservation> dateReservations = reservationRepository.findByRestaurant_IdAndReservationDate(
                restaurantId, date);
            
            int bookedSeats = dateReservations.stream()
                .filter(r -> r.getStatus() == ReservationStatus.CONFIRMED)
                .mapToInt(Reservation::getPartySize)
                .sum();
            
            int availableSeats = Math.max(0, totalSeats - bookedSeats);
            int occupiedTables = (int) Math.ceil((double) bookedSeats / 4);
            int availableTables = Math.max(0, totalTables - occupiedTables);
            
            java.util.Map<String, Integer> result = new java.util.HashMap<>();
            result.put("availableSeats", availableSeats);
            result.put("availableTables", availableTables);
            return result;
        } catch (Exception e) {
            java.util.Map<String, Integer> result = new java.util.HashMap<>();
            result.put("availableSeats", totalSeats);
            result.put("availableTables", totalTables);
            return result;
        }
    }
}
