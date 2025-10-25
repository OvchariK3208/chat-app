const MessageModel = require('./../models/messageModel');

const createMessage = async (req, res) => {
	try {
		const { chatId, senderId, content } = req.body;

		const newMessage = new MessageModel({
			chatId,
			senderId,
			content
		});

		const savedMessage = await newMessage.save();
		res.status(200).json(savedMessage);
	} catch (e) {
		next(e);
	}
};

const getMessages = async (req, res) => {
	try {
		const { chatId } = req.params;

		const messages = await MessageModel.find({ chatId });
		res.status(200).json(messages);
	} catch (e) {
		next(e);
	}
};

const markMessagesAsRead = async (req, res, next) => {
	try {
		const { chatId, userId } = req.body;

		await MessageModel.updateMany(
			{ chatId, senderId: { $ne: userId }, isRead: false },
			{ $set: { isRead: true } }
		);

		res.status(200).json({ success: true });
	} catch (e) {
		next(e);
	}
};

module.exports = { createMessage, getMessages, markMessagesAsRead };