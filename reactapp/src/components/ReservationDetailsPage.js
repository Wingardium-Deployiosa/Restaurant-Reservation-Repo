
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReservationService from '../utils/ReservationService';
import './ReservationDetailsPage.css';

const ReservationDetailsPage = () => {
  const [reservation, setReservation] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    let mounted = true;
    ReservationService.getAll()
      .then((response) => {
        const data = response && response.data ? response.data : response;
        const foundReservation = Array.isArray(data) ? data.find((r) => r.id.toString() === id) : null;
        if (mounted) setReservation(foundReservation);
      })
      .catch((error) => {
        console.error('Error fetching reservation details', error);
      });
    return () => {
      mounted = false;
    };
  }, [id]);

  if (!reservation) {
    return (
      <div className="reservation-details-page">
        <div className="details-container">
          <div className="loading-state">
            <div className="loading-icon">⏳</div>
            <p>Loading reservation details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reservation-details-page">
      <div className="details-container">
        <div className="details-header">
          <h1>Reservation Details</h1>
          <p>Reservation ID: #{reservation.id}</p>
        </div>

        <div className="details-content">
          <div className="details-grid">
            <div className="details-section">
              <h3>Booking Information</h3>
              <div className="detail-row">
                <span className="detail-label">Status:</span>
                <span className={`status-badge status-${reservation.status.toLowerCase()}`}>
                  {reservation.status}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Date:</span>
                <span className="detail-value">{reservation.reservationDate}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Time:</span>
                <span className="detail-value">{reservation.reservationTime}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Party Size:</span>
                <span className="detail-value">{reservation.partySize} people</span>
              </div>
              {reservation.specialRequests && (
                <div className="detail-row">
                  <span className="detail-label">Special Requests:</span>
                  <span className="detail-value">{reservation.specialRequests}</span>
                </div>
              )}
            </div>

            <div className="details-section">
              <h3>Customer Information</h3>
              <div className="detail-row">
                <span className="detail-label">Name:</span>
                <span className="detail-value">{reservation.customerName}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{reservation.customerEmail}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Phone:</span>
                <span className="detail-value">{reservation.customerPhone}</span>
              </div>
            </div>
          </div>

          {reservation.restaurant && (
            <div className="restaurant-info">
              <h3>Restaurant Information</h3>
              <p><strong>Name:</strong> {reservation.restaurant.name}</p>
              <p><strong>Address:</strong> {reservation.restaurant.address}</p>
              <p><strong>Cuisine:</strong> {reservation.restaurant.cuisine}</p>
            </div>
          )}

          <div className="actions-section">
            <Link to="/manage-reservations" className="back-button">
              ← Back to Reservations
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationDetailsPage;
