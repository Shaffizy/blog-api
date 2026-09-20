# Blog API

A REST API for a simple blog, built with Express and MySQL, deployed on Render with a MySQL database hosted on Aiven.

**Live URL:** https://blog-api-7k9c.onrender.com

> Note: hosted on Render's free tier — the server sleeps after 15 minutes of inactivity. The first request after idling may take 30–50 seconds to respond while it wakes up.

## Tech Stack

- Node.js + Express
- MySQL (hosted on Aiven)
- Deployed on Render

## Data Model

**users**
| Field | Type | Notes |
|------------|--------------|-------------------|
| id | INT | Primary key |
| username | VARCHAR(50) | Unique |
| email | VARCHAR(100) | Unique |
| password | VARCHAR(255) | Plain text for now — hashing planned |
| created_at | TIMESTAMP | Auto-set |

**posts**
| Field | Type | Notes |
|------------|-----------|----------------------------------|
| id | INT | Primary key |
| user_id | INT | Foreign key → users.id |
| title | VARCHAR(200) | |
| content | TEXT | |
| created_at | TIMESTAMP | Auto-set |

## Endpoints

### `POST /users`

Register a new user.

**Body:**

```json
{ "username": "jane", "email": "jane@test.com", "password": "1234" }
```

**Response — 201:**

```json
{ "id": 16, "username": "jane", "email": "jane@test.com" }
```

**Response — 400:** missing fields or invalid email.

---

### `POST /posts`

Create a post for an existing user.

**Body:**

```json
{ "user_id": 1, "title": "My Post", "content": "Hello world" }
```

**Response — 201:**

```json
{ "id": 54, "user_id": 1, "title": "My Post", "content": "Hello world" }
```

**Response — 400:** missing fields.

---

### `GET /posts`

List posts, newest first, with the author's username joined in.

**Query params:**
| Param | Type | Default | Description |
|-------|------|---------|----------------------|
| page | int | 1 | Page number |
| limit | int | 10 | Results per page |

**Example:** `GET /posts?page=1&limit=5`

**Response — 200:**

```json
{
  "page": 1,
  "limit": 5,
  "results": [
    {
      "id": 53,
      "title": "...",
      "content": "...",
      "created_at": "...",
      "username": "..."
    }
  ]
}
```

---

### `GET /posts/:id`

Get a single post by ID, with author's username.

**Response — 200:** same shape as one item in `/posts` results.
**Response — 404:** `{ "error": "Post not found" }`

---

### `PATCH /posts/:id`

Update a post's title and/or content.

**Body (either or both fields):**

```json
{ "title": "Updated title" }
```

**Response — 200:** `{ "message": "Post updated" }`

---

### `DELETE /posts/:id`

Delete a post.

**Response — 200:** `{ "message": "Post deleted" }`

## Running Locally

1. Clone the repo
2. `npm install`
3. Create a `.env` file:
