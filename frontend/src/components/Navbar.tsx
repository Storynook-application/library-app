// src/components/Navbar.tsx

import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { token, logout } = useContext(AuthContext);

  return (
    <nav style={{ margin: '1rem' }}>
      <Link to="/" style={{ marginRight: '1rem' }}>
        Home
      </Link>
      {!token && (
        <>
          <Link to="/register" style={{ marginRight: '1rem' }}>
            Register
          </Link>
          <Link to="/login" style={{ marginRight: '1rem' }}>
            Login
          </Link>
          <Link to="/forgot-password">Forgot Password</Link>
        </>
      )}
      {token && (
        <>
          <Link to="/libraries" style={{ marginRight: '1rem' }}>
            My Libraries
          </Link>
          <button onClick={logout}>Logout</button>
        </>
      )}
    </nav>
  );
};

export default Navbar;
