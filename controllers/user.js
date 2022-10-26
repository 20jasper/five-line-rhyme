const passport = require('passport');
const validator = require('validator');
const User = require('../models/User');
const Poem = require('../models/Poem');
const cloudinary = require('../middleware/cloudinary');

/**
 * GET /login
 * Login page.
 */
exports.getLogin = (req, res) => {
	if (req.user) {
		return res.redirect('/');
	}
	res.render('account/login', {
		title: 'Login'
	});
};

/**
 * POST /login
 * Sign in using email and password.
 */
exports.postLogin = (req, res, next) => {
	const validationErrors = [];
	if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.' });
	if (validator.isEmpty(req.body.password)) validationErrors.push({ msg: 'Password cannot be blank.' });

	if (validationErrors.length) {
		req.flash('errors', validationErrors);
		return res.redirect('/login');
	}
	req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false });

	passport.authenticate('local', (err, user, info) => {
		if (err) { return next(err); }
		if (!user) {
			req.flash('errors', info);
			return res.redirect('/login');
		}
		req.logIn(user, (err) => {
			if (err) { return next(err); }
			req.flash('success', { msg: 'Success! You are logged in.' });
			res.redirect(req.session.returnTo || '/');
		});
	})(req, res, next);
};

/**
 * GET /logout
 * Log out.
 */
exports.logout = (req, res) => {
	req.logout();
	req.session.destroy((err) => {
		if (err) console.log('Error : Failed to destroy the session during logout.', err);
		req.user = null;
		res.redirect('/');
	});
};

/**
 * GET /signup
 * Signup page.
 */
exports.getSignup = (req, res, next) => {
	if (req.user) {
		return res.redirect('/');
	}
	res.render('account/signup', {
		title: 'Create Account'
	});
};

/**
 * POST /signup
 * Create a new local account.
 */
exports.postSignup = (req, res, next) => {
	const validationErrors = [];
	if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.' });
	if (!validator.isLength(req.body.password, { min: 8 })) validationErrors.push({ msg: 'Password must be at least 8 characters long' });
	if (req.body.password !== req.body.confirmPassword) validationErrors.push({ msg: 'Passwords do not match' });

	if (validationErrors.length) {
		req.flash('errors', validationErrors);
		return res.redirect('/signup');
	}
	req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false });

	const user = new User({
		email: req.body.email,
		password: req.body.password,
		userName: req.body.userName,
		profile: {
			pronouns: '',
			location: '',
			website: '',
			picture: {
				url: '',
				cloudinaryId: '',
			}
		}
	});

	// ensure unique user name
	User.findOne({ userName: req.body.userName }, (err, existingUser) => {
		if (err) { return next(err); }
		if (existingUser) {
			req.flash('errors', { msg: 'Account with that user name already exists.' });
			return res.redirect('/signup');
		}
	});

	// ensure unique email
	User.findOne({ email: req.body.email }, (err, existingUser) => {
		if (err) { return next(err); }
		if (existingUser) {
			req.flash('errors', { msg: 'Account with that email address already exists.' });
			return res.redirect('/signup');
		}
		user.save((err) => {
			if (err) { return next(err); }
			req.logIn(user, (err) => {
				if (err) {
					return next(err);
				}
				res.redirect('/');
			});
		});
	});
};

/**
 * GET /account
 * Profile page.
 */
exports.getAccount = (req, res) => {
	res.render('account/profile', {
		title: 'Account Management'
	});
};

/**
 * POST /account/profile
 * Update profile information.
 */
exports.postUpdateProfile = (req, res, next) => {
	const validationErrors = [];
	if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.' });

	if (validationErrors.length) {
		req.flash('errors', validationErrors);
		return res.redirect('/account');
	}
	req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false });

	User.findById(req.user.id, (err, user) => {
		if (err) { return next(err); }
		if (user.email !== req.body.email) user.emailVerified = false;
		user.email = req.body.email || '';
		user.userName = req.body.userName || '';
		user.profile.location = req.body.location || '';
		user.profile.website = req.body.website || '';
		user.profile.pronouns = req.body.pronouns || '';
		user.save((err) => {
			if (err) {
				if (err.code === 11000) {
					req.flash('errors', { msg: 'The email address you have entered is already associated with an account.' });
					return res.redirect('/account');
				}
				return next(err);
			}
			req.flash('success', { msg: 'Profile information has been updated.' });
			res.redirect('/account');
		});
	});
};

/**
 * POST /account/password
 * Update current password.
 */
exports.postUpdatePassword = (req, res, next) => {
	const validationErrors = [];
	if (!validator.isLength(req.body.password, { min: 8 })) validationErrors.push({ msg: 'Password must be at least 8 characters long' });
	if (req.body.password !== req.body.confirmPassword) validationErrors.push({ msg: 'Passwords do not match' });

	if (validationErrors.length) {
		req.flash('errors', validationErrors);
		return res.redirect('/account');
	}

	User.findById(req.user.id, (err, user) => {
		if (err) { return next(err); }
		user.password = req.body.password;
		user.save((err) => {
			if (err) { return next(err); }
			req.flash('success', { msg: 'Password has been changed.' });
			res.redirect('/account');
		});
	});
};

/**
 * POST /account/postUpdateProfilePicture
 * Update current profilePicture.
 */
exports.postUpdateProfilePicture = async (req, res, next) => {
	try {
		// Upload image to cloudinary
		const result = await cloudinary.uploader.upload(req.file.path, { aspect_ratio: '1.0', height: 200, crop: 'lfill' });

		User.findById(req.user.id, (err, user) => {
			if (err) { return next(err); }
			const { picture } = user.profile;

			// if there is already a profile picture, delete the old one
			if (picture.cloudinaryId !== '') cloudinary.uploader.destroy(picture.cloudinaryId);

			picture.url = result.secure_url;
			picture.cloudinaryId = result.public_id;

			user.save((err) => {
				if (err) { return next(err); }
				req.flash('success', { msg: 'Profile Picture Updated' });
				res.redirect('/account');
			});
		});
	} catch (err) {
		console.log(err);
		req.flash('errors', { msg: 'Profile Picture Update Failed' });
		res.redirect('/account');
	}
};

/**
 * POST /account/delete
 * Delete user account.
 */
exports.postDeleteAccount = (req, res, next) => {
	// delete profile picture on account deletion
	try {
		User.findById(req.user.id, (err, user) => {
			if (err) { return next(err); }
			const { picture } = user.profile;

			// if there is a profile picture, delete the old one
			if (picture.cloudinaryId !== '') cloudinary.uploader.destroy(picture.cloudinaryId);
		});

		Poem.deleteMany({ user: req.user.id }, (err) => {
			if (err) { return next(err); }
		});
	} catch (err) {
		console.log(err);
		req.flash('errors', { msg: 'Profile Picture Deletion Failed' });
		res.redirect('/account');
	}

	User.deleteOne({ _id: req.user.id }, (err) => {
		if (err) { return next(err); }
		req.logout();
		req.flash('info', { msg: 'Your account has been deleted.' });
		res.redirect('/');
	});
};
