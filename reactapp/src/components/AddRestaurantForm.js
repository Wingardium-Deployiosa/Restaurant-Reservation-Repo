
import React, { useState } from 'react';
import RestaurantService from '../utils/RestaurantService';

const AddRestaurantForm = ({ onRestaurantAdded }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [openingTime, setOpeningTime] = useState('11:00');
  const [closingTime, setClosingTime] = useState('22:00');
  const [totalTables, setTotalTables] = useState(10);
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');

  const handleAddRestaurantSubmit = async (event) => {
    event.preventDefault();
    const restaurantData = { name, address, cuisine, openingTime, closingTime, totalTables, ownerEmail, ownerPassword, imageUrl };
    try {
      await RestaurantService.create(restaurantData);
      alert('Restaurant added successfully!');
      setName('');
      setAddress('');
      setCuisine('');
      setOpeningTime('11:00');
      setClosingTime('22:00');
      setTotalTables(10);
      setOwnerEmail('');
      setOwnerPassword('');
      setImageUrl('');
      setError('');
      if (onRestaurantAdded) onRestaurantAdded();
    } catch (err) {
      alert('Failed to add restaurant. Please try again.');
      setError('Failed to add restaurant. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="add-restaurant-form">
      <h3>Add/Manage Restaurants</h3>
      <form onSubmit={handleAddRestaurantSubmit}>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" required />
        <input type="text" value={cuisine} onChange={(e) => setCuisine(e.target.value)} placeholder="Cuisine" required />
        <input type="time" value={openingTime} onChange={(e) => setOpeningTime(e.target.value)} placeholder="Opening Time (HH:mm)" required />
        <input type="time" value={closingTime} onChange={(e) => setClosingTime(e.target.value)} placeholder="Closing Time (HH:mm)" required />
        <input type="number" value={totalTables} onChange={(e) => setTotalTables(parseInt(e.target.value || '0', 10))} placeholder="Total Tables" required />
        <input type="email" value={ownerEmail} onChange={(e) => setOwnerEmail(e.target.value)} placeholder="Owner Email" required />
        <input type="password" value={ownerPassword} onChange={(e) => setOwnerPassword(e.target.value)} placeholder="Owner Password" required />
        <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Restaurant Image URL (optional)" />
        <button type="submit">Add Restaurant</button>
      </form>
      {error && <p className="error-message">[Error - You need to specify the message]</p>}
    </div>
  );
};

export default AddRestaurantForm;
