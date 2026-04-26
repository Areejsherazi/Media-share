# Photo Sharing API

Backend for a photo-sharing application with JWT authentication, role-based access, Cloudinary media storage, and MongoDB Atlas persistence.

## Features

- JWT auth with `creator` and `consumer` roles
- Creator image upload with Cloudinary storage
- Paginated image feed
- Comments and star ratings
- Search by title or caption
- Optional Redis caching for feeds and search
- Docker support for containerized deployment
- Image optimization on upload with `sharp`

## Tech Stack

- Node.js
- Express
- MongoDB Atlas with Mongoose
- Cloudinary
- JWT
- Redis (optional)

## Project Structure

```text
src/
  config/
  controllers/
  middleware/
  models/
  routes/
  services/
  utils/
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy the example environment file and update it:

```bash
cp .env.example .env
```

3. Start the development server:

```bash
npm run dev
```

## Environment Variables

| Variable | Description |
| --- | --- |
| `PORT` | Server port |
| `NODE_ENV` | Environment name |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret used to sign JWTs |
| `JWT_EXPIRES_IN` | Token expiry, e.g. `7d` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `CLOUDINARY_FOLDER` | Folder name for uploaded images |
| `REDIS_URL` | Optional Redis connection URL |
| `CORS_ORIGIN` | Allowed frontend origin(s), comma-separated |

## API Endpoints

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`

### Images

- `POST /api/images/upload` - creator only
- `GET /api/images`
- `GET /api/images/:id`
- `POST /api/images/:id/comments` - consumer only
- `POST /api/images/:id/rate` - consumer only

### Search

- `GET /api/search?q=mountain`

## Sample Requests

### Signup

```http
POST /api/auth/signup
Content-Type: application/json

{
  "username": "ali.photography",
  "email": "ali@example.com",
  "password": "secret123",
  "role": "creator"
}
```

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "ali@example.com",
  "password": "secret123"
}
```

### Upload Image

Send `multipart/form-data` with:

- `image` - file
- `title` - string
- `caption` - string
- `location` - string
- `people` - comma-separated names or repeated fields

Include:

```http
Authorization: Bearer <token>
```

## Docker

Build and run with:

```bash
docker build -t photo-sharing-api .
docker run --env-file .env -p 5000:5000 photo-sharing-api
```

## Notes

- This API is stateless and ready to sit behind a frontend or API gateway.
- Redis caching is optional. If `REDIS_URL` is not provided, the API still works normally.
- Uploaded images are resized and compressed before being sent to Cloudinary.
