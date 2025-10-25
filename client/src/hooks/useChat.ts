import { useContext } from 'react'
import { ChatContext, type ChatContextProps } from '@/context/ChatContext'

const useChat = (): ChatContextProps => {
	const context = useContext(ChatContext)

	if (!context) {
		throw new Error('useChat must be used within an ChatProvider')
	}

	return context
}

export default useChat
