module.exports = class UserDTO {
	nickname;
	email;
	_id;

	constructor(model) {
		this.nickname = model.nickname;
		this.email = model.email;
		this._id = model._id;
	}
}