import React, { useState } from 'react';
import AddRestaurantForm from './AddRestaurantForm';
import AdminRestaurantList from './AdminRestaurantList';
import './AdminRestaurantControl.css';

const AdminRestaurantControl = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const handleRestaurantAdded = () => setRefreshKey((prev) => prev + 1);

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>Welcome to Admin Access Panel</h2>
      </div>
      <div className="admin-content">
        <AddRestaurantForm onRestaurantAdded={handleRestaurantAdded} />
      </div>
      <div className="admin-content" style={{background: 'transparent', padding: '0', margin: '0', boxShadow: 'none', border: 'none'}}>
        <AdminRestaurantList key={refreshKey} hideAddForm={true} />
      </div>
    </div>
  );
};

export default AdminRestaurantControl;
