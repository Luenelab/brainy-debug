// src/app.js
import React, { useState, useEffect } from 'react';

// App-Komponente
/**
 * App component for the Brainy Test App.
 *
 * @returns {JSX.Element} The rendered App component.
 */
const App = () => {
    // Zustand für Eingabewert, Dateiinhalt und Feedback-Nachrichten
    const [inputValue, setInputValue] = useState('');
    const [fileContent, setFileContent] = useState([]);
    const [feedback, setFeedback] = useState('');

    // Token für GitHub API
    const token = process.env.REACT_APP_GITHUB_TOKEN;


    // useEffect-Hook zum Abrufen des Datei-Inhalts beim Laden der Komponente
    // useEffect-Hook zum Abrufen des Datei-Inhalts beim Laden der Komponente
    useEffect(() => {
        const fetchFileContent = async () => {
            try {
                // Abrufen des Datei-Inhalts von GitHub
                const response = await fetch('https://api.github.com/repos/Luenelab/brainy-debug/contents/brainy_brainfiles/Brainy-test.json', {
                    headers: {
                        Authorization: `token ${token}`
                    }
                });
                const data = await response.json();

                // Debugging: Log raw base64 content
                console.log('Raw base64 content:', data.content);

                const content = atob(data.content);

                // Debugging: Log decoded content
                console.log('Decoded content:', content);

                setFileContent(JSON.parse(content));

            } catch (error) {
                setFeedback(`Error fetching file: ${error.message}`); // Fehlerbehandlung
            }
        };

        // Check if the token is available
        if (token) {
            // If the token is available, fetch the file content
            fetchFileContent();
        } else {
            // If the token is not available, set feedback message
            setFeedback('GitHub token is not set');
        }
    }; // Add closing bracket here
    // Dependency array for useEffect, re-run when token changes
    // Funktion zum Handhaben des Formular-Submit
    const handleSubmit = async () => {
        try {
            // Neues Content-Array erstellen, das den aktuellen Inhalt und den Eingabewert enthält
            const updatedContent = [...fileContent, inputValue];

            // Abrufen der Datei von GitHub
            const response = await fetch('https://api.github.com/repos/Luenelab/brainy-debug/contents/brainy_brainfiles/Brainy-test.json', {
                headers: {
                    Authorization: `token ${token}`
                }
            });
            const data = await response.json();
            console.log('Submit fetched data:', data); // Debugging log

            // Aktualisieren der Datei auf GitHub
            const updateResponse = await fetch('https://api.github.com/repos/Luenelab/brainy-debug/contents/brainy_brainfiles/Brainy-test.json', {
                method: 'PUT',
                headers: {
                    Authorization: `token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: 'Update Brainy-test.json',
                    content: btoa(JSON.stringify(updatedContent)), // Encode content in base64
                    sha: data.sha
                })
            });

            if (updateResponse.ok) {
                setFeedback('File updated successfully!'); // Erfolgreiche Aktualisierung
                setFileContent(updatedContent); // Zustand mit dem neuen Inhalt aktualisieren
                setInputValue(''); // Eingabefeld leeren
            } else {
                const errorResponse = await updateResponse.json();
                console.error('Update failed:', errorResponse); // Debugging log
                setFeedback(`Failed to update the file: ${errorResponse.message}`);
            }
        } catch (error) {
            console.error('Error updating file:', error); // Debugging log
            setFeedback(`Error updating file: ${error.message}`); // Fehlerbehandlung
        }
    };

    // Funktion zum Handhaben von Eingabeänderungen
    const handleInputChange = (e) => {
        setInputValue(e.target.value); // Eingabewert im Zustand speichern
    };

    return (
        <div>
            <h1>Brainy Test App</h1>
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange} // Eingabewert aktualisieren
            />
            <button onClick={handleSubmit}>Submit</button>
            <div>
                <h2>File Content:</h2>
                <pre>{JSON.stringify(fileContent, null, 2)}</pre> {/* Dateiinhalt anzeigen */}
            </div>
            {feedback && <p>{feedback}</p>} {/* Feedback-Nachricht anzeigen */}
        </div>
    );
};

export default App;
