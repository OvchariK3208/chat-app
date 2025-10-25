const { Schema, model } = require('mongoose');

const ChatSchema = new Schema(
	{
		members: [
			{
				type: Schema.Types.ObjectId,
				ref: 'User',
				required: true,
			},
		],
	},
	{
		timestamps: true,
	}
);

module.exports = model('Chat', ChatSchema);