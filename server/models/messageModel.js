const { Schema, model } = require('mongoose');

const messageSchema = new Schema({
	chatId: { type: String },
	senderId: { type: String },
	content: { type: String },
	isRead: { type: Boolean, default: false },
},
{
	timestamps: true
});

module.exports = model("Message", messageSchema);