import React, { useState, useEffect } from 'react';
import RestaurantService from '../utils/RestaurantService';
import ReservationService from '../utils/ReservationService';
import { useAuth } from '../AuthContext';
import './OwnerDashboard.css';

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [availableSeats, setAvailableSeats] = useState({});
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (user && user.email) {
      try {
        const response = await RestaurantService.getByOwner(user.email);
        const ownerRestaurants = response.data || [];
        setRestaurants(ownerRestaurants);
        
      
        const seatsData = {};
        for (const restaurant of ownerRestaurants) {
          try {
            const seatsResponse = await RestaurantService.getAvailableSeats(restaurant.id);
            seatsData[restaurant.id] = seatsResponse.data || seatsResponse;
          } catch (err) {
            seatsData[restaurant.id] = { availableSeats: restaurant.totalTables * 4, availableTables: restaurant.totalTables };
          }
        }
        setAvailableSeats(seatsData);
        
      
        const reservationResponse = await ReservationService.getAll();
        const allReservations = reservationResponse.data || [];
        const ownerReservations = allReservations.filter(reservation => 
          ownerRestaurants.some(restaurant => restaurant.id === reservation.restaurant?.id)
        );
        setReservations(ownerReservations);
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setRestaurants([]);
        setReservations([]);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadData();
    
    
    const handleReservationUpdate = () => {
      loadData();
    };
    
    window.addEventListener('reservationUpdated', handleReservationUpdate);
    
    return () => {
      window.removeEventListener('reservationUpdated', handleReservationUpdate);
    };
  }, [user]);

  if (loading) return <div>Loading your restaurants...</div>;

  return (
    <div className="owner-dashboard">
      <h2>My Restaurants</h2>
      {restaurants.length === 0 ? (
        <p>No restaurants found for your account.</p>
      ) : (
        <div>
          <div className="restaurant-grid">
            {restaurants.map(restaurant => (
              <div key={restaurant.id} className="restaurant-card">
                <div className="restaurant-image" style={restaurant.imageUrl ? {
                  backgroundImage: `url(${restaurant.imageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  height: '150px',
                  borderRadius: '8px 8px 0 0'
                } : {
                  background: 'linear-gradient(135deg, #fc8019 0%, #ff6900 100%)',
                  height: '150px',
                  borderRadius: '8px 8px 0 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: '600'
                }}>
                  {!restaurant.imageUrl && <span>{restaurant.cuisine}</span>}
                </div>
                <div style={{ padding: '16px' }}>
                  <h3>{restaurant.name}</h3>
                  <p>{restaurant.address}</p>
                  <p>Cuisine: {restaurant.cuisine}</p>
                  <p>Hours: {restaurant.openingTime} - {restaurant.closingTime}</p>
                  <p>Tables: {restaurant.totalTables}</p>
                  <p>Available Today: {availableSeats[restaurant.id]?.availableSeats ?? (restaurant.totalTables * 4)} seats ({availableSeats[restaurant.id]?.availableTables ?? restaurant.totalTables} tables)</p>
                </div>
              </div>
            ))}
          </div>
          <div className="reservations-section">
            <h3 className="section-title">Recent Reservations</h3>
            {reservations.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📅</div>
                <p>No reservations found for your restaurants.</p>
              </div>
            ) : (
              <div className="reservations-grid">
                {reservations.slice(0, 6).map(reservation => (
                  <div key={reservation.id} className="reservation-card">
                    <div className="reservation-header">
                      <h4>{reservation.customerName}</h4>
                      <span className={`status-badge status-${reservation.status.toLowerCase()}`}>
                        {reservation.status}
                      </span>
                    </div>
                    <div className="reservation-details">
                      <div className="detail-row">
                        <span className="icon">📅</span>
                        <span>{reservation.reservationDate}</span>
                      </div>
                      <div className="detail-row">
                        <span className="icon">🕐</span>
                        <span>{reservation.reservationTime}</span>
                      </div>
                      <div className="detail-row">
                        <span className="icon">👥</span>
                        <span>{reservation.partySize} people</span>
                      </div>
                      <div className="detail-row">
                        <span className="icon">📧</span>
                        <span>{reservation.customerEmail}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;