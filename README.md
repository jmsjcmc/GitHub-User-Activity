
# GitHub Activity Fetcher

A simple Node.js script to fetch and display recent public GitHub activity for a given username using the GitHub REST API.

## 🔧 Prerequisites

- [Node.js](https://nodejs.org/) installed (v12+ recommended)

## 📥 Installation

Clone the repository or copy the `activity.js` file into your project directory.

## 🚀 Usage

```bash
node activity.js <github-username>
```
**Example**:
```bash
node activity.js jmsjcmc
```
This will fetch and display the latest public GitHub activity for the user `jmsjcmc`.

---
## 🌐 GitHub API 
This script uses the **[GitHub REST API v3](https://docs.github.com/en/rest)** to retrieve public events for a user.

**Endpoint:**
```bash
GET https://api.github.com/users/:username/events
```
**Headers Required:**

 1. `User-Agent`: A custom user agent is required by GitHub's API.
 2. `Accept`: Specifies the response media type (we use `application/vnd.github.v3+json` for v3).
 
 **Notes:**
 
 3. Only public events are returned.
 4. The default limit is 30 events.
 5. This endpoint does not require authentication, but you may hit the **rate limit** quickly (60 requests per hour per IP for unauthenticated requests).
 ---
## 🛠️ Features
 6. Fetches recent GitHub activity
 7. Supports:
	 - Push events
	 - Issue activity
	 - Comments
	 - Stars
	 - Forks
 8. Handles:
	 - Missing usernames
	 - Invalid users
	 - Rate limits
	 - JSON parsing errors
---
## ⚠️ Rate Limiting
GitHub's unauthenticated API limit is **60 requests per hour** per IP. To increase the limit:
 1. Generate a [Personal Access Token](https://github.com/settings/tokens).
 2. Modify the script to include an `Authorization` header:
```json
'Authorization': 'token YOUR_PERSONAL_ACCESS_TOKEN'

```
---
## Project
