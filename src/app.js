// src/app.js
import React, { useState, useEffect } from 'react';

const App = () => {
  const [inputValue, setInputValue] = useState('');
  const [fileContent, setFileContent] = useState([]);
  const [feedback, setFeedback] = useState('');

  const token = process.env.GITHUB_TOKEN;

  const fetchFileContent = async () => {
    try {
      const response = await fetch('https://api.github.com/repos/Luenelab/brainy-debug/contents/brainy_brainfiles/Brainy-test.json', {
        headers: {
          Authorization: `token ${token}`
        }
      });
      const data = await response.json();
      const content = JSON.parse(atob(data.content));
      setFileContent(content);
    } catch (error) {
      setFeedback(`Error fetching file: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchFileContent();
  }, []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('https://api.github.com/repos/Luenelab/brainy-debug/contents/brainy_brainfiles/Brainy-test.json', {
        headers: {
          Authorization: `token ${token}`
        }
      });
      const data = await response.json();
      const content = JSON.parse(atob(data.content));
      const updatedContent = [...content, inputValue];

      const updateResponse = await fetch('https://api.github.com/repos/Luenelab/brainy-debug/contents/brainy_brainfiles/Brainy-test.json', {
        method: 'PUT',
        headers: {
          Authorization: `token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: 'Update Brainy-test.json',
          content: btoa(JSON.stringify(updatedContent)),
          sha: data.sha
        })
      });

      if (updateResponse.ok) {
        setFeedback('File updated successfully!');
        setFileContent(updatedContent);
      } else {
        setFeedback('Failed to update the file.');
      }
    } catch (error) {
      setFeedback(`Error updating file: ${error.message}`);
    }
  };

  return (
    <div>
      <h1>Brainy Test App</h1>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
      />
      <button onClick={handleSubmit}>Submit</button>
      <div>
        <h2>File Content:</h2>
        <pre>{JSON.stringify(fileContent, null, 2)}</pre>
      </div>
      {feedback && <p>{feedback}</p>}
    </div>
  );
};

export default App;
