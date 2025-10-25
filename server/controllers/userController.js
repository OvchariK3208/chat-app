const userService = require('./../service/userService');
const { validationResult } = require('express-validator');
const ApiError = require('./../exceptions/apiError');

const registration = async (req, res, next) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return next(ApiError.BadRequest('Validation error', errors.array()));
		}

		const { nickname, email, password } = req.body;
		const userData = await userService.registration(nickname, email, password);

		res.cookie('refreshToken', userData.refreshToken, {
			maxAge: 30 * 24 * 60 * 60 * 1000,
			httpOnly: true,
		});

		return res.status(200).json(userData);
	} catch (e) {
		next(e);
	}
};

const login = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		const userData = await userService.login(email, password);

		res.cookie('refreshToken', userData.refreshToken, {
			maxAge: 30 * 24 * 60 * 60 * 1000,
			httpOnly: true,
		});

		return res.status(200).json(userData);
	} catch (e) {
		next(e);
	}
};

const logout = async (req, res, next) => {
	try {
		const { refreshToken } = req.cookies;
		const token = await userService.logout(refreshToken);

		res.clearCookie('refreshToken');
		return res.status(200).json(token);
	} catch (e) {
		next(e);
	}
};

const refresh = async (req, res, next) => {
	try {
		const { refreshToken } = req.cookies;
		console.log(refreshToken)
		
		const userData = await userService.refresh(refreshToken);
		console.log("refreshToken", 1, userData)
		res.cookie('refreshToken', userData.refreshToken, {
			maxAge: 30 * 24 * 60 * 60 * 1000,
			httpOnly: true,
		});
		console.log("refreshToken", 2)
		return res.status(200).json(userData);
	} catch (e) {
		next(e);
	}
};

const getAllUsers = async (req, res, next) => {
	try {
		const users = await userService.getAllUsers();
		console.log(users)
		return res.status(200).json(users);
	} catch (e) {
		next(e);
	}
};

const getUser = async (req, res, next) => {
	try {
		const { userId } = req.params;
		const user = await userService.getUser(userId);
		return res.status(200).json(user);
	} catch (e) {
		next(e);
	}
};

module.exports = {
	registration,
	login,
	logout,
	refresh,
	getAllUsers,
	getUser,
};