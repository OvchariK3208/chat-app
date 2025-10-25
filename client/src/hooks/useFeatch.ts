import type { AxiosError } from 'axios'
import { useState, useEffect, useCallback } from 'react'
import type { IChat } from '@/models/IChat'
import type { IUser } from '@/models/IUser'
import UserService from '@/services/UserService'

const useFetch = (
	user: IUser | null,
	chat: IChat | null
): { recepientUser: IUser | null; error: string | null } => {
	const [recepientUser, setRecepientUser] = useState<IUser | null>(null)
	const [error, setError] = useState<string | null>(null)

	const recepientId = chat?.members.find((id) => id !== user?._id)

	const getUser = useCallback(async (): Promise<void> => {
		if (!recepientId) return

		try {
			const response = await UserService.getUser(recepientId)
			setRecepientUser(response.data)
		} catch (err) {
			const error = err as AxiosError<{ message?: string }>
			setError(error.response?.data?.message || 'Failed to fetch user')
		}
	}, [recepientId])

	useEffect(() => {
		void getUser()
	}, [getUser])

	return { recepientUser, error }
}

export default useFetch
