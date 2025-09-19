
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReservationService from '../utils/ReservationService';
import { useAuth } from '../AuthContext';
import './AdminHome.css';

const AdminHome = () => {
  const [recentReservations, setRecentReservations] = useState([]);
  const { user } = useAuth() || {};

  useEffect(() => {
    let mounted = true;
    ReservationService.getAll()
      .then((response) => {
        const data = response && response.data ? response.data : response;
        const sorted = Array.isArray(data) ? data.sort((a, b) => new Date(b.reservationDate) - new Date(a.reservationDate)) : [];
        if (mounted) setRecentReservations(sorted.slice(0, 5));
      })
      .catch((error) => console.error('Error fetching reservations', error));
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="admin-home">
      <div className="admin-header">
        <h1>Welcome to Admin Dashboard</h1>
        <p>Hello, {user?.name || 'Admin'}! Manage your restaurant reservations efficiently.</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>Total Reservations</h3>
            <p className="stat-number">{recentReservations.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏰</div>
          <div className="stat-info">
            <h3>Pending Approvals</h3>
            <p className="stat-number">{recentReservations.filter(r => r.status === 'PENDING').length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>Confirmed Today</h3>
            <p className="stat-number">{recentReservations.filter(r => r.status === 'CONFIRMED').length}</p>
          </div>
        </div>
      </div>

      <div className="recent-bookings">
        <div className="section-header">
          <h2>Recent Reservations</h2>
          <Link to="/manage-reservations" className="view-all-btn">View All</Link>
        </div>
        {recentReservations.length > 0 ? (
          <div className="bookings-grid">
            {recentReservations.map((res) => (
              <div key={res.id} className="booking-card">
                <div className="booking-header">
                  <h3>{res.customerName}</h3>
                  <span className={`status-badge status-${res.status.toLowerCase()}`}>
                    {res.status}
                  </span>
                </div>
                <div className="booking-details">
                  <div className="detail-item">
                    <span className="icon">📅</span>
                    <span>{res.reservationDate}</span>
                  </div>
                  <div className="detail-item">
                    <span className="icon">🕐</span>
                    <span>{res.reservationTime}</span>
                  </div>
                  <div className="detail-item">
                    <span className="icon">👥</span>
                    <span>{res.partySize} people</span>
                  </div>
                  <div className="detail-item">
                    <span className="icon">📧</span>
                    <span>{res.customerEmail}</span>
                  </div>
                </div>
                <Link to={`/reservations/${res.id}`} className="details-button">
                  View Details
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <p>No recent reservations found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminHome;
