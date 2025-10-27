import cn from 'classnames'
import { Paperclip, SendHorizontal } from 'lucide-react'
import React, { useState } from 'react'
import useAuth from '@/hooks/useAuth'
import useChat from '@/hooks/useChat'
import CustomAlert from '@/shared/ui/CustomAlert'
import styles from './ChatFooter.module.scss'

const ChatFooter: React.FC = () => {
	const [newMessage, setNewMessage] = useState('')

	const { currentChat, sendMessage, recipientUser } = useChat()
	const { user } = useAuth()

	const handleSend = (e: React.FormEvent<HTMLFormElement>): void => {
		e.preventDefault()
		if (!newMessage.trim() || !user || !currentChat) return

		sendMessage(newMessage, user._id, currentChat._id, setNewMessage)
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
				onChange={(e) => setNewMessage(e.target.value)}
				className={styles.form__input}
				autoComplete='off'
				aria-label='Message input'
			/>

			<button
				type='submit'
				className={cn(styles.form__button, {
					[styles['form__button--disabled']]: !newMessage.trim(),
				})}
				disabled={!newMessage.trim()}
				aria-label='Send message'
			>
				<SendHorizontal />
			</button>
		</form>
	)
}

export default ChatFooter
