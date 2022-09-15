const Poem = require('../models/Poem');

/**
 * GET /
 * Home page.
 */
exports.index = async (req, res) => {
	try {
		//get all public stories
		const poems = await Poem.find()
			.populate('user')
			.sort({ createdAt: 'desc' })
			.lean()
		res.render('home', {
			title: 'Home',
			poems,
		})
	}
	catch (err) {
		console.error(err)
		res.render('error/500')
	}

}
