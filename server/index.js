require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { createServer } = require("node:http");
const { Server } = require("socket.io");

const userRoute = require("./routes/userRoute");
const chatRoute = require("./routes/chatRoute");
const messageRoute = require("./routes/messageRoute");
const errorMiddleware = require("./middlewares/errorMiddleware");
const MessageModel = require("./models/messageModel");

const app = express();

const MONGODB_CONNECTION = process.env.MONGODB_CONNECTION;
const PORT = process.env.PORT || 3000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		credentials: true,
		origin: CLIENT_URL,
	})
);

app.use("/api/users", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);
app.use(errorMiddleware);

app.get("/", (req, res) => {
	res.send(`Welcome ${PORT}`)
})

const server = createServer(app);
const io = new Server(server, {
	cors: {
		origin: CLIENT_URL,
		methods: ["GET", "POST"],
	},
});

let onlineUsers = [
	{
		userId: '68f1762527a00c44fa83cb95',
		socketId: '0TKh7Q5eXPrLy3tDAAAF'
	},
	{
		userId: '68f1753027a00c44fa83cb81',
		socketId: '9iO0rXe-mn4fFon4AAAH'
	},
];

io.on("connection", (socket) => {
	console.log(`✅ User connected: ${socket.id}`);
	console.log(onlineUsers)
	
	socket.on("addNewUser", (userId) => {
		if (!onlineUsers.some((u) => u.userId === userId)) {
			onlineUsers.push({ userId, socketId: socket.id });
			console.log(`➕ User ${userId} added to online list`);
		}
		io.emit("getOnlineUsers", onlineUsers);
	});

	socket.on("joinChat", ({ chatId }) => {
		if (chatId) {
			socket.join(chatId);
			console.log(`🟩 ${socket.id} joined chat ${chatId}`);
		}
	});

	socket.on("leaveChat", ({ chatId }) => {
		if (chatId) {
			socket.leave(chatId);
			console.log(`🟥 ${socket.id} left chat ${chatId}`);
		}
	});

	socket.on("typing", ({ chatId, senderId }) => {
		if (chatId && senderId) {
			socket.to(chatId).emit("typing", { chatId, senderId });
			console.log(`✏️ typing: user ${senderId} in chat ${chatId}`);
		}
	});

	socket.on("stoppedTyping", ({ chatId, senderId }) => {
		if (chatId && senderId) {
			socket.to(chatId).emit("stoppedTyping", { chatId, senderId });
			console.log(`🚫 stoppedTyping: user ${senderId} in chat ${chatId}`);
		}
	});

	socket.on("markAsRead", async ({ chatId, userId }) => {
		try {
			await MessageModel.updateMany(
				{ chatId, senderId: { $ne: userId }, isRead: false },
				{ $set: { isRead: true } }
			);
			io.to(chatId).emit("messagesRead", { chatId, userId });
			console.log(`📩 messages marked as read in chat ${chatId}`);
		} catch (err) {
			console.error("❌ markAsRead error:", err.message);
		}
	});

	socket.on("disconnect", () => {
		onlineUsers = onlineUsers.filter((u) => u.socketId !== socket.id);
		io.emit("getOnlineUsers", onlineUsers);
		console.log(`❎ User disconnected: ${socket.id}`);
	});
});

async function startServer() {
	try {
		await mongoose.connect(MONGODB_CONNECTION);
		console.log("▶️ MongoDB connected");

		server.listen(PORT, () => {
			console.log(`🚀 Server running on port ${PORT}`);
		});
	} catch (error) {
		console.error("⏹️ Failed to connect to MongoDB:", error);
		process.exit(1);
	}
}

startServer();