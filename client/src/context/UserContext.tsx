import React, { createContext, useState, useCallback } from 'react'
import axios from 'axios'
import type { IUser } from '@/models/IUser'
import UserService from '@/services/UserService'

export interface UserContextProps {
	users: IUser[]
	isLoading: boolean
	getAllUsers: () => Promise<void>
}

export const UserContext = createContext<UserContextProps | undefined>(
	undefined
)

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [users, setUsers] = useState<IUser[]>([])
	const [isLoading, setIsLoading] = useState(false)

	const getAllUsers = useCallback(async (): Promise<void> => {
		try {
			setIsLoading(true)
			const response = await UserService.fetchUsers()
			setUsers(response.data)
		} catch (e: unknown) {
			if (axios.isAxiosError(e)) {
				console.error(e.response?.data?.message ?? 'Failed to fetch users')
			}
		} finally {
			setIsLoading(false)
		}
	}, [])

	return (
		<UserContext.Provider value={{ users, isLoading, getAllUsers }}>
			{children}
		</UserContext.Provider>
	)
}
