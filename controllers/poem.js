const Poem = require('../models/Poem');

/**
 * GET /poems/add
 * 
 */

exports.getAddPage = (req, res) => {
	res.render("poems/add")
}

/**
 * Post /poems
 * 
 */

//add story post request
exports.postPoem = async (req, res, next) => {
	try {
		req.body.user = req.user.id

		const validationErrors = [];
		const poem = req.body.content.trim()

		const poemRowCount = poem.match(/\r/g).length
		//check against 4 since the first line doesn't have a new line character
		if (poemRowCount > 4) validationErrors.push({ msg: 'Your Poem Has More Than 5 Lines' });
		else if (poemRowCount < 4) validationErrors.push({ msg: 'Your Poem Has Less Than 5 Lines' });
		if (validationErrors.length) {
			req.flash('errors', validationErrors);
			return res.redirect('/poems/add');
		}

		//sanatize poems
		const entityHashMap = {
			"&": "&amp;",
			"<": "&lt;",
			">": "&gt;",
		}
		req.body.content = req.body.content.replace(/&|<|>/g, (str) => entityHashMap[str])

		await Poem.create(req.body)
		res.redirect('/')
	} catch (err) {
		console.error(err)
		res.render('error/500')
	}
}