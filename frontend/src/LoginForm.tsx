import React, { useState } from 'react';

/**
 * LoginForm component
 * - Renders an email + password form
 * - Calls /auth/login on the backend
 * - Stores JWT token in localStorage if successful
 */
interface LoginFormProps {
  // This callback is called when login succeeds (optional usage)
  onLoginSuccess?: (token: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // This function is called when the user submits the form
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // Make the POST request to your backend
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        // If response is not OK, show error message
        setError(data.error || 'Login failed');
        return;
      }

      // If success, store token in localStorage
      localStorage.setItem('token', data.token);

      // Optionally notify a parent component that we have a token
      if (onLoginSuccess) {
        onLoginSuccess(data.token);
      }

      // You might want to do something else (e.g., navigate, reload the page, etc.)
      console.log('Login successful:', data);
    } catch (err) {
      console.error('Server error:', err);
      setError('Server error, please try again later.');
    }
  };

  return (
    <form onSubmit={handleLogin} style={{ maxWidth: '300px', margin: 'auto' }}>
      <h2>Login</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ marginBottom: '8px' }}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ display: 'block', width: '100%' }}
        />
      </div>

      <div style={{ marginBottom: '8px' }}>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ display: 'block', width: '100%' }}
        />
      </div>

      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
