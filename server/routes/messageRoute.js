const express = require("express");
const {
	createMessage,
	getMessages,
	markMessagesAsRead
} = require('./../controllers/messageController');
const router = express.Router();

router.post('/', createMessage)
router.get('/:chatId', getMessages);
router.patch("/mark-as-read", markMessagesAsRead);

module.exports = router;