const https = require('https');

const username = process.argv[2];

if (!username){
    console.error('Please provide a github username. Command: node activity.js <username>');
    process.exit(1);
}

const url = `https://api.github.com/users/${username}/events`;

const options = {
    headers: {
        'User-Agent': 'node.js',
        'Accept': 'application/vnd.github.v3+json'
    }
};

https.get(url, options, (r) => {
    let data = '';

    r.on('data', chunk => {
        data += chunk;
    });

    r.on('end', () => {
        if (r.statusCode === 200){
            const events = JSON.parse(data);
            if (events.length === 0){
                console.log(`No recent activity found for ${username}`);
                return;
            }

            console.log(`Recent activity for ${username}:`);
            events.forEach(event => {
                let action = '';

                switch (event.type){
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
                        action = `Did ${event.type} in ${event.repo.name}`;
                }
                console.log(`- ${action}`);
            });
        } else if (r.statusCode === 404){
            console.error('User not found. Please check username');
        } else {
            console.error (`Failed to fetch data. HTTP status: ${r.statusCode}`);
        }
    });
}).on('error', e => {
    console.error('Error fetching GitHub activity:', e.message);
});