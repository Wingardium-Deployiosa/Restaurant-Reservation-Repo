import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RestaurantService from '../utils/RestaurantService';
import RestaurantSearch from './RestaurantSearch';
import { useAuth } from '../AuthContext';
import './RestaurantList.css';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [availableSeats, setAvailableSeats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const authResult = useAuth();
  const user = authResult ? authResult.user : null;

  useEffect(() => {
    loadRestaurants();
    
    const handleReservationUpdate = () => {
      loadRestaurants();
    };
    
    window.addEventListener('reservationUpdated', handleReservationUpdate);
    
    return () => {
      window.removeEventListener('reservationUpdated', handleReservationUpdate);
    };
  }, []);

  const loadRestaurants = async () => {
    setLoading(true);
    try {
      const response = await RestaurantService.getAll();
      const data = response && response.data ? response.data : response;
      const restaurantList = Array.isArray(data) ? data : [];
      setRestaurants(restaurantList);
      setAllRestaurants(restaurantList);
      
      const seatsData = {};
      for (const restaurant of restaurantList) {
        try {
          if (RestaurantService.getAvailableSeats) {
            const seatsResponse = await RestaurantService.getAvailableSeats(restaurant.id);
            const seatsData_temp = seatsResponse && seatsResponse.data ? seatsResponse.data : seatsResponse;
            console.log(`Available seats for restaurant ${restaurant.id}:`, seatsData_temp);
            seatsData[restaurant.id] = seatsData_temp;
          } else {
            seatsData[restaurant.id] = { availableSeats: restaurant.totalTables * 4, availableTables: restaurant.totalTables };
          }
        } catch (err) {
          console.error(`Error fetching seats for restaurant ${restaurant.id}:`, err);
          seatsData[restaurant.id] = { availableSeats: restaurant.totalTables * 4, availableTables: restaurant.totalTables }; // Default to total capacity
        }
      }
      setAvailableSeats(seatsData);
    } catch (err) {
      setError('Failed to fetch restaurants');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearchSubmit = (term) => {
    if (!term) {
      setRestaurants(allRestaurants);
      return;
    }
    setRestaurants(allRestaurants.filter(r => 
      (r.cuisine || '').toLowerCase().includes(term.toLowerCase()) ||
      (r.name || '').toLowerCase().includes(term.toLowerCase())
    ));
  };

  const isAdmin = user && user.role && user.role.toUpperCase() === 'ADMIN';

  if (loading) return <div data-testid="loading">Loading...</div>;
  if (error) return <div data-testid="error">Failed to fetch restaurants</div>;

  return (
    <div style={{background: '#f7f8fa', minHeight: '100vh'}}>
      <div style={{background: 'linear-gradient(135deg, #fc8019 0%, #ff6900 100%)', color: 'white', padding: '80px 0 60px', textAlign: 'center'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 20px'}}>
          <h1 style={{fontSize: '48px', fontWeight: '700', marginBottom: '16px', letterSpacing: '-1px', color: 'white'}}>Discover Great Places to Dine</h1>
          <p style={{fontSize: '18px', margin: '0 0 24px 0', opacity: '0.9'}}>Book tables at your favorite restaurants</p>
          <RestaurantSearch onSearch={handleSearchSubmit} />
        </div>
      </div>
      
      <div style={{background: 'transparent', maxWidth: '1200px', margin: '0 auto', padding: '0 20px'}}>
        {user && user.role === 'CUSTOMER' && (
          <div style={{background: 'white', borderRadius: '12px', padding: '20px', margin: '20px 0', boxShadow: '0 2px 8px rgba(40, 44, 63, 0.08)', display: 'flex', alignItems: 'center', gap: '16px'}}>
            <div style={{width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg, #fc8019 0%, #ff6900 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '20px', fontWeight: '700'}}>
              {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h3 style={{margin: '0 0 4px 0', fontSize: '18px', fontWeight: '600', color: '#282c3f'}}>Welcome back!</h3>
              <p style={{margin: '0', fontSize: '14px', color: '#7e808c'}}>{user.email}</p>
            </div>
          </div>
        )}
        <div style={{padding: '60px 0', background: 'transparent'}}>
          <h2 style={{fontSize: '32px', fontWeight: '700', color: '#282c3f', marginBottom: '40px', textAlign: 'center', background: 'transparent'}}>All Restaurants</h2>
          
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px', marginTop: '40px', background: 'transparent'}}>
            {restaurants.length > 0 ? (
              restaurants.map(restaurant => (
                <div key={restaurant.id} style={{position: 'relative', background: 'transparent'}}>
                  <Link to={`/restaurants/${restaurant.id}`} style={{textDecoration: 'none', color: 'inherit', display: 'block', height: '100%'}}>
                    <div style={{background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(40, 44, 63, 0.08)', transition: 'all 0.3s ease', border: '1px solid #e9e9eb', height: '100%'}}>
                      <div style={{
                        height: '200px',
                        background: restaurant.imageUrl ? `url(${restaurant.imageUrl})` : 'linear-gradient(135deg, #fc8019 0%, #ff6900 100%)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: '600'
                      }}>
                        <div style={{background: 'rgba(255, 255, 255, 0.2)', padding: '8px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px'}}>{restaurant.cuisine}</div>
                      </div>
                      <div style={{padding: '20px', background: 'transparent'}}>
                        <h3 style={{fontSize: '20px', fontWeight: '700', color: '#282c3f', margin: '0 0 8px 0', lineHeight: '1.3'}}>{restaurant.name}</h3>
                        <p style={{color: '#7e808c', fontSize: '14px', margin: '0 0 16px 0', lineHeight: '1.4'}}>{restaurant.address}</p>
                        <div style={{display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap'}}>
                          <span style={{background: '#48c479', color: 'white', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px'}}>★ 4.2</span>
                          <span style={{color: '#7e808c', fontSize: '12px', fontWeight: '500'}}>25-30 mins</span>
                          <span style={{color: '#282c3f', fontSize: '12px', fontWeight: '600'}}>₹300 for two</span>
                          <span style={{color: '#fc8019', fontSize: '12px', fontWeight: '600'}}>
                            {availableSeats[restaurant.id]?.availableSeats === 0 ? 'Restaurant Full' : 
                             availableSeats[restaurant.id] ? `Available Today: ${availableSeats[restaurant.id].availableSeats} seats (${availableSeats[restaurant.id].availableTables} tables)` : 'Loading...'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                  {isAdmin && (
                    <button style={{position: 'absolute', top: '12px', right: '12px', background: '#ff4757', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', zIndex: '10', transition: 'all 0.3s ease'}} onClick={() => {
                      if (window.confirm('Are you sure you want to delete this restaurant?')) {
                        RestaurantService.delete(restaurant.id)
                          .then(() => {
                            alert('Restaurant deleted successfully!');
                            loadRestaurants();
                          })
                          .catch(() => {
                            alert('Failed to delete restaurant. Please try again.');
                          });
                      }
                    }}>Delete</button>
                  )}
                </div>
              ))
            ) : (
              <div style={{gridColumn: '1 / -1', textAlign: 'center', padding: '80px 20px', color: '#7e808c'}} data-testid="no-results">
                <h3 style={{fontSize: '24px', color: '#282c3f', marginBottom: '8px'}}>No restaurants found</h3>
                <p style={{fontSize: '16px', margin: '0'}}>Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantList;
