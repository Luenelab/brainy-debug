document.getElementById('submit').addEventListener('click', () => {
    const input = document.getElementById('input').value;
    localStorage.setItem('brainy-data', input);
    document.getElementById('output').innerText = input;
});

document.getElementById('sync').addEventListener('click', async () => {
    const data = localStorage.getItem('brainy-data');
    const response = await fetch('https://api.github.com/repos/Luenelab/brainy-debug/contents/brainy_brainfiles/Brainy-test.json', {
        method: 'PUT',
        headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: 'update brainy data',
            content: btoa(data),
            sha: ''  // Add the SHA of the existing file here if updating
        })
    });

    if (response.ok) {
        const result = await response.json();
        document.getElementById('output').innerText = 'Sync successful!';
    } else {
        document.getElementById('output').innerText = 'Sync failed!';
    }
});
