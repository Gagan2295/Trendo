const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
	name: {
		type: String,
		require: true
	},
	email: {
		type: String,
		require: true
	},


	password: {
		// isLength: {
		// 	options: { min: 8 },
		// 	errorMessage: 'Password should be at least 8 chars',
		// },
		type: String,
		require: true
	},
	mobile: {
		isLength: {
			options: { min: 8 },
			errorMessage: 'phone number should be at least 10 chars',
		},
		type: String,
		require: true
	}
})

const userModel = mongoose.model("User_data", userSchema, "User_data")
module.exports = userModel;
