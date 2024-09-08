// src/components/StoriesPage.js

import React, { useState, useEffect } from 'react';
import axiosInstance from './axiosInstance'; // Adjust the path as needed
import { Container, Row, Col, Card, ListGroup, Spinner, Alert } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode'; // Named import

const getUserIdFromToken = () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        const decodedToken = jwtDecode(token);
        return decodedToken.user_id; // Adjust according to the token's structure
    }
    return null;
};

const StoriesPage = () => {
    const [stories, setStories] = useState([]);
    const [sections, setSections] = useState([]);
    const [branches, setBranches] = useState([]);
    const [selectedStory, setSelectedStory] = useState(null);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const id = getUserIdFromToken();
        setUserId(id);
    }, []);

    useEffect(() => {
        if (userId) {
            setLoading(true);
            axiosInstance.get('stories/')
                .then(response => {
                    const allStories = response.data;
                    // Filter stories based on the logged-in user
                    const filteredStories = allStories.filter(story => story.user === userId);
                    setStories(filteredStories);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching stories:', error);
                    setError('Failed to fetch stories.');
                    setLoading(false);
                });
        }
    }, [userId]);

    const handleStoryClick = (storyId) => {
        setSelectedStory(storyId);
        setLoading(true);
        axiosInstance.get(`sections/?story_id=${storyId}`) // Make sure query param matches your backend
            .then(response => {
                setSections(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching sections:', error);
                setError('Failed to fetch sections.');
                setLoading(false);
            });
    };

    useEffect(() => {
        if (sections.length > 0) {
            setLoading(true);
            const fetchBranches = async () => {
                const branchPromises = sections.map(section =>
                    axiosInstance.get(`branches/?section=${section.id}`)
                );
                
                try {
                    const results = await Promise.all(branchPromises);
                    const allBranches = results.flatMap(result => result.data);
                    setBranches(allBranches);
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching branches:', error);
                    setError('Failed to fetch branches.');
                    setLoading(false);
                }
            };

            fetchBranches();
        }
    }, [sections]);

    const getMostPopularBranch = () => {
        if (branches.length === 0) return null;
        return branches.reduce((prev, current) => (prev.is_clicked > current.is_clicked) ? prev : current);
    };

    return (
        <Container>
            {loading && <Spinner animation="border" />}
            {error && <Alert variant="danger">{error}</Alert>}
            <Row>
                <Col md={4}>
                    <h2>Click a story to see the branch analytics</h2>
                    {stories.length > 0 ? (
                        <ListGroup>
                            {stories.map(story => (
                                <ListGroup.Item
                                    key={story.id}
                                    action
                                    onClick={() => handleStoryClick(story.id)}
                                >
                                    {story.story_name}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    ) : (
                        <p>No stories available.</p>
                    )}
                </Col>
                <Col md={8}>
                    {sections.length > 0 && (
                        <>
                            <h2>Branches</h2>
                            {branches.length > 0 ? (
                                <Row>
                                    {branches.map(branch => (
                                        <Col md={6} key={branch.id} className="mb-3">
                                            <Card>
                                                <Card.Body>
                                                    <Card.Title>{branch.branch_option}</Card.Title>
                                                    <Card.Text>{branch.branch_writing}</Card.Text>
                                                    <Card.Text>Click Count: {branch.is_clicked}</Card.Text>
                                                    {branch.id === getMostPopularBranch()?.id && (
                                                        <Card.Text className="text-success">Most Popular Branch</Card.Text>
                                                    )}
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            ) : (
                                <p>No branches available.</p>
                            )}
                        </>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default StoriesPage;
