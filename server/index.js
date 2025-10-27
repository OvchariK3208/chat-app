import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import { createServer } from 'node:http'
import { Server } from 'socket.io'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const env = process.env.NODE_ENV || 'development'
const envFile = `.env.${env}`

dotenv.config({ path: path.resolve(__dirname, envFile) })

console.log(`✅ Loaded environment: ${env}`)
console.log(`🌐 PORT: ${process.env.PORT}`)
console.log(`🧩 MONGODB_CONNECTION: ${process.env.MONGODB_CONNECTION}`)
console.log(`🔗 CLIENT_URL: ${process.env.CLIENT_URL}`)

import userRoute from './routes/userRoute.js'
import chatRoute from './routes/chatRoute.js'
import messageRoute from './routes/messageRoute.js'
import errorMiddleware from './middlewares/errorMiddleware.js'
import MessageModel from './models/messageModel.js'

const app = express()

const PORT = process.env.PORT || 3000
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'
const MONGODB_CONNECTION = process.env.MONGODB_CONNECTION

app.use(express.json())
app.use(cookieParser())
app.use(cors({ credentials: true, origin: CLIENT_URL }))

app.use('/api/users', userRoute)
app.use('/api/chats', chatRoute)
app.use('/api/messages', messageRoute)
app.use(errorMiddleware)

const server = createServer(app)
const io = new Server(server, {
	cors: { origin: CLIENT_URL, methods: ['GET', 'POST'] },
})

let onlineUsers = [
	{ userId: '68f1762527a00c44fa83cb95', socketId: '0TKh7Q5eXPrLy3tDAAAF' },
	{ userId: '68f1768427a00c44fa83cbbc', socketId: 'qeJGqhrx9jz7XB9bAACL' }
]

io.on('connection', (socket) => {
	console.log(`🟢 User connected: ${socket.id}`)
	console.table(onlineUsers)

	socket.on('addNewUser', (userId) => {
		if (!onlineUsers.some((u) => u.userId === userId)) {
			onlineUsers.push({ userId, socketId: socket.id })
			console.log(`➕ Added user: ${userId}`)
		}
		io.emit('getOnlineUsers', onlineUsers)
	})

	socket.on('joinChat', ({ chatId }) => {
		if (chatId) {
			socket.join(chatId)
			console.log(`🟩 ${socket.id} joined chat ${chatId}`)
		}
	})

	socket.on('leaveChat', ({ chatId }) => {
		if (chatId) {
			socket.leave(chatId)
			console.log(`🟥 ${socket.id} left chat ${chatId}`)
		}
	})

	socket.on('typing', ({ chatId, senderId }) => {
		if (chatId && senderId) {
			socket.to(chatId).emit('typing', { chatId, senderId })
			console.log(`✏️ typing: ${senderId} in chat ${chatId}`)
		}
	})

	socket.on('stoppedTyping', ({ chatId, senderId }) => {
		if (chatId && senderId) {
			socket.to(chatId).emit('stoppedTyping', { chatId, senderId })
			console.log(`🚫 stoppedTyping: ${senderId} in chat ${chatId}`)
		}
	})

	socket.on('markAsRead', async ({ chatId, userId }) => {
		try {
			await MessageModel.updateMany(
				{ chatId, senderId: { $ne: userId }, isRead: false },
				{ $set: { isRead: true } }
			)
			io.to(chatId).emit('messagesRead', { chatId, userId })
			console.log(`📩 messages marked as read in chat ${chatId}`)
		} catch (err) {
			console.error(`❌ markAsRead error: ${err.message}`)
		}
	})

	socket.on('disconnect', () => {
		onlineUsers = onlineUsers.filter((u) => u.socketId !== socket.id)
		io.emit('getOnlineUsers', onlineUsers)
		console.log(`🔴 User disconnected: ${socket.id}`)
	})
})

async function startServer() {
	try {
		await mongoose.connect(MONGODB_CONNECTION)
		console.log('📦 MongoDB connected')

		server.listen(PORT, () => {
			console.log(`🚀 Server running on port ${PORT}`)
		})
	} catch (error) {
		console.error('⏹️ Failed to connect to MongoDB:', error)
		process.exit(1)
	}
}

startServer()