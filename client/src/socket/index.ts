import type { Socket } from 'socket.io-client'
import { io } from 'socket.io-client'

const BASE_URL = import.meta.env.VITE_BASE_URL as string

export const socket: Socket = io(BASE_URL, {
	transports: ['websocket'],
	withCredentials: true,
})
