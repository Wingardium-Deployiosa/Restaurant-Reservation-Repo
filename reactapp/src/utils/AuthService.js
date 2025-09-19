import axios from 'axios';

const API_URL = '/api/auth';

const AuthService = {
  login: (credentials) => axios.post(`${API_URL}/login`, credentials),
};

export default AuthService;