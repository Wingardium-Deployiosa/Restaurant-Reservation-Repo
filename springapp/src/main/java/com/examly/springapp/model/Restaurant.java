package com.examly.springapp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalTime;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "restaurants")
public class Restaurant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long ownerId; 

    private String name;
    private String address;
    private String cuisine;
    @JsonFormat(pattern = "HH:mm")
    private LocalTime openingTime;
    
    @JsonFormat(pattern = "HH:mm")
    private LocalTime closingTime;
    private int totalTables;
    private String ownerEmail;
    private String ownerPassword;
    private String imageUrl;
}