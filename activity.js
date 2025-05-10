// Import built-in 'https' module to make API requests
const https = require('https');
// Get GitHub username 
const username = process.argv[2];
// Check if username is provided
if (!username) {
    console.error('Please provide a GitHub username. Command: node activity.js <username>');
    process.exit(1);
}
// GitHub API endpoint to get recent public events of user
const url = `https://api.github.com/users/${username}/events`;
// HTTP request options required by GitHub API
const options = {
    headers: {
        'User-Agent': 'node.js', // GitHub API requires valid user-agent
        'Accept': 'application/vnd.github.v3+json' // Specifies version 3 of GitHub API
    }
};
// Send GET request to GitHub API
https.get(url, options, (response) => {
    let data = '';
    response.setEncoding('utf8'); // Ensure the data is UTF-8 encoded
    // Collect incoming data chunks
    response.on('data', chunk => {
        data += chunk;
    });
    // Data received
    response.on('end', () => {
        // Check if request was successful
        if (response.statusCode === 200) {
            let events;

            try {
                // Parse JSON response into JS
                events = JSON.parse(data);
            } catch (error) {
                console.error('Error parsing response:', error.message);
                return;
            }
            // User no recent activity
            if (events.length === 0) {
                console.log(`No recent activity found for ${username}`);
                return;
            }
            // Print user's recent GitHub activity
            console.log(`Recent activity for ${username}:`);
            events.forEach(event => {
                let action = '';
                // Match type of GitHub event to readable message
                switch (event.type) {
                    case 'PushEvent':
                        action = `Pushed ${event.payload.commits.length} commit(s) to ${event.repo.name}`;
                        break;
                    case 'IssuesEvent':
                        action = `${event.payload.action} an issue in ${event.repo.name}`;
                        break;
                    case 'IssueCommentEvent':
                        action = `Commented on an issue in ${event.repo.name}`;
                        break;
                    case 'WatchEvent':
                        action = `Starred ${event.repo.name}`;
                        break;
                    case 'ForkEvent':
                        action = `Forked ${event.repo.name}`;
                        break;
                    default:
                         // For all other events, use a generic message
                        action = `Performed ${event.type.replace(/Event$/, '')} in ${event.repo.name}`;
                }
                // Print formatted activity
                console.log(`- ${action}`);
            });
        } else if (response.statusCode === 404) {
            console.error('User not found. Please check username.'); // GitHub user not found
        } else if (response.statusCode === 403) {
            console.error('Rate limit exceeded. Try again later.'); // GitHub API rate limit exceeded(too many request are made)
        } else {
            console.error(`Failed to fetch data. HTTP status: ${response.statusCode}`); // Handle other unexpected HTTP status
        }
    });
}).on('error', error => {
    console.error('Error fetching GitHub activity:', error.message); // Handle network or request errors
});
