import type { AxiosResponse } from 'axios'
import api from '@/axios'
import type { IChat } from '@/models/IChat'
import type { IMessage } from '@/models/IMessage'

export default class ChatService {
	static async getUserChats(chatId: string): Promise<AxiosResponse<IChat[]>> {
		return api.get<IChat[]>(`chats/${chatId}`)
	}

	static async getLastMessage(
		chatId: string
	): Promise<AxiosResponse<IMessage>> {
		return api.get<IMessage>(`chats/${chatId}/last-message`)
	}
}
