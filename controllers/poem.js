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
exports.postPoem = async (req, res) => {
	try {
		req.body.user = req.user.id
		await Poem.create(req.body)
		res.redirect('/')
	} catch (err) {
		console.error(err)
		res.render('error/500')
	}
}