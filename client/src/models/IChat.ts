import type { IMessage } from './IMessage'

export interface IChat {
	_id: string
	members: string[]
	createdAt?: string
	updatedAt?: string
	lastMessage?: IMessage
}
