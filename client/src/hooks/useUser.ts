import { useContext } from 'react'
import { UserContext, type UserContextProps } from '@/context/UserContext'

const useUser = (): UserContextProps => {
	const context = useContext(UserContext)

	if (!context) {
		throw new Error('useUser must be used within an UserProvider')
	}

	return context
}

export default useUser
