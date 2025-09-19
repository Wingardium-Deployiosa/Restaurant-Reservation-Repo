
import React, { useState } from 'react';
import ReservationService from '../utils/ReservationService';
import RestaurantService from '../utils/RestaurantService';
import './ReservationForm.css';

const ReservationForm = ({ restaurant, onReservationSuccess }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    reservationDate: '',
    reservationTime: '',
    partySize: 1,
    specialRequests: '',
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [availableSeatsForDate, setAvailableSeatsForDate] = useState(null);

  const validate = () => {
    const newErrors = {};
    if (!formData.customerName.trim()) newErrors.customerName = 'Name is required.';
    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Valid email is required.';
    }
    if (!formData.customerPhone.trim()) newErrors.customerPhone = 'Phone is required.';
    if (!formData.reservationDate) newErrors.reservationDate = 'Date is required.';
    if (!formData.reservationTime) newErrors.reservationTime = 'Time is required.';
    const party = Number(formData.partySize);
    if (Number.isNaN(party) || party < 1 || party > 20) {
      newErrors.partySize = 'Party size must be between 1 and 20.';
    } else if (availableSeatsForDate && party > availableSeatsForDate.availableSeats) {
      newErrors.partySize = `Requested seats exceed availability (${availableSeatsForDate.availableSeats} available).`;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const errorKeys = Object.keys(errors).filter(key => key !== 'submit');
  const firstErrorKey = errorKeys[0];
  const firstErrorMessage = firstErrorKey ? errors[firstErrorKey] : null;

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'partySize' ? (value === '' ? '' : Number(value)) : value,
    }));
    
    // Check availability when date changes
    if (name === 'reservationDate' && value && restaurant?.id) {
      try {
        const response = await RestaurantService.getAvailableSeatsForDate(restaurant.id, value);
        const seatsData = response && response.data ? response.data : response;
        setAvailableSeatsForDate(seatsData);
      } catch (err) {
        console.error('Error fetching availability:', err);
        setAvailableSeatsForDate({ availableSeats: 0, availableTables: 0 });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    if (!validate()) return;

    const payload = {
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      customerPhone: formData.customerPhone,
      reservationDate: formData.reservationDate,
      reservationTime: formData.reservationTime,
      partySize: Number(formData.partySize),
      specialRequests: formData.specialRequests || '',
      restaurantId: restaurant?.id,
    };


try {
await ReservationService.create(payload);
alert('Reservation request submitted successfully!');
setSuccessMessage('Reservation request submitted!');
setFormData({
customerName: '',
customerEmail: '',
customerPhone: '',
reservationDate: '',
reservationTime: '',
partySize: 1,
specialRequests: '',
});
setErrors({});
setAvailableSeatsForDate(null);
// Dispatch event to refresh restaurant availability
window.dispatchEvent(new CustomEvent('reservationUpdated'));
if (onReservationSuccess) onReservationSuccess();
} catch (err) {
  const errorMessage = err.response?.data || 'Something went wrong. Please try again.';
  alert('Reservation failed: ' + errorMessage);
  if (err.response && err.response.data) {
    setErrors({ submit: err.response.data }); // show backend message
  } else {
    setErrors({ submit: 'Something went wrong. Please try again.' });
  }
  console.error('Error creating reservation:', err);
}

};

return (
    <div className="reservation-form-container">
      <div className="form-header">
        <h3>Book a Table</h3>
        <p>Book your dining experience</p>
      </div>

      {successMessage && <div className="success-alert" data-testid="success-message">{successMessage}</div>}
      {firstErrorMessage && <div className="error-alert" data-testid="error-message">{firstErrorMessage}</div>}

      <form onSubmit={handleSubmit} noValidate className="reservation-form">
        <div className="form-row">
          <div className="form-group">
            <input
              data-testid="name-input"
              name="customerName"
              placeholder="Your Name"
              value={formData.customerName}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <input
              data-testid="email-input"
              name="customerEmail"
              placeholder="Your Email"
              value={formData.customerEmail}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <input
              data-testid="phone-input"
              name="customerPhone"
              placeholder="Your Phone"
              value={formData.customerPhone}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <input
              data-testid="party-size-input"
              name="partySize"
              type="number"
              placeholder="No of Seats"
              value={formData.partySize}
              onChange={handleChange}
              className="form-input"
              min="1"
              max={availableSeatsForDate ? availableSeatsForDate.availableSeats : undefined}
            />
            {formData.partySize && availableSeatsForDate && formData.partySize > availableSeatsForDate.availableSeats && (
              <small className="availability-text unavailable">
                ❌ Exceeds available seats ({availableSeatsForDate.availableSeats} available)
              </small>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <input
              data-testid="date-input"
              name="reservationDate"
              type="date"
              value={formData.reservationDate}
              onChange={handleChange}
              className="form-input"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className="form-group">
            <input
              data-testid="time-input"
              name="reservationTime"
              type="time"
              value={formData.reservationTime}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>
        
        {formData.reservationDate && availableSeatsForDate !== null && (
          <div className="availability-info">
            <small className={`availability-text ${availableSeatsForDate.availableSeats === 0 ? 'unavailable' : 'available'}`}>
              {availableSeatsForDate.availableSeats === 0 
                ? '❌ Restaurant Full - No tables available' 
                : `✅ ${availableSeatsForDate.availableSeats} seats available (${availableSeatsForDate.availableTables} tables)`}
            </small>
          </div>
        )}

        <div className="form-group">
          <textarea
            name="specialRequests"
            placeholder="Special Requests (Optional)"
            value={formData.specialRequests}
            onChange={handleChange}
            className="form-textarea"
            rows="3"
          />
        </div>

        <button data-testid="submit-button" type="submit" className="submit-btn">
          Book Table
        </button>

        {errors.submit && <div className="error-alert">{errors.submit}</div>}
      </form>
    </div>
  );
};
export default ReservationForm;