import React, { createContext, useState, useCallback } from 'react'
import axios from 'axios'
import api from '@/axios'
import type { IUser } from '@/models/IUser'
import type { AuthResponse } from '@/models/response/AuthResponse'
import AuthService from '@/services/AuthService'

interface AuthContextProps {
	user: IUser | null
	isAuth: boolean
	isLoading: boolean
	authError: string | null
	errors: Record<string, string>
	login: (email: string, password: string) => Promise<void>
	registration: (
		nickname: string,
		email: string,
		password: string
	) => Promise<void>
	logout: () => Promise<void>
	checkAuth: () => Promise<void>
}

export const AuthContext = createContext<AuthContextProps | undefined>(
	undefined
)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<IUser | null>(null)
	const [isAuth, setIsAuth] = useState<boolean>(false)
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [authError, setAuthError] = useState<string | null>(null)
	const [errors, setErrors] = useState<{ [key: string]: string }>({})

	const login = useCallback(
		async (email: string, password: string): Promise<void> => {
			try {
				setAuthError(null)
				const response = await AuthService.login(email, password)
				localStorage.setItem('token', response.data.accessToken)
				setIsAuth(true)
				setUser(response.data.user)
			} catch (e: unknown) {
				if (axios.isAxiosError(e)) {
					const msg = e.response?.data?.message ?? 'Authentication failed'
					console.error(msg)
					setAuthError(msg)
					setErrors(e.response?.data ?? {})
				}
			}
		},
		[]
	)

	const registration = async (
		nickname: string,
		email: string,
		password: string
	): Promise<void> => {
		try {
			const response = await AuthService.registration(nickname, email, password)
			localStorage.setItem('token', response.data.accessToken)
			setIsAuth(true)
			setUser(response.data.user)
			setErrors({})
		} catch (e: unknown) {
			if (axios.isAxiosError(e)) {
				setErrors(e.response?.data ?? {})
			}
		}
	}

	const logout = useCallback(async (): Promise<void> => {
		try {
			await AuthService.logout()
			localStorage.removeItem('token')
			setIsAuth(false)
			setUser(null)
		} catch (e: unknown) {
			if (axios.isAxiosError(e)) {
				console.error(e.response?.data?.message)
			}
		}
	}, [])

	const checkAuth = useCallback(async (): Promise<void> => {
		setIsLoading(true)
		try {
			const response = await api.get<AuthResponse>('users/refresh')
			localStorage.setItem('token', response.data.accessToken)
			setIsAuth(true)
			setUser(response.data.user)
		} catch (e: unknown) {
			if (axios.isAxiosError(e)) {
				console.error(e.response?.data?.message)
			}
		} finally {
			setIsLoading(false)
		}
	}, [])

	return (
		<AuthContext.Provider
			value={{
				user,
				isAuth,
				isLoading,
				login,
				registration,
				logout,
				checkAuth,
				authError,
				errors,
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}
