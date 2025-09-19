// src/components/ReservationList.js
import React, { useState, useEffect } from 'react';
import ReservationService from '../utils/ReservationService';
import RestaurantService from '../utils/RestaurantService';
import { useAuth } from '../AuthContext';
import './ReservationList.css';

const ReservationList = () => {
  const authResult = useAuth();
  const user = authResult ? authResult.user : null;
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const fetchReservations = async () => {
      try {
        const resp = await ReservationService.getAll();
        console.log('Fetched reservations response:', resp);

        const data = resp && resp.data ? resp.data : resp;
        let filteredReservations = Array.isArray(data) ? data : [];
        
      
        if (user && user.role === 'OWNER') {
      
          const ownerRestaurantsResp = await RestaurantService.getByOwner(user.email);
          const ownerRestaurantsData = ownerRestaurantsResp && ownerRestaurantsResp.data ? ownerRestaurantsResp.data : ownerRestaurantsResp;
          const ownerRestaurants = Array.isArray(ownerRestaurantsData) ? ownerRestaurantsData : [];
          const ownerRestaurantIds = ownerRestaurants.map(r => r.id);
          
          filteredReservations = filteredReservations.filter(reservation => 
            ownerRestaurantIds.includes(reservation.restaurant?.id)
          );
        }
        
        if (mounted) setReservations(filteredReservations);
      } catch (err) {
        console.error('Error loading reservations:', err);
        if (mounted) {
          setError(err.message || 'Failed to load reservations.');
          setReservations([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchReservations();
    return () => {
      mounted = false;
    };
  }, [user]);

  const handleCancel = async (id) => {
    try {
      await ReservationService.cancel(id);
      alert('Reservation cancelled successfully!');
      setReservations((prev) => prev.filter((r) => r.id !== id));
     
      window.dispatchEvent(new CustomEvent('reservationUpdated'));
    } catch (err) {
      alert('Failed to cancel reservation. Please try again.');
      console.error('Error cancelling reservation:', err);
    }
  };

  const handleConfirm = async (id) => {
    try {
      await ReservationService.confirm(id);
      alert('Reservation confirmed successfully!');
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'CONFIRMED' } : r))
      );
      window.dispatchEvent(new CustomEvent('reservationUpdated'));
    } catch (err) {
      alert('Failed to confirm reservation. Please try again.');
      console.error('Error confirming reservation:', err);
    }
  };

  if (loading) {
    return (
      <div className="reservation-list-container">
        <h2>{!user ? 'All Reservations' : 'My Reservations'}</h2>
        <div>Loading reservations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reservation-list-container">
        <h2>{!user ? 'All Reservations' : 'My Reservations'}</h2>
        <p className="error-text">{error}</p>
      </div>
    );
  }


  if (!reservations || reservations.length === 0) {
    return (
      <div className="reservations-page">
        <div className="container">
          <div className="page-header">
            <h1>{!user ? 'All Reservations' : 'My Reservations'}</h1>
          </div>
          <div className="empty-state">
            <i className="fas fa-calendar-times"></i>
            <h3>No reservations found</h3>
            <p data-testid="empty">No reservations found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reservations-page">
      <div className="container">
        <div className="page-header">
          <h1>{!user ? 'All Reservations' : 'My Reservations'}</h1>
          <p>Manage your dining reservations</p>
        </div>
        
        <div className="reservations-grid">
          {reservations.map((reservation) => (
            <div key={reservation.id} className="reservation-card" data-testid={`reservation-item-${reservation.id}`}>
              <div className="reservation-header">
                <h3>{reservation.customerName}</h3>
                <span className={`status-badge status-${reservation.status.toLowerCase()}`}>
                  {reservation.status}
                </span>
              </div>
              
              <div className="reservation-details">
                <div className="detail-item">
                  <i className="fas fa-envelope"></i>
                  <span>{reservation.customerEmail}</span>
                </div>
                <div className="detail-item">
                  <i className="fas fa-calendar"></i>
                  <span>{reservation.reservationDate}</span>
                </div>
                <div className="detail-item">
                  <i className="fas fa-clock"></i>
                  <span>{reservation.reservationTime}</span>
                </div>
                <div className="detail-item">
                  <i className="fas fa-users"></i>
                  <span>{reservation.partySize} people</span>
                </div>
              </div>
              
              {!user || user.role.toUpperCase() !== 'CUSTOMER' ? (
                <div className="reservation-actions">
                  <button
                    data-testid={`confirm-button-${reservation.id}`}
                    disabled={reservation.status === 'CONFIRMED'}
                    onClick={() => handleConfirm(reservation.id)}
                    className={`btn ${reservation.status === 'CONFIRMED' ? 'btn-disabled' : 'btn-confirm'}`}
                  >
                    {reservation.status === 'CONFIRMED' ? 'Confirmed' : 'Confirm'}
                  </button>
                  <button
                    data-testid={`cancel-button-${reservation.id}`}
                    onClick={() => handleCancel(reservation.id)}
                    className="btn btn-cancel"
                  >
                    Cancel
                  </button>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReservationList;