ChatWave - Real-Time Chat Application

ChatWave is a real-time chat application built using React, Node.js, Express, MongoDB, and Socket.IO.

The application allows users to log in with a username, send and receive messages in real time, see online users, view typing indicators, and track message delivery and read status.

Features

- Username-based login
- User profile photos
- Real-time messaging using Socket.IO
- Persistent messages using MongoDB
- Message history
- Message timestamps
- Online/offline user status
- Last seen information
- Real-time typing indicator
- Delivered message status
- Read message status
- Online users list
- Responsive chat interface
- REST API for messages and authentication
- Default profile/group avatar
- Logout functionality

Tech Stack

Frontend

- React
- Vite
- Axios
- Socket.IO Client
- Lucide React
- CSS

Backend

- Node.js
- Express.js
- Socket.IO
- MongoDB
- Mongoose
- Multer

Project Structure

chat-app/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   │   ├── User.js
│   │   └── Message.js
│   ├── routes/
│   ├── services/
│   ├── socket/
│   │   └── socket.js
│   ├── uploads/
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Login.jsx
    │   │   ├── ChatHeader.jsx
    │   │   ├── MessageList.jsx
    │   │   ├── MessageInput.jsx
    │   │   ├── MessageBubble.jsx
    │   │   ├── TypingIndicator.jsx
    │   │   └── UserStatus.jsx
    │   │
    │   ├── services/
    │   │   ├── api.js
    │   │   └── socket.js
    │   │
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    │
    ├── package.json
    └── .env

Requirements

Before running the project, install:

- Node.js
- MongoDB
- npm
- A modern web browser

MongoDB Setup

The application uses MongoDB for storing users and messages.

Default local MongoDB database:

mongodb://127.0.0.1:27017/realtime_chat

Make sure MongoDB is running before starting the backend.

On Windows, MongoDB can be started using the MongoDB executable.

Backend Setup

Open a terminal inside the backend folder:

cd backend
npm install

Create a ".env" file:

PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/realtime_chat
CLIENT_URL=http://localhost:5173

Start the backend:

npm run dev

The backend will run at:

http://localhost:5000

Frontend Setup

Open another terminal inside the frontend folder:

cd frontend
npm install

Create a ".env" file:

VITE_API_URL=http://localhost:5000

Start the frontend:

npm run dev

The frontend will normally run at:

http://localhost:5173

How the Application Works

1. Login

The user enters a username and logs into the application.

The logged-in user is stored in localStorage so the session can remain available after refreshing the page.

2. Joining the Chat

After login, the frontend connects to the Socket.IO server and sends the user's ID.

The backend marks the user as online and broadcasts the updated users list.

3. Sending Messages

Messages are sent through the REST API and then delivered to connected users using Socket.IO.

Messages are stored in MongoDB so that previous conversations remain available after refreshing the application.

4. Typing Indicator

When a user starts typing, the frontend sends:

typing_start

The Socket.IO server broadcasts:

user_typing

When the user stops typing, the frontend sends:

typing_stop

The server broadcasts:

user_stopped_typing

The other user then sees:

Username is typing...

5. Online Users

When a user connects, their status is changed to online.

When the user disconnects, the backend changes their status to offline and records their last seen time.

6. Message Delivery Status

When a user comes online, undelivered messages are marked as delivered for that user.

The application updates the message status in real time.

7. Message Read Status

When messages are viewed, the frontend sends the message IDs to the server.

The backend updates the "readBy" information and broadcasts the updated message status.

REST API

Authentication

POST /api/auth/login

Used for logging in with a username.

Messages

GET /api/messages

Used to retrieve message history.

POST /api/messages

Used to send a new message.

Socket.IO Events

Client to Server

join
typing_start
typing_stop
messages_read

Server to Client

users_update
new_message
user_typing
user_stopped_typing
message_status

Environment Variables

Backend

PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/realtime_chat
CLIENT_URL=http://localhost:5173

Frontend

VITE_API_URL=http://localhost:5000

Do not commit sensitive environment variables or secrets to GitHub.

Design Decisions

React

React was used to create reusable components and manage the application state.

Socket.IO

Socket.IO was used for real-time communication such as:

- New messages
- Typing indicators
- Online users
- User status
- Message delivery
- Message read status

MongoDB

MongoDB was selected for persistent storage of users and messages.

Component-Based UI

The interface is divided into smaller components such as:

- Login
- Chat Header
- Message List
- Message Bubble
- Message Input
- Typing Indicator
- User Status

This keeps the application easier to maintain and modify.

Testing

The real-time features can be tested by opening the application in two browser windows or using two different browser sessions.

Test 1 - Login

Log in with two different usernames.

Test 2 - Messaging

Send a message from one user and verify that it appears for the other user in real time.

Test 3 - Typing Indicator

Start typing from one user without sending the message.

The other user should see:

Username is typing...

Test 4 - Online Status

Open two sessions and verify that both users appear online.

Close one session and verify that the user's status changes to offline.

Test 5 - Message History

Refresh the application and verify that previous messages are still available.

Test 6 - Delivery and Read Status

Send a message while another user is connected and verify that delivery/read status updates correctly.

Error Handling

The application includes error handling for:

- Failed API requests
- Invalid users
- Socket connection problems
- Missing users
- Invalid message data
- MongoDB errors
- Image loading errors

Assumptions

- The application is intended for a single global chat room.
- Users are identified using usernames.
- MongoDB is running locally during development.
- Socket.IO is responsible for real-time events.
- Authentication is designed for the assignment/demo environment rather than production-level authentication.
- Profile images may be unavailable, so a default avatar is used.

Future Improvements

Possible future improvements include:

- Private one-to-one conversations
- Group chat creation
- Image and file messages
- Emoji picker
- Message editing
- Message deletion
- Stronger authentication
- Password-based accounts
- Notifications
- Search functionality
- Deployment with a cloud MongoDB database

Author

Sameer Bisayati

BCA 3rd Year Student

Submission Checklist

- [x] React frontend
- [x] Node.js/Express backend
- [x] MongoDB database
- [x] Socket.IO real-time communication
- [x] Login
- [x] Real-time messaging
- [x] Message history
- [x] Online/offline status
- [x] Typing indicator
- [x] Message delivery status
- [x] Message read status
- [x] Responsive UI
- [x] README documentation

Running the Project

Start MongoDB first.

Then start the backend:

cd backend
npm run dev

In another terminal, start the frontend:

cd frontend
npm run dev

Open the frontend URL shown by Vite in the browser.

The application is now ready to use.
