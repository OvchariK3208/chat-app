import type { AxiosResponse } from 'axios'
import api from '@/axios'
import type { AuthResponse } from '@/models/response/AuthResponse'

export default class AuthService {
	static async login(
		email: string,
		password: string
	): Promise<AxiosResponse<AuthResponse>> {
		return api.post<AuthResponse>('users/login', { email, password })
	}

	static async registration(
		nickname: string,
		email: string,
		password: string
	): Promise<AxiosResponse<AuthResponse>> {
		return await api.post<AuthResponse>('users/registration', {
			nickname,
			email,
			password,
		})
	}

	static async logout(): Promise<void> {
		return api.post('users/logout')
	}
}
