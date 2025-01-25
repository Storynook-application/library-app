// src/components/Auth/ResetPasswordForm.tsx

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const ResetPasswordForm: React.FC = () => {
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [passwordStrength, setPasswordStrength] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
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
      const response = await api.post('/auth/reset-password', {
        token,
        newPassword,
      });

      if (response.status === 200) {
        setMessage('Your password has been reset successfully!');
        // Redirect to login after a short delay
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(response.data.error || 'Password reset failed.');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.error || 'Server error. Please try again later.'
      );
      console.error('Reset Password error:', err);
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
            <p>
              Password Strength: <strong>{passwordStrength}</strong>
            </p>
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
