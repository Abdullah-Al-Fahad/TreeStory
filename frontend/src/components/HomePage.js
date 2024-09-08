import React, { useState } from 'react';
import { Button, Form, Modal, Card, Alert } from 'react-bootstrap';
import axios from 'axios';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';

const HomePage = ({ onLoginSuccess }) => {
  const [showRegister, setShowRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => setShowRegister(false);
  const handleShow = () => setShowRegister(true);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('https://fahaad.pythonanywhere.com/api/auth/login/', {
        email,
        password,
      });

      const { access, refresh } = response.data;  // Extract both tokens
      localStorage.setItem('accessToken', access); // Store access token
      localStorage.setItem('refreshToken', refresh); // Store refresh token
      setSuccessMessage('Login successful!');
      setLoginError('');
      onLoginSuccess(); // Notify App component
      navigate('/stories'); // Redirect to StoryPage
    } catch (error) {
      const errorMessage = error.response?.data?.non_field_errors || 'Invalid credentials or server error';
      setLoginError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterError('');
    if (!name || !email || !password || !confirmPassword) {
      setRegisterError('All fields are required');
      return;
    }
    if (password !== confirmPassword) {
      setRegisterError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await axios.post('https://fahaad.pythonanywhere.com/api/auth/register/', {
        username: name,
        email,
        password,
        confirm_password: confirmPassword,
      });
      setSuccessMessage('Registration successful!');
      setEmail('');
      setPassword('');
      setName('');
      setConfirmPassword('');
      handleClose();
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error registering user or server error';
      setRegisterError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="homepage-container">
      <div className="intro-section">
        <h1>TreeStory</h1>
        <p>The ending of your story depends on the choices you make along the way.</p>
      </div>
      <Card className="custom-card">
        <Card.Header className="custom-card-header" />
        <Card.Body>
          <Form onSubmit={handleLogin}>
            {loginError && <Alert variant="danger">{loginError}</Alert>}
            {successMessage && <Alert variant="success">{successMessage}</Alert>}
            <Form.Group controlId="formBasicEmail" className="mb-3">
              <Form.Control
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formBasicPassword" className="mb-3">
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100 mb-3" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
            <Button variant="link" onClick={handleShow} className="w-100">
              Create New Account
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {/* Registration Modal */}
      <Modal show={showRegister} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create New Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleRegister}>
            {registerError && <Alert variant="danger">{registerError}</Alert>}
            {successMessage && <Alert variant="success">{successMessage}</Alert>}
            <Form.Group controlId="formBasicName" className="mb-3">
              <Form.Control
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formBasicEmail" className="mb-3">
              <Form.Control
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formBasicPassword" className="mb-3">
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formBasicPasswordConfirm" className="mb-3">
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default HomePage;
