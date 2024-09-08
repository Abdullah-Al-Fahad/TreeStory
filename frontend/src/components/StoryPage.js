import React from 'react';
import { Button, Navbar, Nav, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import './StoryPage.css';

const StoryPage = ({ onLogout }) => {
    const navigate = useNavigate(); // Initialize useNavigate

    const handleCreateStoryClick = () => {
        navigate('/create-story'); // Navigate to CreateStoryPage
    };

    const handleBrowseStoriesClick = () => {
        navigate('/read-story'); // Navigate to ReadStory page
    };
    
    const handleAnalyticClick = () => {
        navigate('/branchrank'); // Navigate to SettingsPage
    };

    const settings = () => {
        navigate('/settings'); // Navigate to SettingsPage
    };

    return (
        <div className="story-page-container">
            {/* Navbar */}
            <Navbar bg="dark" variant="dark" expand="lg" className="mb-4 shadow-sm">
                <Container>
                    <Navbar.Brand href="#home">Interactive Storytelling</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ml-auto">
                            <Nav.Link onClick={handleAnalyticClick} style={{ cursor: 'pointer' }}>
                                Story Analytics
                            </Nav.Link>
                           
                            <Nav.Link onClick={onLogout} style={{ cursor: 'pointer' }}>
                                Logout
                            </Nav.Link>

                            <Nav.Link onClick={settings} style={{ cursor: 'pointer' }}>
                                Setting
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Main Content */}
            <Container className="d-flex align-items-center justify-content-center min-vh-100">
                <Row className="text-center">
                    <Col>
                        <div className="button-container">
                            <Button 
                                variant="primary" 
                                size="lg" 
                                className="custom-button mb-4"
                                onClick={handleCreateStoryClick} // Use the navigation handler
                            >
                                Create New Story
                            </Button>
                            <Button 
                                variant="secondary" 
                                size="lg" 
                                className="custom-button"
                                onClick={handleBrowseStoriesClick} // Use the navigation handler
                            >
                                Browse Stories
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default StoryPage;
