package com.examly.springapp.controller;

import com.examly.springapp.model.Restaurant;
import com.examly.springapp.service.RestaurantService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
@CrossOrigin(origins = "*")
public class RestaurantController {

    @Autowired
    private RestaurantService restaurantService;

    @PostMapping
    public ResponseEntity<?> createRestaurant(@RequestBody Restaurant restaurant) {
        try {
            return new ResponseEntity<>(restaurantService.createRestaurant(restaurant), HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error creating restaurant", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRestaurantById(@PathVariable Long id) {
        try {
            return new ResponseEntity<>(restaurantService.getRestaurantById(id), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Restaurant not found", HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllRestaurants() {
        try {
            return new ResponseEntity<>(restaurantService.getAllRestaurants(), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(java.util.Collections.emptyList(), HttpStatus.OK);
        }
    }
    
    @GetMapping("/cuisine/{cuisine}")
    public ResponseEntity<?> searchByCuisine(@PathVariable String cuisine) {
        try {
            return new ResponseEntity<>(restaurantService.searchByCuisine(cuisine), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(java.util.Collections.emptyList(), HttpStatus.OK);
        }
    }

    @GetMapping("/owner/{ownerEmail}")
    public ResponseEntity<?> getRestaurantsByOwner(@PathVariable String ownerEmail) {
        try {
            return new ResponseEntity<>(restaurantService.getRestaurantsByOwner(ownerEmail), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(java.util.Collections.emptyList(), HttpStatus.OK);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRestaurant(@PathVariable Long id, @RequestBody Restaurant restaurantDetails) {
        try {
            return new ResponseEntity<>(restaurantService.updateRestaurant(id, restaurantDetails), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error updating restaurant", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRestaurant(@PathVariable Long id) {
        try {
            restaurantService.deleteRestaurant(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error deleting restaurant", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}/available-seats")
    public ResponseEntity<?> getAvailableSeats(@PathVariable Long id) {
        try {
            return new ResponseEntity<>(restaurantService.getAvailableSeats(id), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error calculating available seats", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}/available-seats/{date}")
    public ResponseEntity<?> getAvailableSeatsForDate(@PathVariable Long id, @PathVariable String date) {
        try {
            return new ResponseEntity<>(restaurantService.getAvailableSeatsForDate(id, date), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error calculating available seats", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}