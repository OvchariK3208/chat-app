import type {
	AxiosError,
	AxiosInstance,
	InternalAxiosRequestConfig,
} from 'axios'
import axios from 'axios'
import type { AuthResponse } from '../models/response/AuthResponse'

const BASE_URL = import.meta.env.VITE_BASE_URL as string
export const API_URL = `${BASE_URL}/api/`

const api: AxiosInstance = axios.create({
	baseURL: API_URL,
	withCredentials: true,
})

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
	const token = localStorage.getItem('token')
	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}
	return config
})

api.interceptors.response.use(
	(config) => config,
	async (error: AxiosError) => {
		const originalRequest = error.config as InternalAxiosRequestConfig & {
			_isRetry?: boolean
		}

		if (error.response?.status === 401 && !originalRequest?._isRetry) {
			originalRequest._isRetry = true
			try {
				const response = await axios.get<AuthResponse>(
					`${API_URL}/users/refresh`,
					{
						withCredentials: true,
					}
				)
				localStorage.setItem('token', response.data.accessToken)
				return api.request(originalRequest)
			} catch {
				console.warn('User is not authorized')
			}
		}

		throw error
	}
)

export default api
