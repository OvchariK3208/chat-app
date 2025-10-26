import cn from 'classnames'
import { LogOut, ArrowLeft } from 'lucide-react'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router'
import ChatListItem from '@/components/ChatListItem'
import ThemeToggle from '@/components/ThemeToggle'
import type { IChat } from '@/models/IChat'
import useAuth from '@/hooks/useAuth'
import useChat from '@/hooks/useChat'
import styles from './Sidebar.module.scss'

const Sidebar: React.FC = () => {
	const { user, logout, isAuth } = useAuth()
	const { userChats, updateCurrentChat, currentChat } = useChat()
	const navigate = useNavigate()

	const logoutAndRemoveToken = (): void => {
		logout()
	}

	useEffect(() => {
		if (!isAuth) {
			navigate('/login', { replace: true })
		}
	}, [isAuth, navigate])

	return (
		<div
			className={cn(styles.sidebar, {
				[styles['sidebar--mobile']]: !currentChat,
			})}
		>
			<div className={styles.sidebar__header}>
				<h1 className={cn('h1', styles.sidebar__title)}>Messages</h1>
			</div>

			<div className={styles.sidebar__list}>
				{user && userChats?.length ? (
					userChats.map((chat: IChat) => (
						<div
							key={chat._id}
							onClick={() => updateCurrentChat(chat)}
							className={styles.sidebar__item}
						>
							<ChatListItem
								chat={chat}
								user={user}
							/>
						</div>
					))
				) : (
					<div className={styles.sidebar__empty}>
						<p>No chats found</p>
					</div>
				)}
			</div>

			<div className={styles.sidebar__controls}>
				<ThemeToggle />
				<button
					onClick={logoutAndRemoveToken}
					className={styles.sidebar__logout}
				>
					<LogOut className={styles['sidebar__logout-icon']} /> Logout
				</button>
			</div>
		</div>
	)
}

export default Sidebar
