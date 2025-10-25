import type { AxiosResponse } from 'axios'
import api from './../axios'
import type { IMessage } from './../models/IMessage'

export default class MessageService {
	static async getMessages(chatId: string): Promise<AxiosResponse<IMessage[]>> {
		return api.get<IMessage[]>(`messages/${chatId}`)
	}

	static async sendMessage(
		content: string,
		senderId: string,
		chatId: string
	): Promise<AxiosResponse<IMessage>> {
		return api.post<IMessage>('messages', {
			chatId,
			senderId,
			content,
		})
	}
}
