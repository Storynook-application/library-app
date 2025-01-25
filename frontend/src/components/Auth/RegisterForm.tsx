// src/components/Auth/RegisterForm.tsx

import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

const RegisterForm: React.FC = () => {
  const { register } = useContext(AuthContext);

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      await register(email, password);
      // Navigation is handled inside AuthContext upon successful registration
    } catch (err: any) {
      setError(
        err.response?.data?.error || 'Registration failed. Please try again.'
      );
    }
  };

  return (
    <form
      onSubmit={handleRegister}
      style={{ maxWidth: '300px', margin: 'auto' }}
    >
      <h2>Register</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}

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

      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterForm;
