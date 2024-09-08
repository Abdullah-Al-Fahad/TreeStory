// src/SettingsPage.js
import React, { useState } from 'react';
import { Button, Form, Alert, Card, Container, Row, Col, ListGroup } from 'react-bootstrap';

const SettingsPage = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [resetPasswordError, setResetPasswordError] = useState('');
    const [resetPasswordSuccess, setResetPasswordSuccess] = useState('');

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        setResetPasswordError('');
        setResetPasswordSuccess('');

        if (!oldPassword || !newPassword || !confirmNewPassword) {
            setResetPasswordError('All fields are required');
            return;
        }

        if (newPassword !== confirmNewPassword) {
            setResetPasswordError('New passwords do not match');
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/api/auth/change-password/', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify({
                    old_password: oldPassword,
                    new_password: newPassword,
                    confirm_new_password: confirmNewPassword
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setResetPasswordError(errorData.detail || 'Failed to reset password');
            } else {
                setResetPasswordSuccess('Password reset successfully');
            }
        } catch (error) {
            setResetPasswordError('An error occurred');
        }
    };

    return (
        <Container>
            <Row className="mt-4">
                <Col md={4}>
                    <ListGroup>
                        <ListGroup.Item
                            action
                            active
                        >
                            Reset Password
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={8}>
                    <Card>
                        <Card.Header>Reset Password</Card.Header>
                        <Card.Body>
                            {resetPasswordError && <Alert variant="danger">{resetPasswordError}</Alert>}
                            {resetPasswordSuccess && <Alert variant="success">{resetPasswordSuccess}</Alert>}
                            <Form onSubmit={handlePasswordReset}>
                                <Form.Group controlId="formOldPassword">
                                    <Form.Control
                                        type="password"
                                        placeholder="Old Password"
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group controlId="formNewPassword">
                                    <Form.Control
                                        type="password"
                                        placeholder="New Password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group controlId="formConfirmNewPassword">
                                    <Form.Control
                                        type="password"
                                        placeholder="Confirm New Password"
                                        value={confirmNewPassword}
                                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Button variant="primary" type="submit" className="mt-3">Reset Password</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default SettingsPage;
