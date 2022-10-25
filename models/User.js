const bcrypt = require('@node-rs/bcrypt');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		unique: true
	},
	userName: {
		type: String,
		required: true,
		// trims white space
		trim: true,
		unique: true,
	},
	password: String,
	passwordResetToken: String,
	passwordResetExpires: Date,
	emailVerificationToken: String,
	emailVerified: Boolean,

	tokens: Array,

	profile: {
		pronouns: String,
		location: String,
		website: String,
		picture: {
			url: String,
			cloudinaryId: String,
		}
	}
}, { timestamps: true });

/**
 * Password hash middleware.
 */
userSchema.pre('save', async function save(next) {
	const user = this;
	if (!user.isModified('password')) { return next(); }
	try {
		user.password = await bcrypt.hash(user.password, 10);
		next();
	} catch (err) {
		next(err);
	}
});

/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = async function comparePassword(candidatePassword, cb) {
	try {
		cb(null, await bcrypt.verify(candidatePassword, this.password));
	} catch (err) {
		cb(err);
	}
};

const User = mongoose.model('User', userSchema);

module.exports = User;
