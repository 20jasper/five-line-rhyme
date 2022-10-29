const Poem = require('../models/Poem');
const { sanitizeHTML, getLineCount } = require('../helpers/poemHelpers');

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
		const validationErrors = [];
		const poem = req.body.content.trim();

		if (poem.length > 500) validationErrors.push({ msg: 'Your Poem Is Longer than 500 characters' });

		const lineCount = getLineCount(poem);
		if (lineCount < 5) {
			validationErrors.push({ msg: 'Your Poem Has Less Than 5 Lines' });
		} else if (lineCount > 5) {
			validationErrors.push({ msg: 'Your Poem Has More Than 5 Lines' });
		}

		if (validationErrors.length) {
			req.flash('errors', validationErrors);
			return res.redirect('/poems/add');
		}

		await Poem.create({
			title: req.body.title,
			content: sanitizeHTML(poem),
			user: req.user.id,
		});
		res.redirect('/');
	} catch (err) {
		console.error(err);
		res.status(500).render('error/500');
	}
};

/**
 * POST /id/delete
 * Delete poem.
 */
exports.postDeletePoem = (req, res, next) => {
	try {
		// check if user is the same as who wrote the poem
		Poem.findById(req.params.id, (err, poem) => {
			if (err) {
				return next(err);
			}
			if (poem.user.id !== req.user.id) {
				req.flash('errors', { msg: 'User IDs do not match' });
				return res.redirect(`poems/${req.params.id}`);
			}
		});

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

		// if no poem is found to be rendered
		if (poem === null) {
			throw Error('Poem not found');
		}

		res.render('poems/poem', {
			poem,
		});
	} catch (err) {
		res.status(404).render('error/404');
	}
};
