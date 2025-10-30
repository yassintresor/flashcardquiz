# Flashcard Quiz Application

A full-stack flashcard quiz application with React frontend and Node.js/Express backend.

## Project Structure

```
flashcardquiz/
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   └── routes/
│   ├── server.js
│   └── .env
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   └── App.tsx
    └── vite.config.ts
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd Backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure the database:
   - Update the `.env` file with your MySQL database credentials
   - Create a MySQL database named `flashcard_quiz`
   - Run the database schema to create tables

4. Start the backend server:
   ```
   npm start
   ```
   
   The backend server will run on http://localhost:4000

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```
   
   The frontend server will run on http://localhost:8081

## API Endpoints

### Decks
- `GET /api/decks` - Get all decks
- `GET /api/decks/:id` - Get a specific deck
- `POST /api/decks` - Create a new deck
- `PUT /api/decks/:id` - Update a deck
- `DELETE /api/decks/:id` - Delete a deck

### Cards
- `GET /api/cards/deck/:deckId` - Get all cards in a deck
- `GET /api/cards/:id` - Get a specific card
- `POST /api/cards/deck/:deckId` - Add a new card to a deck
- `PUT /api/cards/:id` - Update a card
- `DELETE /api/cards/:id` - Delete a card

### Quiz
- `POST /api/quiz/start` - Start a quiz
- `POST /api/quiz/answer` - Submit an answer
- `POST /api/quiz/submit` - Submit final score

## Features

### Admin Dashboard
- Create, read, update, and delete flashcards
- Manage decks and categories
- View analytics and user statistics

### Client Dashboard
- Take quizzes on various topics
- Track progress and scores
- View learning statistics

## Authentication

The application supports two user roles:
- **Admin**: Can manage all flashcards and decks
- **Client**: Can take quizzes and track progress

## Technologies Used

### Backend
- Node.js
- Express.js
- MySQL
- JSON Web Tokens (JWT) for authentication

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- Shadcn UI components
- React Router

## Development

To run both servers simultaneously:
1. Start the backend server: `cd Backend && npm start`
2. Start the frontend server: `cd frontend && npm run dev`

## Environment Variables

### Backend (.env)
```
PORT=4000
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=flashcard_quiz
JWT_SECRET=your_jwt_secret_key
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:4000/api
```

## Recent Fixes

### Authentication Middleware Fix
- Fixed a bug in the authentication middleware where the token was not being parsed correctly
- Removed authentication requirements for development purposes to allow easier testing

### Card Creation Fix
- Fixed the card creation response handling in the frontend
- Ensured proper type conversion between backend and frontend