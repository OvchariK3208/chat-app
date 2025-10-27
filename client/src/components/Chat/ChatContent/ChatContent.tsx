import cn from 'classnames'
import { format, isSameDay, isToday, isYesterday } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { Check, CheckCheck, MessageCircleMore } from 'lucide-react'
import React, { useEffect, useRef } from 'react'
import type { IMessage } from '@/models/IMessage'
import useAuth from '@/hooks/useAuth'
import useChat from '@/hooks/useChat'
import styles from './ChatContent.module.scss'

const ChatContent: React.FC = () => {
	const { user } = useAuth()
	const { messages, getMessages, currentChat, recipientUser } = useChat()
	const scroll = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		scroll.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
	}, [messages])

	console.log('currentChat', currentChat)

	useEffect(() => {
		if (currentChat?._id) getMessages(currentChat._id)
	}, [currentChat])

	const renderDate = (date: Date) => {
		if (isToday(date)) return 'Today'
		if (isYesterday(date)) return 'Yesterday'
		return format(date, 'MMMM d', { locale: enUS })
	}

	if (!recipientUser) {
		return (
			<div className={styles.chat__default}>
				<div className={styles.chat__default_inner}>
					<h3>
						<MessageCircleMore /> Welcome to Chat!
					</h3>
					<p>Select a user to start a conversation</p>
				</div>
			</div>
		)
	}

	return (
		<div
			className={cn(styles.chat, currentChat?._id && styles['chat--mobile'])}
		>
			<div className={styles.chat__messages}>
				{messages?.map((msg: IMessage, index: number) => {
					const prevMsg = messages[index - 1]
					const showDateDivider =
						!prevMsg ||
						!isSameDay(new Date(msg.createdAt), new Date(prevMsg.createdAt))

					const isMyMessage = msg.senderId === user?._id
					const messageTime = format(new Date(msg.createdAt), 'HH:mm', {
						locale: enUS,
					})

					return (
						<React.Fragment key={msg._id}>
							{showDateDivider && (
								<div className={styles.chat__date_divider}>
									{renderDate(new Date(msg.createdAt))}
								</div>
							)}

							<div
								className={cn(styles.chat__message, {
									[styles['chat__message--author']]: isMyMessage,
								})}
							>
								<div className={styles.chat__bubble}>
									<p className={styles.chat__text}>{msg.content}</p>

									<div className={styles.chat__meta}>
										<span className={styles.chat__time}>{messageTime}</span>
										{isMyMessage && (
											<span
												className={cn(styles.chat__status, {
													[styles['chat__status--read']]: msg.isRead,
												})}
											>
												{msg.isRead ? <CheckCheck /> : <Check />}
											</span>
										)}
									</div>
								</div>
							</div>
						</React.Fragment>
					)
				})}

				<div
					ref={scroll}
					className={styles.chat__scroll_anchor}
				/>
			</div>
		</div>
	)
}

export default ChatContent
