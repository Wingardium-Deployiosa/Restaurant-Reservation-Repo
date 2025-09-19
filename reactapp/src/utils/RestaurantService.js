
import axios from 'axios';

const API_URL = '/api/restaurants';

const RestaurantService = {
  getAll: () => axios.get(API_URL),
  getById: (id) => axios.get(`${API_URL}/${id}`),
  getByOwner: (ownerEmail) => axios.get(`${API_URL}/owner/${ownerEmail}`),
  searchByCuisine: (cuisine) => axios.get(`${API_URL}/cuisine/${cuisine}`),
  create: (restaurantData) => axios.post(`${API_URL}`, restaurantData),
  update: (id, restaurantData) => axios.put(`${API_URL}/${id}`, restaurantData),
  delete: (id) => axios.delete(`${API_URL}/${id}`),
  getAvailableSeats: (id) => axios.get(`${API_URL}/${id}/available-seats`),
  getAvailableSeatsForDate: (id, date) => axios.get(`${API_URL}/${id}/available-seats/${date}`),
};

export default RestaurantService;
