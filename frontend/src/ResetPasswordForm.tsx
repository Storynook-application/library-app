// src/components/ResetPasswordForm.tsx

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ResetPasswordForm: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Extract token from query parameters
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token') || '';

  useEffect(() => {
    // Simple password strength checker
    if (newPassword.length >= 8) {
      if (/[A-Z]/.test(newPassword) && /[0-9]/.test(newPassword)) {
        setPasswordStrength('Strong');
      } else {
        setPasswordStrength('Medium');
      }
    } else if (newPassword.length > 0) {
      setPasswordStrength('Weak');
    } else {
      setPasswordStrength('');
    }
  }, [newPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Basic validation
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Password reset failed.');
        return;
      }

      setMessage('Your password has been reset successfully!');
      // Optionally, redirect to login after a delay
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      console.error('Reset Password error:', err);
      setError('Server error. Please try again later.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      <h2>Reset Password</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      <form onSubmit={handleSubmit}>
        {/* New Password Input */}
        <div style={{ marginBottom: '1rem' }}>
          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
          {passwordStrength && (
            <p>Password Strength: <strong>{passwordStrength}</strong></p>
          )}
        </div>

        {/* Confirm Password Input */}
        <div style={{ marginBottom: '1rem' }}>
          <label>Confirm New Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <button type="submit" style={{ padding: '0.5rem 1rem' }}>
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
