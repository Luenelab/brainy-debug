// src/app.js
import React, { useState, useEffect } from 'react';

// App-Komponente
const App = () => {
    // Zustand für Eingabewert, Dateiinhalt und Feedback-Nachrichten
    const [inputValue, setInputValue] = useState('');
    const [fileContent, setFileContent] = useState([]);
    const [feedback, setFeedback] = useState('');

    // Token für GitHub API
    const token = process.env.GITHUB_TOKEN;

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
                const content = JSON.parse(atob(data.content));
                setFileContent(content); // Dateiinhalt im Zustand speichern
            } catch (error) {
                setFeedback(`Error fetching file: ${error.message}`); // Fehlerbehandlung
            }
        };

        fetchFileContent(); // Abrufen des Datei-Inhalts beim Laden der Komponente
    }, [token]); // Abhängigkeit: useEffect wird erneut ausgeführt, wenn sich das Token ändert

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

            // Aktualisieren der Datei auf GitHub
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
                setFeedback('File updated successfully!'); // Erfolgreiche Aktualisierung
                setFileContent(updatedContent); // Zustand mit dem neuen Inhalt aktualisieren
                setInputValue(''); // Eingabefeld leeren
            } else {
                setFeedback('Failed to update the file.'); // Fehler bei der Aktualisierung
            }
        } catch (error) {
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
