import cn from 'classnames'
import { X, Video, Info } from 'lucide-react'
import React from 'react'
import useChat from '@/hooks/useChat'
import Avatar from '@/shared/ui/Avatar'
import CustomAlert from '@/shared/ui/CustomAlert'
import styles from './ChatHeader.module.scss'

const ChatHeader: React.FC = () => {
	const { recipientUser, resetRecipientUser, onlineUsers } = useChat()

	if (!recipientUser) {
		return <></>
	}

	const isOnline = onlineUsers.some(
		(u) => String(u?.userId) === String(recipientUser?._id)
	)

	return (
		<div className={cn(styles.header)}>
			<div className={styles.header__user}>
				<button
					className={styles.close}
					onClick={() => resetRecipientUser()}
				>
					<X />
				</button>
				<Avatar
					alt={recipientUser?.nickname}
					url={recipientUser?.url_img}
				/>

				<div className={styles.header__info}>
					<h2 className={cn('h2', styles.header__nickname)}>
						{recipientUser?.nickname}
					</h2>
					<p
						className={cn('p', styles.header__status, {
							[styles['header__status--online']]: isOnline,
							[styles['header__status--offline']]: !isOnline,
						})}
					>
						{isOnline ? 'online' : 'offline'}
					</p>
				</div>
			</div>

			<div className={styles.header__actions}>
				<CustomAlert label='Video call'>
					<Video />
				</CustomAlert>
				<CustomAlert label='Info'>
					<Info />
				</CustomAlert>
			</div>
		</div>
	)
}

export default ChatHeader
