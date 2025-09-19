
import React from 'react';
import ReservationService from '../utils/ReservationService';
import './ReservationStatus.css';

const ReservationStatus = ({ reservationId, status, onStatusUpdate }) => {
  const handleConfirm = () => {
    if (onStatusUpdate) {
      onStatusUpdate(reservationId, 'CONFIRMED');
    }
    ReservationService.updateStatus(reservationId, 'CONFIRMED').catch(err => {
      console.error('Error updating status:', err);
    });
  };

  const handleCancel = async () => {
    try {
      await ReservationService.updateStatus(reservationId, 'CANCELLED');
      if (onStatusUpdate) {
        onStatusUpdate(reservationId, 'CANCELLED');
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  return (
    <div className="reservation-status">
      <button
        data-testid={`confirm-button-${reservationId}`}
        disabled={status === 'CONFIRMED'}
        onClick={handleConfirm}
        className={status === 'CONFIRMED' ? 'btn-disabled' : 'btn-confirm'}
      >
        {status === 'CONFIRMED' ? 'Confirmed' : 'Confirm'}
      </button>
      <button
        data-testid={`cancel-button-${reservationId}`}
        onClick={handleCancel}
        className="btn-cancel"
      >
        Cancel
      </button>
    </div>
  );
};

export default ReservationStatus;