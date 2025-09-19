
import axios from 'axios';

const API_BASE_URL = '/api';

const ReservationService = {
  create: (reservationData) => {
    const { restaurantId, ...data } = reservationData;
    return axios.post(`${API_BASE_URL}/restaurants/${restaurantId}/reservations`, data);
  },
  getAll: () => axios.get(`${API_BASE_URL}/reservations`),
  getByUser: (userEmail) => axios.get(`${API_BASE_URL}/users/${userEmail}/reservations`),
  updateStatus: (id, status) => axios.put(`${API_BASE_URL}/reservations/${id}/status`, { status }),
  // keep confirm alias for components/tests that call confirm
  confirm: (id) => axios.put(`${API_BASE_URL}/reservations/${id}/status`, { status: 'CONFIRMED' }),
  cancel: (id) => axios.delete(`${API_BASE_URL}/reservations/${id}`),
};

export default ReservationService;
