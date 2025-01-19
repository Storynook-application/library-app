// src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import RegisterForm from './RegisterForm.tsx';
import LoginForm from './LoginForm.tsx';
import ResetPasswordForm from './ResetPasswordForm.tsx';
import ForgotPasswordForm from './ForgotPasswordForm.tsx';

function App() {
  return (
    <Router>
      {/* Navigation Bar */}
      <nav style={{ margin: '1rem' }}>
        <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
        <Link to="/register" style={{ marginRight: '1rem' }}>Register</Link>
        <Link to="/login" style={{ marginRight: '1rem' }}>Login</Link>
        <Link to="/forgot-password">Forgot Password</Link>
      </nav>

      {/* Define Routes */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/reset-password" element={<ResetPasswordForm />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} /> {/* New Route */}
      </Routes>
    </Router>
  );
}

// Basic Home Page Component
function HomePage() {
  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Welcome to StoryNook!</h1>
      <p>Your favorite library app.</p>
    </div>
  );
}

export default App;
