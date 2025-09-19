package com.examly.springapp.service;

import com.examly.springapp.model.Restaurant;
import com.examly.springapp.repository.RestaurantRepository;
import com.examly.springapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private UserRepository userRepository;

    public boolean validateOwnerCredentials(String email, String password) {
        Restaurant restaurant = restaurantRepository.findByOwnerEmail(email).stream().findFirst().orElse(null);
        return restaurant != null && restaurant.getOwnerPassword().equals(password);
    }

    public boolean validateUserCredentials(String email, String password) {
        return userRepository.findByEmail(email)
                .map(user -> user.getPassword().equals(password))
                .orElse(false);
    }

    public String getUserRole(String email) {
        return userRepository.findByEmail(email)
                .map(user -> user.getRole())
                .orElse(null);
    }
}