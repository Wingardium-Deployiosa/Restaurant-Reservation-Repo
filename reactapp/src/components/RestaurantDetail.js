
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import RestaurantService from '../utils/RestaurantService';
import ReservationForm from './ReservationForm';
import './RestaurantDetail.css';

const RestaurantDetail = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [availableSeats, setAvailableSeats] = useState(null);
  const [error, setError] = useState(null);

  const loadRestaurantData = () => {
    if (!id) {
      setError('Restaurant ID is required');
      return;
    }
    RestaurantService.getById(id)
      .then((resp) => {
        const data = resp && resp.data ? resp.data : resp;
        setRestaurant(data || null);
        
      
        try {
          if (RestaurantService.getAvailableSeats) {
            const seatsPromise = RestaurantService.getAvailableSeats(id);
            if (seatsPromise && seatsPromise.then) {
              seatsPromise
                .then((seatsResp) => {
                  const seatsData = seatsResp && seatsResp.data ? seatsResp.data : seatsResp;
                  setAvailableSeats(seatsData);
                })
                .catch(() => {
                  setAvailableSeats({ availableSeats: data.totalTables * 4, availableTables: data.totalTables });
                });
            } else {
              setAvailableSeats({ availableSeats: data.totalTables * 4, availableTables: data.totalTables });
            }
          } else {
            setAvailableSeats({ availableSeats: data.totalTables * 4, availableTables: data.totalTables });
          }
        } catch {
          setAvailableSeats({ availableSeats: data.totalTables * 4, availableTables: data.totalTables });
        }
      })
      .catch((err) => {
        console.error('Error fetching restaurant details!', err);
        setError('Failed to fetch restaurant details');
      });
  };

  useEffect(() => {
    loadRestaurantData();
  }, [id]);

  if (error) return <div data-testid="error">{error}</div>;
  if (!restaurant) return <div data-testid="loading">Loading...</div>;

  return (
    <div className="restaurant-detail-page">
      <div className="container">
        <div className="restaurant-hero">
          <div className="restaurant-image-placeholder" style={restaurant.imageUrl ? {
            backgroundImage: `url(${restaurant.imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          } : {}}>
            {!restaurant.imageUrl && <i className="fas fa-utensils"></i>}
          </div>
          <div className="restaurant-info">
            <h1 className="restaurant-title">{restaurant.name}</h1>
            <p>Cuisine: {restaurant.cuisine}</p>
            <p>Address: {restaurant.address}</p>
            <p>Hours: {restaurant.openingTime} - {restaurant.closingTime}</p>
            <p>Available Seats Today: {availableSeats?.availableSeats === 0 ? 'Restaurant Full' : availableSeats ? `${availableSeats.availableSeats} seats (${availableSeats.availableTables} tables)` : 'Loading...'}</p>
          </div>
        </div>
        
        <div className="reservation-section">
          <ReservationForm restaurant={restaurant} onReservationSuccess={loadRestaurantData} />
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;
