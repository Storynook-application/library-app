import React, { useState } from 'react';

interface RegisterFormProps {
  onRegisterSuccess?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegisterSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        // The server might return { error: 'User already exists' } or something else
        setError(data.error || 'Registration failed');
        return;
      }

      // Registration success
      setMessage('Registration successful! You can now log in.');
      if (onRegisterSuccess) {
        onRegisterSuccess();
      }
      // Optionally clear fields
      setEmail('');
      setPassword('');
    } catch (err) {
      console.error('Register error:', err);
      setError('Server error. Please try again later.');
    }
  };

  return (
    <form onSubmit={handleRegister} style={{ maxWidth: '300px', margin: 'auto' }}>
      <h2>Register</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}

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

      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterForm;
