// src/components/Auth/ForgotPasswordForm.tsx

import React, { useState } from 'react';
import api from '../../services/api';

const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await api.post('/auth/forgot-password', { email });

      if (response.status === 200) {
        setMessage(
          'If that email is in our system, a reset link has been sent.'
        );
        setEmail('');
      } else {
        setError(response.data.error || 'Request failed.');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.error || 'Server error. Please try again later.'
      );
      console.error('Forgot Password error:', err);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      <h2>Forgot Password</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      <form onSubmit={handleForgotPassword}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>
          Send Reset Link
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
