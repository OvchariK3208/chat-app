import React, { createContext, useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import type { IChat } from '@/models/IChat'
import type { IMessage } from '@/models/IMessage'
import type { IUser } from '@/models/IUser'
import ChatService from '@/services/ChatService'
import MessageService from '@/services/MessageService'
import UserService from '@/services/UserService'
import { socket } from '@/socket'

interface ChatContextProps {
	userChats: IChat[] | null
	isLoading: boolean
	userChatsError: string | null
	currentChat: IChat | null
	updateCurrentChat: (chat: IChat | null) => void
	messages: IMessage[] | null
	getMessages: (id: string) => Promise<void>
	sendMessage: (
		content: string,
		senderId: string,
		chatId: string,
		setTextMessage: (value: string) => void
	) => Promise<void>
	onlineUsers: IUser[]
	recipientUser: IUser | null
	resetRecipientUser: () => void
	typingUsers: string[]
}

interface ChatProviderProps {
	children: React.ReactNode
	user: IUser | null
}

export const ChatContext = createContext<ChatContextProps | undefined>(
	undefined
)

export const ChatProvider: React.FC<ChatProviderProps> = ({
	children,
	user,
}) => {
	const [userChats, setUserChats] = useState<IChat[] | null>(null)
	const [isLoading, setIsLoading] = useState(false)
	const [userChatsError, setUserChatsError] = useState<string | null>(null)

	const [currentChat, setCurrentChat] = useState<IChat | null>(null)
	const [messages, setMessages] = useState<IMessage[] | null>(null)
	const [newMessage, setNewMessage] = useState<IMessage | null>(null)

	const [onlineUsers, setOnlineUsers] = useState<IUser[]>([])
	const [recipientUser, setRecipientUser] = useState<IUser | null>(null)
	const [typingUsers, setTypingUsers] = useState<string[]>([])

	const updateCurrentChat = useCallback((chat: IChat | null): void => {
		setCurrentChat(chat)
	}, [])

	const resetRecipientUser = useCallback((): void => {
		setCurrentChat(null)
		setRecipientUser(null)
		setMessages(null)
	}, [])

	const getUserChats = useCallback(async (): Promise<void> => {
		if (!user?._id) return
		try {
			setIsLoading(true)
			const response = await ChatService.getUserChats(user._id)
			setUserChats(response.data)
		} catch (e: unknown) {
			if (axios.isAxiosError(e)) {
				setUserChatsError(e.response?.data?.message ?? 'Failed to load chats')
			}
		} finally {
			setIsLoading(false)
		}
	}, [user?._id])

	const getMessages = async (chatId: string): Promise<void> => {
		try {
			setIsLoading(true)
			const response = await MessageService.getMessages(chatId)
			setMessages(response.data)
		} catch (e: unknown) {
			if (axios.isAxiosError(e)) {
				// можно добавить уведомление
			}
		} finally {
			setIsLoading(false)
		}
	}

	const sendMessage = useCallback(
		async (
			content: string,
			senderId: string,
			chatId: string,
			setTextMessage: (value: string) => void
		): Promise<void> => {
			if (!content.trim()) return
			try {
				const response = await MessageService.sendMessage(
					content,
					senderId,
					chatId
				)
				setNewMessage(response.data)
				setMessages((prev) => [...(prev || []), response.data])
				setTextMessage('')
			} catch (e: unknown) {
				if (axios.isAxiosError(e)) {
					console.error(e.response?.data?.message ?? 'Failed to send message')
				}
			}
		},
		[]
	)

	useEffect(() => {
		if (user) getUserChats()
	}, [getUserChats, user])

	useEffect(() => {
		if (!currentChat?._id) return
		socket.emit('joinChat', { chatId: currentChat._id })
		return () => {
			socket.emit('leaveChat', { chatId: currentChat._id })
		}
	}, [currentChat])

	useEffect(() => {
		if (!currentChat?._id || !user) return
		getMessages(currentChat._id)
		socket.emit('markAsRead', { chatId: currentChat._id, userId: user._id })

		socket.on('messagesRead', ({ chatId }: { chatId: string }) => {
			if (chatId === currentChat._id) {
				setMessages((prev) =>
					prev
						? prev.map((msg) =>
								msg.senderId !== user._id ? { ...msg, isRead: true } : msg
							)
						: prev
				)
			}
		})
		return () => {
			socket.off('messagesRead')
		}
	}, [currentChat, user])

	// ⬇️ вернули загрузку собеседника — без этого header/footer могли не рендериться
	useEffect(() => {
		const fetchRecipient = async (): Promise<void> => {
			if (!currentChat || !user) return setRecipientUser(null)
			const recipientId = currentChat.members?.find(
				(id: string) => id !== user._id
			)
			if (!recipientId) return setRecipientUser(null)
			try {
				const response = await UserService.getUser(recipientId)
				setRecipientUser(response.data)
			} catch {
				setRecipientUser(null)
			}
		}
		fetchRecipient()
	}, [currentChat, user])

	return (
		<ChatContext.Provider
			value={{
				userChats,
				isLoading,
				userChatsError,
				currentChat,
				updateCurrentChat,
				messages,
				getMessages,
				sendMessage,
				onlineUsers,
				recipientUser,
				resetRecipientUser,
				typingUsers,
			}}
		>
			{children}
		</ChatContext.Provider>
	)
}
