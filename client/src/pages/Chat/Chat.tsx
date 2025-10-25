import React, { useEffect } from 'react'
import { ChatHeader, ChatContent, ChatFooter } from '@/components/Chat'
import Sidebar from '@/components/Sidebar'
import { ChatProvider } from '@/context/ChatContext'
import useAuth from '@/hooks/useAuth'
import styles from './Chat.module.scss'

const Chat: React.FC = () => {
	const { user, checkAuth } = useAuth()

	useEffect(() => {
		if (localStorage.getItem('token')) {
			checkAuth()
		}
	}, [checkAuth])

	return (
		<ChatProvider user={user}>
			<div className={styles.wrapper}>
				<Sidebar />
				<div className={styles.chat}>
					<ChatHeader />
					<ChatContent />
					<ChatFooter />
				</div>
			</div>
		</ChatProvider>
	)
}

export default Chat
