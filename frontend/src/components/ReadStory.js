import React, { useState, useEffect } from 'react';
import axiosInstance from './axiosInstance';
import { Button, Form, Container, Modal, Alert, Card, Row, Col } from 'react-bootstrap'; // Import Bootstrap components
import './ReadStory.css'; // Import the CSS for styling

const ReadStory = () => {
  const [stories, setStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null); // Store the selected story
  const [currentSection, setCurrentSection] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [branches, setBranches] = useState([]);
  const [error, setError] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);

  // Fetch all stories
  useEffect(() => {
    axiosInstance.get('stories/')
      .then(response => setStories(response.data))
      .catch(err => console.error(err));
  }, []);

  const handleStoryClick = (storyId) => {
    // Fetch the first section (section_number 1)
    axiosInstance.get(`sections/?story_id=${storyId}&section_number=1`)
      .then(response => {
        if (response.data.length > 0) {
          setCurrentSection(response.data[0]);
          fetchBranches(response.data[0].id); // Fetch branches for section 1
          setSelectedStory(storyId);
        } else {
          setError("No section found for this story.");
          setShowErrorModal(true);
        }
      })
      .catch(err => console.error(err));
  };

  const fetchBranches = (sectionId) => {
    // Fetch branches for the selected section
    axiosInstance.get(`branches/?section=${sectionId}`)
      .then(response => setBranches(response.data))
      .catch(err => console.error(err));
  };

  const handleBranchSubmit = () => {
    if (!selectedBranch) return;

    const selectedBranchData = branches.find(branch => branch.id === selectedBranch);

    const nextSectionNumber = `${currentSection.section_number}.${selectedBranchData.branch_number}`;

    // Try to fetch the next section based on the branch
    axiosInstance.get(`sections/?story_id=${selectedStory}&section_number=${nextSectionNumber}`)
      .then(response => {
        const nextSection = response.data.find(section => 
          section.story === selectedStory && section.section_number === nextSectionNumber
        );

        if (nextSection) {
          setCurrentSection(nextSection);
          fetchBranches(nextSection.id);
          setError("");
        } else {
          setError("The writer didn't continue the story from this branch.");
          setShowErrorModal(true);
        }
      })
      .catch(err => console.error('Error fetching next section:', err));

    // Patch request to increment the is_clicked field for the selected branch
    axiosInstance.patch(`branches/${selectedBranchData.id}/`, { is_clicked: 1 })
      .then(() => console.log('Branch click count updated'))
      .catch(err => console.error('Error updating branch click count:', err));
  };

  return (
    <Container className="mt-4">
      {/* Story Listing */}
      {!selectedStory && (
        <>
          <h1 className="text-center mb-4">All Stories</h1>

          {stories.length === 0 ? (
            <p className="text-center">Loading stories...</p>
          ) : (
            <ul className="list-group">
              {stories.map((story) => (
                <li
                  key={story.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <span>{story.story_name} - {story.user}</span>
                  <Button variant="primary" onClick={() => handleStoryClick(story.id)}>
                    Start Story
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {/* Story Reading */}
      {selectedStory && currentSection && (
        <div className="mt-4">
          <Row className="mb-4">
            <Col md={6} className="mb-3">
              <Card className="section-card">
                <Card.Body>
                  <Card.Title className="text-center">{currentSection.section_name}</Card.Title>
                  <Card.Subtitle className="text-center mb-2 text-muted">
                    Section {currentSection.section_number}
                  </Card.Subtitle>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="section-card">
                <Card.Body>
                  <Card.Text>{currentSection.section_writing}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Form>
            <h3 className="mb-3">Choose a Branch:</h3>
            {branches.length === 0 ? (
              <p>The writer didn't write any branches from here on out. This means your choices have led to the end of the story.</p>
            ) : (
              branches.map((branch) => (
                <Form.Check
                  key={branch.id}
                  type="radio"
                  label={`${branch.branch_option} (Branch ${branch.branch_number})`}
                  name="branch"
                  value={branch.id}
                  checked={selectedBranch === branch.id}
                  onChange={() => setSelectedBranch(branch.id)}
                />
              ))
            )}
          </Form>

          <Button variant="success" className="mt-3" onClick={handleBranchSubmit}>
            Submit
          </Button>

          {error && <Alert variant="danger" className="mt-2">{error}</Alert>}
        </div>
      )}

      {/* Error Modal */}
      <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{error}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowErrorModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ReadStory;
