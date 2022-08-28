const Poem = require('../models/Poem');

/**
 * GET /poems
 * 
 */

exports.getPoems = (req, res) => {
	res.render('error/404')
}

//add story post request
exports.postPoem = async (req, res) => {
	try {
		req.body.user = req.user.userName
		await Poem.create(req.body)
		res.redirect('/')
	} catch (err) {
		console.error(err)
		res.render('error/500')
	}
}