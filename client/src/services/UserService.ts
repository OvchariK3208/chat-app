import type { AxiosResponse } from 'axios'
import api from '@/axios'
import type { IUser } from '@/models/IUser'

export default class UserService {
	static fetchUsers(): Promise<AxiosResponse<IUser[]>> {
		return api.get<IUser[]>('users')
	}

	static getUser(id: string): Promise<AxiosResponse<IUser>> {
		return api.get<IUser>(`users/${id}`)
	}

	static findUser(id: string): Promise<AxiosResponse<IUser>> {
		return api.get<IUser>(`users/find/${id}`)
	}
}
