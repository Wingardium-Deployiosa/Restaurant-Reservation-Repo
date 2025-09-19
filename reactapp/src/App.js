import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useAuth, AuthProvider } from './AuthContext';

import RestaurantList from './components/RestaurantList';
import RestaurantDetail from './components/RestaurantDetail';
import ReservationList from './components/ReservationList';
import AdminHome from './components/AdminHome';
import AdminRestaurantControl from './components/AdminRestaurantControl';
import ReservationDetailsPage from './components/ReservationDetailsPage';
import OwnerDashboard from './components/OwnerDashboard'; // New
import LoginPage from './components/LoginPage';
import './App.css';

function App() {
return (
<AuthProvider>
<Router>
<div className="App">
<header className="App-header">
<h1>Restaurant Reservation System</h1>
<nav className="navbar" style={{display: 'flex', alignItems: 'center', gap: '20px'}}><AuthNav /></nav>
</header>
<main>
<Routes>
<Route path="/login" element={<LoginPage />} />
<Route path="/register" element={<RegisterPage />} />
<Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
<Route path="/restaurants/:id" element={<ProtectedRoute><CustomerOnlyRoute><RestaurantDetail /></CustomerOnlyRoute></ProtectedRoute>} />
<Route path="/admin-control" element={<ProtectedRoute><AdminRestaurantControl /></ProtectedRoute>} />
<Route path="/my-reservations" element={<ProtectedRoute><ReservationList /></ProtectedRoute>} />
<Route path="/manage-reservations" element={<ProtectedRoute><ReservationList /></ProtectedRoute>} />
<Route path="/reservations/:id" element={<ProtectedRoute><ReservationDetailsPage /></ProtectedRoute>} />
<Route path="/owner-dashboard" element={<ProtectedRoute><OwnerDashboard /></ProtectedRoute>} />
</Routes>
</main>
</div>
</Router>
</AuthProvider>
);
}

const HomePage = () => {
const { user } = useAuth();
if (user.role === 'ADMIN') return <AdminHome />;
if (user.role === 'OWNER') return <OwnerDashboard />;
return <RestaurantList />; 
};

const AuthNav = () => {
const { user, logout } = useAuth();
const [showUserPopup, setShowUserPopup] = React.useState(false);
const [currentTime, setCurrentTime] = React.useState(new Date());
const popupRef = React.useRef(null);

React.useEffect(() => {
  const timer = setInterval(() => setCurrentTime(new Date()), 1000);
  return () => clearInterval(timer);
}, []);

React.useEffect(() => {
  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setShowUserPopup(false);
    }
  };
  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);

if (!user) return <Link to="/login">Login</Link>;

return (
<>
<Link to="/">Home</Link>
{user.role.toUpperCase() === 'CUSTOMER' && <Link to="/my-reservations">My Reservations</Link>}
{user.role.toUpperCase() === 'OWNER' && <Link to="/manage-reservations">Manage Reservations</Link>}
{user.role.toUpperCase() === 'ADMIN' && (
<>
<Link to="/admin-control">Admin Control</Link>
<Link to="/manage-reservations">All Bookings</Link>
</>
)}
<div ref={popupRef} style={{position: 'relative', marginLeft: 'auto'}}>
  <div 
    onClick={() => setShowUserPopup(!showUserPopup)}
    style={{
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      background: '#fc8019',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      color: 'white',
      fontSize: '18px'
    }}
  >
    👤
  </div>
  {showUserPopup && (
    <div style={{
      position: 'absolute',
      top: '50px',
      right: '0',
      background: 'white',
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '16px',
      minWidth: '200px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 1000
    }}>
      <div style={{marginBottom: '12px'}}>
        <strong>User Details</strong>
      </div>
      <div style={{marginBottom: '8px', fontSize: '14px'}}>
        <strong>Email:</strong> {user.email}
      </div>
      <div style={{marginBottom: '8px', fontSize: '14px'}}>
        <strong>Role:</strong> {user.role}
      </div>
      <div style={{marginBottom: '12px', fontSize: '14px'}}>
        <strong>Current Time:</strong><br/>
        {currentTime.toLocaleString()}
      </div>
      <button 
        onClick={() => {
          if (window.confirm('Are you sure you want to logout?')) {
            logout();
            alert('Logged out successfully!');
          }
        }}
        style={{
          background: '#ff4757',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '4px',
          cursor: 'pointer',
          width: '100%'
        }}
      >
        Logout
      </button>
    </div>
  )}
</div>
</>
);
};

const CustomerOnlyRoute = ({ children }) => {
const { user } = useAuth();
if (user.role.toUpperCase() !== 'CUSTOMER') {
return <Navigate to="/" />;
}
return children;
};

const ProtectedRoute = ({ children }) => {
const { user } = useAuth();
if (!user) {
return <Navigate to="/login" />;
}
return children;
};

export default App;
import RegisterPage from './components/RegisterPage';