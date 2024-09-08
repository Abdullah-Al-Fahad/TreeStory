import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Modal, Toast, Alert } from 'react-bootstrap';
import axiosInstance from './axiosInstance';
import './CreateStoryPage.css'; 
import { useNavigate } from 'react-router-dom';

const CreateStoryPage = () => {
    // Story state
    const [storyName, setStoryName] = useState('');
    const [genre, setGenre] = useState('');
    const [storyId, setStoryId] = useState(null);

    // Section state
    const [sectionName, setSectionName] = useState('');
    const [sectionWriting, setSectionWriting] = useState('');
    const [sections, setSections] = useState([]);
    const [sectionNumber, setSectionNumber] = useState('1');
    const [sectionSubmitted, setSectionSubmitted] = useState(false);

    // Branch state
    const [branches, setBranches] = useState([]);
    const [branchName, setBranchName] = useState('');
    const [branchOutcome, setBranchOutcome] = useState('');
    const [showBranchModal, setShowBranchModal] = useState(false);
    const [currentSection, setCurrentSection] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    // Finish confirmation modal state
    const [showFinishModal, setShowFinishModal] = useState(false); // New state for finish confirmation

    // Confirmation modal content
    const [branchesToConvert, setBranchesToConvert] = useState([]);

    // Notifications
    const [error, setError] = useState('');
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    
    const navigate = useNavigate();  // Add this here

    // Fetch sections if storyId changes
    useEffect(() => {
        if (storyId) {
            const fetchSections = async () => {
                try {
                    const response = await axiosInstance.get(`/sections/?story=${storyId}`);
                    setSections(response.data);
                } catch (error) {
                    console.error('Error fetching sections:', error.response ? error.response.data : error.message);
                }
            };

            fetchSections();
        }
    }, [storyId]);

    // Handle story submission
    const handleStorySubmit = async () => {
        try {
            const response = await axiosInstance.post('/stories/', {
                story_name: storyName,
                genre: genre,
                section_size: 0,
            });
            setStoryId(response.data.id);
            setToastMessage('Story created successfully!');
            setShowSuccessToast(true);
        } catch (error) {
            console.error('Error creating story:', error.response ? error.response.data : error.message);
            setError('Failed to create story. Please ensure you are logged in.');
        }
    };

    // Handle section submission
    const handleSectionSubmit = async () => {
        if (!sectionName || !sectionWriting) {
            alert('Please fill in both the section name and section writing.');
            return;
        }

        try {
            const response = await axiosInstance.post('/sections/', {
                section_name: sectionName,
                story: storyId,
                branch_size: 0,
                section_number: sectionNumber,
                section_writing: sectionWriting,
                branch_ids: branches.filter(branch => branch.is_converted).map(branch => branch.id) // Send converted branches
            });
            const newSection = response.data;
            setSections([...sections, newSection]);
            setCurrentSection(newSection);
            setSectionSubmitted(true);
            setSectionName('');
            setSectionWriting('');
            setToastMessage('Section created successfully!');
            setShowSuccessToast(true);
        } catch (error) {
            console.error('Error creating section:', error.response ? error.response.data : error.message);
            setError('Failed to create section.');
        }
    };

    // Handle branch submission
    const handleBranchSubmit = async () => {
        if (!currentSection) {
            alert('Please submit the first section before adding branches.');
            return;
        }
        if (!branchName || !branchOutcome) {
            alert('Please fill in both branch name and outcome.');
            return;
        }

        try {
            const response = await axiosInstance.post('/branches/', {
                section: currentSection.id,
                branch_option: branchName,
                branch_number: branches.length + 1,
                branch_writing: branchOutcome,
                is_converted: false // Default to false when creating a new branch
            });
            const newBranch = response.data;
            setBranches([...branches, newBranch]);
            setBranchName('');
            setBranchOutcome('');
            setShowBranchModal(false);
            setToastMessage('Branch created successfully!');
            setShowSuccessToast(true);
        } catch (error) {
            console.error('Error creating branch:', error.response ? error.response.data : error.message);
            alert('Failed to create branch.');
        }
    };

    // Handle navigation to next section or create sections from branches
    const handleNextSection = () => {
        const branchesToConvert = branches.filter(branch => !branch.is_converted);

        if (branchesToConvert.length > 0) {
            setBranchesToConvert(branchesToConvert);
            setShowConfirmModal(true); // Show confirmation modal
        } else {
            // Simply show the sections list if no branches are left to convert
            setCurrentSection(null);
        }
    };

    // Confirm and handle branch conversion
    const handleConfirmConvert = async () => {
        // Keep track of successfully created sections
        let successfullyCreatedSections = [];
        // Track errors for sections that failed to create
        let creationErrors = [];
    
        try {
            const newSections = branchesToConvert.map(branch => ({
                section_name: branch.branch_option,
                story: storyId,
                section_number: `${sectionNumber}.${branch.branch_number}`,
                section_writing: branch.branch_writing,
                branch_ids: [branch.id]
            }));
    
            // Attempt to create new sections and handle individual section errors
            await Promise.all(newSections.map(async (section) => {
                try {
                    const response = await axiosInstance.post('/sections/', section);
                    successfullyCreatedSections.push(response.data);
                } catch (error) {
                    // Collect errors but do not stop the process
                    creationErrors.push(error);
                }
            }));
    
            // Update branches to mark as converted
            setBranches(prevBranches =>
                prevBranches.map(branch =>
                    branchesToConvert.includes(branch)
                        ? { ...branch, is_converted: true }
                        : branch
                )
            );
    
            // Add successfully created sections to the list
            setSections([...sections, ...successfullyCreatedSections]);
    
            // Reset the current section and increment the section number
            setCurrentSection(null);
            setSectionNumber(`${parseInt(sectionNumber, 10) + 1}`);
            setToastMessage('Next sections created successfully!');
            setShowSuccessToast(true);
    
            // Optionally log errors
            if (creationErrors.length > 0) {
                console.error('Some sections failed to create:', creationErrors);
            }
        } catch (error) {
            console.error('Unexpected error during section creation:', error.response ? error.response.data : error.message);
            // Handle unexpected errors here if needed
        } finally {
            // Ensure the modal is closed
            setShowConfirmModal(false);
        }
    };

    // Handle section click
    const handleSectionClick = (section) => {
        setCurrentSection(section);
        setSectionNumber(section.section_number);
        // Fetch branches for the selected section
        const fetchBranches = async () => {
            try {
                const response = await axiosInstance.get(`/branches/?section=${section.id}`);
                setBranches(response.data.filter(branch => !branch.is_converted)); // Only show non-converted branches
            } catch (error) {
                console.error('Error fetching branches:', error.response ? error.response.data : error.message);
            }
        };
        fetchBranches();
    };
    
    // Handle finish button click (show confirmation modal)
    const handleFinish = () => {     
        setShowFinishModal(true);  // Show finish confirmation modal
    };

    // Handle confirm finish and navigate to home
    const handleConfirmFinish = () => {
        setShowFinishModal(false);
        navigate('/');  // Navigate to home page
    };

    return (
        <Container className="create-story-page">
            <h2 className="text-center mb-4">Create a Story</h2>
            {!storyId ? (
                <Form className="story-form">
                    <Form.Group controlId="storyName">
                        <Form.Label>Story Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={storyName}
                            onChange={(e) => setStoryName(e.target.value)}
                            required
                            className="input-field"
                        />
                    </Form.Group>
                    <Form.Group controlId="genre">
                        <Form.Label>Genre</Form.Label>
                        <Form.Control
                            type="text"
                            value={genre}
                            onChange={(e) => setGenre(e.target.value)}
                            required
                            className="input-field"
                        />
                    </Form.Group>
                    <Button onClick={handleStorySubmit} disabled={!storyName || !genre} className="submit-btn">
                        Start Story
                    </Button>
                </Form>      
            ) : (
                <>
                    {!sectionSubmitted ? (
                        <>
                            <h3 className="text-center mb-4">Add First Section</h3>
                            <Form className="section-form">
                                <Form.Group controlId="sectionName">
                                    <Form.Label>Section Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={sectionName}
                                        onChange={(e) => setSectionName(e.target.value)}
                                        required
                                        className="input-field"
                                    />
                                </Form.Group>
                                <Form.Group controlId="sectionWriting">
                                    <Form.Label>Section Writing</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={5}
                                        value={sectionWriting}
                                        onChange={(e) => setSectionWriting(e.target.value)}
                                        required
                                        className="input-field"
                                    />
                                </Form.Group>
                                <Button onClick={handleSectionSubmit} disabled={!sectionName || !sectionWriting} className="submit-btn">
                                    Submit Section
                                </Button>
                            </Form>
                        </>
                    ) : (
                        <>
                            {currentSection ? (
                                <>
                                    <h3 className="text-center mb-4">Add Branches</h3>
                                    <Button onClick={() => setShowBranchModal(true)} className="btn-primary">
                                        Add Branch
                                    </Button>
                                    
                                    <Button className="btn-secondary ml-2" onClick={handleNextSection}>
                                        Next
                                    </Button>

                                    <Button className="btn-primary ml-2" onClick={handleFinish}>
                                        Finish
                                    </Button>

                                    {/* Display Created Branches */}
                                    <h4 className="mt-4">Created Branches</h4>
                                    <ul className="branch-list">
                                        {branches.map((branch, index) => (
                                            <li key={index} className="branch-item">
                                                {branch.branch_number}: {branch.branch_option}
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            ) : (
                                <>
                                    <h4 className="text-center mb-4">Select a Section</h4>
                                    <div className="sections-list">
                                        {sections.map((section) => (
                                            <Button
                                                key={section.id}
                                                className="section-btn"
                                                onClick={() => handleSectionClick(section)}
                                            >    
                                                {section.section_number}: {section.section_name}
                                            </Button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </>
            )}

            <Container className="tutorial-container">
                <h4 className="text-center mb-4">Tutorial:</h4>
                <ul className="tutorial-list">
                    <li>Give Story Name and Genre.</li>
                    <li>Write the first section of your story.</li>
                    <li>Create branches for your sections or go to the next.</li>
                    <li>You can add branches to your previously created sections as well.</li>
                    <li>Pressing the Next button turns your branches into new sections.</li>
                    <li>If Section 1 has two branches, pressing Next will create two new sections,<br />Section 1.1 and Section 1.2</li>
                </ul>
            </Container>


            {/* Modal for Adding Branches */}
            <Modal show={showBranchModal} onHide={() => setShowBranchModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add Branch</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="branchName">
                            <Form.Label>Branch Option</Form.Label>
                            <Form.Control
                                type="text"
                                value={branchName}
                                onChange={(e) => setBranchName(e.target.value)}
                                required
                                className="input-field"
                            />
                        </Form.Group>
                        <Form.Group controlId="branchOutcome">
                            <Form.Label>Branch Outcome</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={branchOutcome}
                                onChange={(e) => setBranchOutcome(e.target.value)}
                                required
                                className="input-field"
                            />
                        </Form.Group>
                        <Button onClick={handleBranchSubmit} disabled={!branchName || !branchOutcome} className="submit-btn">
                            Add Branch
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Confirmation Modal for Branch Conversion */}
            <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Section Creation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5>The following branches will be converted into sections:</h5>
                    <ul>
                        {branchesToConvert.map((branch, index) => (
                            <li key={index}>
                                Branch {branch.branch_number}: {branch.branch_option}
                            </li>
                        ))}
                    </ul>
                    <p>Do you want to proceed?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleConfirmConvert}>
                        OK
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Finish Confirmation Modal */}
            <Modal show={showFinishModal} onHide={() => setShowFinishModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Finish</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to finish and return to the home page?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowFinishModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleConfirmFinish}>
                        Finish
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Success Toast */}
            <Toast
                show={showSuccessToast}
                onClose={() => setShowSuccessToast(false)}
                delay={3000}
                autohide
                bg="success"
                className="success-toast"
            >
                <Toast.Body>{toastMessage}</Toast.Body>
            </Toast>

            {/* Error Handling */}
            {error && <Alert variant="danger" className="error-alert">{error}</Alert>}
        </Container>
    );
};

export default CreateStoryPage;
