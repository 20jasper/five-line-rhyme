const mongoose = require('mongoose')

const PoemSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		//trims white space
		trim: true,
	},
	body: {
		type: String,
		required: true,
	},
	user: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
})

module.exports = mongoose.model('Poem', PoemSchema)