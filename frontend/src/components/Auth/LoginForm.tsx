// src/components/Auth/LoginForm.tsx

import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

const LoginForm: React.FC = () => {
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
      // Navigation is handled inside AuthContext upon successful login
    } catch (err: any) {
      // Handle different error responses based on your backend implementation
      setError(err.response?.data?.error || 'Login failed. Please try again.');
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
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ display: 'block', width: '100%' }}
        />
      </div>

      <div style={{ marginBottom: '8px' }}>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ display: 'block', width: '100%' }}
        />
      </div>

      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
