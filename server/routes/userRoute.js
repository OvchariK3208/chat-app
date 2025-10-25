const express = require("express");
const {
	registration,
	login,
	logout,
	refresh,
	getAllUsers,
	getUser,
} = require('./../controllers/userController');
const authMiddleware = require('./../middlewares/authMiddleware');
const router = express.Router();

router.post('/registration', registration);
router.post('/login', login);
router.post('/logout', logout);
router.get('/refresh', refresh);
router.get('/', authMiddleware, getAllUsers);
router.get('/:userId', authMiddleware, getUser);

module.exports = router;