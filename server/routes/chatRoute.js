const express = require("express");
const {
	createChat,
	findUserChats,
	findChat,
	lastMessage
} = require('./../controllers/chatController');
const router = express.Router();

router.post('/', createChat)
router.get('/:userId', findUserChats);
router.get('/find/:firstID/:secondID', findChat);
router.get('/:chatId/last-message', lastMessage);

module.exports = router;