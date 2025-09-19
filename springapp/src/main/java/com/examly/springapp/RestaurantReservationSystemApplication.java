package com.examly.springapp;

import com.examly.springapp.model.User;
import com.examly.springapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class RestaurantReservationSystemApplication implements CommandLineRunner {

	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private com.examly.springapp.repository.RestaurantRepository restaurantRepository;
	
	@Autowired
	private com.examly.springapp.repository.ReservationRepository reservationRepository;

	public static void main(String[] args) {
		SpringApplication.run(RestaurantReservationSystemApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		if (userRepository.findByEmail("admin@admin.com").isEmpty()) {
			User admin = new User();
			admin.setName("Admin User");
			admin.setEmail("admin@admin.com");
			admin.setPassword("admin");
			admin.setRole("ADMIN");
			userRepository.save(admin);
		}
		
		if (userRepository.findByEmail("customer@customer.com").isEmpty()) {
			User customer = new User();
			customer.setName("Customer User");
			customer.setEmail("customer@customer.com");
			customer.setPassword("customer");
			customer.setRole("CUSTOMER");
			userRepository.save(customer);
		}
		
		if (restaurantRepository.count() == 0) {
			com.examly.springapp.model.Restaurant restaurant = new com.examly.springapp.model.Restaurant();
			restaurant.setName("Sample Restaurant");
			restaurant.setAddress("123 Main St");
			restaurant.setCuisine("Italian");
			restaurant.setOpeningTime(java.time.LocalTime.of(9, 0));
			restaurant.setClosingTime(java.time.LocalTime.of(22, 0));
			restaurant.setTotalTables(20);
			restaurantRepository.save(restaurant);
		}
	}
}
