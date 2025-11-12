# Real-Time Private Chat App

The application implements real-time private communication between users based on Socket.IO, with support for:

- user registration and authentication;
- message history storage on the server (MongoDB);
- instant status updates (online / offline);
- mobile and desktop device adaptation;
- light and dark interface themes.

---

## How to Try

### Demo

🔗 **[https://chat-app-3208.vercel.app](https://chat-app-3208.vercel.app)**

### Test Users

**Recommended:** Use Ryan Carter for the best experience with existing chat history.

```
nickname: Ryan Carter
email:    ryan.carter@gmail.com
password: password33
```

---

**Additional users** for testing real-time messaging (open multiple tabs in different browsers or normal/incognito mode):

```
nickname: Ethan Brooks
email:    ethan.brooks@gmail.com
password: password33
```

```
nickname: Michael Turner
email:    michael.turner@gmail.com
password: password33
```

**Note:** You can create a new user, but chats are not yet activated for new accounts, so message history will be empty.

---

## Technology Stack

Modern Fullstack TypeScript / React / Node.js / MongoDB / Socket.IO stack.

| Category | Technologies | Purpose |
|----------|-------------|---------|
| Frontend | React, TypeScript, Vite | Fast build and type-safe development |
| UI / UX | SCSS Modules, classnames, lucide-react | Modular styles, BEM naming, icons |
| Forms | Formik, Yup | Form management and data validation |
| API | Axios | Interaction with server REST API |
| Real-time | socket.io-client | Message exchange via WebSocket |
| Backend | Node.js, Express, Socket.IO | API and WebSocket server |
| Database | MongoDB, Mongoose | User and message storage |
| Authentication | jsonwebtoken, bcryptjs, cookie-parser | JWT and secure password storage |
| Middleware | express-validator, cors, dotenv | Data validation and environment configuration |
| Development Tools | nodemon, eslint, prettier | Automation and code style consistency |

---

## How It Works

### 1. Authentication

- User enters login credentials.
- Server verifies email and password, hashes the password using bcrypt, creates a JWT token and saves it in a cookie.
- All requests to protected routes pass through middleware that validates the token.

### 2. Socket.IO Connection

- After authentication, the client establishes a connection with the WebSocket server, passing the token.
- Each user receives a unique identifier, and their socket joins a room (`socket.join(user._id)`).

### 3. Sending Messages

Client sends a message:

```javascript
socket.emit("private message", { content, to });
```

Server saves it in MongoDB and forwards it to the recipient:

```javascript
socket.to(to).emit("private message", { content, from: socket.userID });
```

### 4. Message History

- When loading a chat, the client requests message history from the database.
- This allows restoring the conversation after a page reload.

### 5. User Status

Server tracks connections and disconnections:

```javascript
socket.broadcast.emit("user connected", user);  
socket.broadcast.emit("user disconnected", user._id);
```

Client updates the user list in real-time.

### 6. Interface

- Built using React and SCSS modules.
- Supports responsive design, theme switching, and smooth animations.
