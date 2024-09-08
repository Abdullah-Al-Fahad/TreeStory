import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import StoryPage from './components/StoryPage';
import SettingsPage from './components/SettingsPage';
import CreateStoryPage from './components/CreateStoryPage';
import ReadStory from './components/ReadStory'; // Import ReadStory component
import UserStories from './components/UserStories'; // Import UserStories component

import './App.css';

// Wrapper component for protected routes
const ProtectedRoute = ({ isLoggedIn, children }) => {
  return isLoggedIn ? children : <Navigate to="/" />;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is logged in on app load
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Home Page Route */}
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <Navigate to="/stories" /> // Redirect to /stories if logged in
              ) : (
                <HomePage onLoginSuccess={handleLoginSuccess} />
              )
            }
          />
          
          {/* Story Page Route */}
          <Route
            path="/stories"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <StoryPage onLogout={handleLogout} /> 
              </ProtectedRoute>
            }
          />

          {/* Route for ReadStory Page */}
          <Route
            path="/read-story"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <ReadStory />
              </ProtectedRoute>
            }
          />
          
          {/* Create Story Page */}
          <Route
            path="/create-story"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <CreateStoryPage />
              </ProtectedRoute>
            }
          />
          
          {/* Settings Page */}
          <Route
            path="/settings"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          {/* Story Page Route */}
          <Route
            path="/branchrank"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                < UserStories/>
              
              </ProtectedRoute>
            }
          />

          {/* Catch-All Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
