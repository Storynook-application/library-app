// src/App.tsx

import { Routes, Route, useParams } from 'react-router-dom';
import RegisterForm from './components/Auth/RegisterForm';
import LoginForm from './components/Auth/LoginForm';
import ResetPasswordForm from './components/Auth/ResetPasswordForm';
import ForgotPasswordForm from './components/Auth/ForgotPasswordForm';
import LibraryList from './components/Libraries/LibraryList';
import BookList from './components/Books/BookList';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

const BookListWrapper = () => {
  const { libraryId } = useParams<{ libraryId: string }>();

  if (!libraryId) {
    return <p>Invalid Library ID.</p>;
  }

  return <BookList libraryId={parseInt(libraryId, 10)} />;
};

// Basic Home Page Component
const HomePage = () => {
  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Welcome to StoryNook!</h1>
      <p>Your favorite library app.</p>
    </div>
  );
};

const App = () => {
  return (
    <div>
      {/* Navigation Bar */}
      <Navbar />

      {/* Define Routes */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/reset-password" element={<ResetPasswordForm />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />

        {/* Protected Routes */}
        <Route
          path="/libraries"
          element={
            <ProtectedRoute>
              <LibraryList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/libraries/:libraryId/books"
          element={
            <ProtectedRoute>
              <BookListWrapper />
            </ProtectedRoute>
          }
        />
        {/* Catch-all route or default route (Optional) */}
        <Route path="*" element={<LoginForm />} />
        {/* Add more routes as needed */}
      </Routes>
    </div>
  );
};

export default App;
