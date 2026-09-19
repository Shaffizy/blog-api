# Blog API

A simple REST API for a blog, built with Express and MySQL.

## Setup

1. Clone the repo
2. Run `npm install`
3. Create a `.env` file with `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `PORT`
4. Run the SQL schema (see `schema.sql`) to create `users` and `posts` tables
5. Run `npm run dev`

## Endpoints

| Method | Endpoint   | Description                         |
| ------ | ---------- | ----------------------------------- |
| POST   | /users     | Register a new user                 |
| POST   | /posts     | Create a post                       |
| GET    | /posts     | List posts (paginated, with author) |
| GET    | /posts/:id | Get one post                        |
| PATCH  | /posts/:id | Update a post                       |
| DELETE | /posts/:id | Delete a post                       |
