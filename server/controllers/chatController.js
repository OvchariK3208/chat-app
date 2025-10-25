const ChatModel = require('./../models/chatModel');
const MessageModel = require('./../models/messageModel');

const createChat = async (req, res) => {
	try {
		const { firstID, secondID } = req.body;
		const chat = await ChatModel.findOne({
			members: { $all: [firstID, secondID] }
		})

		if (chat) return res.status(200).json(chat)

		const newChat = new ChatModel({
			members: [firstID, secondID]
		})

		const response = await newChat.save()
		res.status(200).json(response)
	} catch (e) {
		next(e);
	}
}


const findUserChats = async (req, res, next) => {
	try {
		const userId = req.params.userId;

		const chats = await ChatModel.find({
			members: { $in: [userId] },
		});

		const chatsWithLastMessage = await Promise.all(
			chats.map(async (chat) => {
				const lastMessage = await MessageModel
					.findOne({ chatId: chat._id })
					.sort({ createdAt: -1 })
					.limit(1);
				return { ...chat.toObject(), lastMessage };
			})
		);

		res.status(200).json(chatsWithLastMessage);
	} catch (e) {
		next(e);
	}
};

const findChat = async (req, res) => {
	try {
		const { firstID, secondID } = req.params

		const chat = await ChatModel.findOne({
			members: { $all: [firstID, secondID] }
		})

		res.status(200).json(chat)
	} catch (e) {
		next(e);
	}
}

const lastMessage = async (req, res) => {
	try {
		const { chatId } = req.params;
		
		const message = await MessageModel
			.findOne({ chatId })
			.sort({ createdAt: -1 })
			.limit(1);
			
		res.status(200).json(message || null);
	} catch (e) {
		next(e)
	}
};

module.exports = { createChat, findUserChats, findChat, lastMessage };