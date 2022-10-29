const Poem = require('../models/Poem');
const { sanitizeHTML } = require('../helpers/poemHelpers');

/**
 * GET /poems/add
 *
 */

exports.getAddPage = (req, res) => {
	res.render('poems/add');
};

/**
 * Post /poems
 *
 */

// add story post request
exports.postPoem = async (req, res, next) => {
	try {
		req.body.user = req.user.id;

		const validationErrors = [];
		const poem = req.body.content.trim();

		if (poem.length > 500) validationErrors.push({ msg: 'Your Poem Is Longer than 500 characters' });

		// if there are 0 new line characters, the length will be undefined
		const newLineCount = poem.match(/\r/g)?.length ?? 0;
		// check against 4 since the first line doesn't have a new line character
		if (newLineCount < 4) validationErrors.push({ msg: 'Your Poem Has Less Than 5 Lines' });
		else if (newLineCount > 4) validationErrors.push({ msg: 'Your Poem Has More Than 5 Lines' });
		if (validationErrors.length) {
			req.flash('errors', validationErrors);
			return res.redirect('/poems/add');
		}

		req.body.content = sanitizeHTML(req.body.content);

		await Poem.create(req.body);
		res.redirect('/');
	} catch (err) {
		console.error(err);
		res.render('error/500');
	}
};

/**
 * POST /id/delete
 * Delete poem.
 */
exports.postDeletePoem = (req, res, next) => {
	// //delete profile picture on account deletion
	try {
		const validationErrors = [];

		// check if user is the same as who wrote the poem
		Poem.findById(req.params.id, (err, poem) => {
			if (err) { return next(err); }
			console.log(poem.user.id, req.user.id);
			if (poem.user.id !== req.user.id) validationErrors.push({ msg: 'User IDs do not match' });
		});

		if (validationErrors.length) {
			req.flash('errors', validationErrors);
			return res.redirect(`poems/${req.params.id}`);
		}

		Poem.deleteOne({ _id: req.params.id }, (err) => {
			if (err) { return next(err); }
			req.flash('info', { msg: 'Your poem has been deleted.' });
			res.redirect('/');
		});
	} catch (err) {
		console.log(err);
		req.flash('errors', { msg: 'Poem Deletion Failed' });
		return res.redirect(`poems/${req.params.id}`);
	}
};

/**
 * GET /poems/add
 *
 */

exports.getPoem = async (req, res) => {
	try {
		const poem = await Poem.findById(req.params.id)
			.populate('user');

		res.render('poems/poem', {
			poem,
		});
	} catch (err) {
		console.log(err);
	}
};
