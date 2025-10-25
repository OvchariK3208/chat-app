import cn from 'classnames'
import { Paperclip, SendHorizontal } from 'lucide-react'
import React, { useState, useRef } from 'react'
import useAuth from '@/hooks/useAuth'
import useChat from '@/hooks/useChat'
import CustomAlert from '@/shared/ui/CustomAlert'
import { socket } from '@/socket'
import styles from './ChatFooter.module.scss'

const ChatFooter: React.FC = () => {
	const [newMessage, setNewMessage] = useState('')
	const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

	const { currentChat, sendMessage, recipientUser } = useChat()
	const { user } = useAuth()

	const handleSend = (e: React.FormEvent) => {
		e.preventDefault()
		if (!newMessage.trim() || !user || !currentChat) return

		sendMessage(newMessage, user._id, currentChat._id, setNewMessage)

		socket.emit('stoppedTyping', {
			chatId: currentChat._id,
			senderId: user._id,
		})
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value
		setNewMessage(value)

		if (!user || !currentChat) return

		socket.emit('typing', { chatId: currentChat._id, senderId: user._id })

		if (typingTimeout.current) clearTimeout(typingTimeout.current)

		typingTimeout.current = setTimeout(() => {
			socket.emit('stoppedTyping', {
				chatId: currentChat._id,
				senderId: user._id,
			})
		}, 1500)
	}

	if (!recipientUser) return null

	return (
		<form
			onSubmit={handleSend}
			className={cn(styles.form)}
		>
			<CustomAlert label='Add media'>
				<Paperclip />
			</CustomAlert>

			<input
				type='text'
				placeholder='Message'
				value={newMessage}
				onChange={handleInputChange}
				className={styles.form__input}
				autoComplete='off'
			/>

			<button
				type='submit'
				className={cn(styles.form__button, {
					[styles['form__button--disabled']]: !newMessage.trim(),
				})}
				disabled={!newMessage.trim()}
			>
				<SendHorizontal />
			</button>
		</form>
	)
}

export default ChatFooter
