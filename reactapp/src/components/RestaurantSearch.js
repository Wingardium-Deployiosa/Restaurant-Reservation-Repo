
import React, { useState, useRef } from 'react';
import RestaurantService from '../utils/RestaurantService';
import './RestaurantSearch.css';

const DEFAULT_DEBOUNCE_MS = 300;

const RestaurantSearch = ({ onSearch, onResults, debounceMs = DEFAULT_DEBOUNCE_MS }) => {
  const [cuisine, setCuisine] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  
  const handleChange = (e) => {
    const val = e.target.value;
    setCuisine(val);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (onSearch) {
        onSearch(val.trim());
      }
    }, debounceMs);
  };

  
  const handleSearch = async () => {
    const term = cuisine.trim();
    if (onSearch) {
      onSearch(term);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await RestaurantService.searchByCuisine(term);
      const data = response && response.data ? response.data : response;
      const restaurantList = Array.isArray(data) ? data : [];
      setRestaurants(restaurantList);
      if (onResults) onResults(restaurantList);
    } catch (err) {
      console.error('Error searching by cuisine!', err);
      setError('Failed to search restaurants.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (debounceRef.current) clearTimeout(debounceRef.current);
      handleSearch();
    }
  };

  return (
    <div className="search-section">
      <div className="search-container">
        <div className="search-box">
          <div className="search-icon">
            <i className="fas fa-search"></i>
          </div>
          <input
            data-testid="search-input"
            type="text"
            value={cuisine}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Search for restaurants, cuisines..."
            className="search-input"
          />
          <button
            data-testid="search-button"
            onClick={handleSearch}
            className="search-btn"
          >
            Search
          </button>
        </div>
      </div>

      {!onSearch && (
        <div className="search-results">
          {loading && <div data-testid="loading" className="loading-state">Searching restaurants...</div>}
          {error && <div data-testid="error" className="error-state">{error}</div>}
          {!loading && !error && restaurants.length === 0 && cuisine && (
            <div data-testid="no-results" className="no-results-state">No matching restaurants found.</div>
          )}
          {!loading && !error && restaurants.length > 0 && (
            <div className="restaurant-grid">
              {restaurants.map((r) => (
                <div key={r.id} className="restaurant-card">
                  <h3>{r.name}</h3>
                  <p>{r.address}</p>
                  <p>Cuisine: {r.cuisine}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
);
};

export default RestaurantSearch;