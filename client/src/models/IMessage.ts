export interface IMessage {
	chatId: string
	senderId: string
	content: string
	isRead?: boolean
	createdAt: string
	_id: string
}
