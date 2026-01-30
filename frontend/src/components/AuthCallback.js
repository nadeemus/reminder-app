import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const error = params.get('error');

    if (error) {
      // OAuth failed, redirect to login with error message
      navigate(`/login?error=${error}`);
      return;
    }

    // Fetch token from session (more secure than query params)
    fetch(`${API_BASE_URL}/auth/session-token`, {
      credentials: 'include' // Include session cookie
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('No token in session');
        }
        return res.json();
      })
      .then(data => {
        const token = data.token;
        // Fetch user data with the token
        return fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
          .then(res => res.json())
          .then(userData => {
            login(token, userData);
            navigate('/');
          });
      })
      .catch(err => {
        console.error('Error in OAuth callback:', err);
        navigate('/login?error=callback_failed');
      });
  }, [location, login, navigate]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{ color: 'white', fontSize: '20px' }}>
        Completing sign in...
      </div>
    </div>
  );
};

export default AuthCallback;
