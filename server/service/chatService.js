const bcrypt = require('bcrypt');
const UserModel = require('./../models/userModel');
const UserDTO = require('./../dtos/userDTO');
const ApiError = require('./../exceptions/apiError');
const tokenService = require('./tokenService');

class UserService {
	async registration(email, password) {
		const candidate = await UserModel.findOne({ email });
		if (candidate) {
			throw ApiError.badRequest(`User with email ${email} already exists`);
		}

		const hashPassword = await bcrypt.hash(password, 3);
		const user = await UserModel.create({ email, password: hashPassword });

		const userDTO = new UserDTO(user);
		const tokens = tokenService.generateTokens({ ...userDTO });
		await tokenService.saveToken(userDTO._id, tokens.refreshToken);

		return { ...tokens, user: userDTO };
	}

	async login(email, password) {
		const user = await UserModel.findOne({ email });
		if (!user) {
			throw ApiError.badRequest('User with this email was not found');
		}

		const isPassEquals = await bcrypt.compare(password, user.password);
		if (!isPassEquals) {
			throw ApiError.badRequest('Invalid password');
		}

		const userDTO = new UserDTO(user);
		const tokens = tokenService.generateTokens({ ...userDTO });
		await tokenService.saveToken(userDTO._id, tokens.refreshToken);

		return { ...tokens, user: userDTO };
	}

	async logout(refreshToken) {
		const token = await tokenService.removeToken(refreshToken);
		return token;
	}

	async refresh(refreshToken) {
		if (!refreshToken) {
			throw ApiError.unauthorized();
		}

		const userData = tokenService.validateRefreshToken(refreshToken);
		const tokenFromDb = await tokenService.findToken(refreshToken);

		if (!userData || !tokenFromDb) {
			throw ApiError.unauthorized();
		}

		const user = await UserModel.findById(userData._id);
		const userDTO = new UserDTO(user);
		const tokens = tokenService.generateTokens({ ...userDTO });

		await tokenService.saveToken(userDTO.id, tokens.refreshToken);
		return { ...tokens, user: userDTO };
	}

	async getAllUsers() {
		const users = await UserModel.find();
		return users;
	}
}

module.exports = new UserService();