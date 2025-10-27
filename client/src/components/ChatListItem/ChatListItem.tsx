import { format } from 'date-fns'
import { Check, CheckCheck } from 'lucide-react'
import React from 'react'
import type { JSX } from 'react'
import type { IChat } from '@/models/IChat'
import type { IUser } from '@/models/IUser'
import useChat from '@/hooks/useChat'
import useFeatch from '@/hooks/useFeatch'
import Avatar from '@/shared/ui/Avatar'
import styles from './ChatListItem.module.scss'

interface ChatUserProps {
	chat: IChat
	user: IUser
}

const ChatListItem: React.FC<ChatUserProps> = ({ chat, user }) => {
	const { recepientUser } = useFeatch(user, chat)
	const { onlineUsers } = useChat()

	const isOnline = onlineUsers.some((u) => u.userId === recepientUser?._id)

	const lastMessage = chat?.lastMessage
	const messageTime = lastMessage?.createdAt
		? format(new Date(lastMessage.createdAt), 'HH:mm')
		: ''

	const renderStatus = (): JSX.Element => {
		if (lastMessage) {
			return (
				<span className={styles['chat-item__last-message']}>
					{lastMessage.content}
				</span>
			)
		}
		return <span className={styles['chat-item__empty']}>No messages yet</span>
	}

	return (
		<div className={styles['chat-item']}>
			<div className={styles['chat-item__left']}>
				<div className={styles['chat-item__avatar']}>
					<Avatar
						alt={recepientUser?.nickname ?? ''}
						url={recepientUser?.url_img}
					/>
					{isOnline && <span className={styles['chat-item__online-dot']} />}
				</div>

				<div className={styles['chat-item__info']}>
					<div className={styles['chat-item__name']}>
						{recepientUser?.nickname}
					</div>
					<div className={styles['chat-item__status']}>{renderStatus()}</div>
				</div>
			</div>

			<div className={styles['chat-item__meta']}>
				{lastMessage && (
					<>
						<div className={styles['chat-item__time']}>{messageTime}</div>
						<div
							className={`${styles['chat-item__tick']} ${
								lastMessage.isRead ? styles['chat-item__tick--read'] : ''
							}`}
						>
							{lastMessage.isRead ? <CheckCheck /> : <Check />}
						</div>
					</>
				)}
			</div>
		</div>
	)
}

export default ChatListItem
