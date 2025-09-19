package com.examly.springapp.config;

import com.examly.springapp.model.Reservation;
import com.examly.springapp.model.ReservationStatus;
import com.examly.springapp.model.Restaurant;
import com.examly.springapp.repository.ReservationRepository;
import com.examly.springapp.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    @Override
    public void run(String... args) throws Exception {
        if (reservationRepository.count() == 0) {
            loadSampleReservations();
        }
    }

    private void loadSampleReservations() {
        List<Restaurant> restaurants = restaurantRepository.findAll();
        
        if (!restaurants.isEmpty()) {
            Restaurant firstRestaurant = restaurants.get(0);
            
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
            
            System.out.println("Sample reservations loaded successfully!");
        }
    }
}