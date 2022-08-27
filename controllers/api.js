
const { Octokit } = require('@octokit/rest');
const Twitter = require('twitter-lite');
const validator = require('validator');


/**
 * GET /api
 * List of API examples.
 */
exports.getApi = (req, res) => {
	res.render('api/index', {
		title: 'API Examples'
	});
};


/**
 * GET /api/github
 * GitHub API Example.
 */
// exports.getGithub = async (req, res, next) => {
// 	const github = new Octokit();
// 	try {
// 		const { data: repo } = await github.repos.get({ owner: 'sahat', repo: 'hackathon-starter' });
// 		res.render('api/github', {
// 			title: 'GitHub API',
// 			repo
// 		});
// 	} catch (error) {
// 		next(error);
// 	}
// };


/**
 * GET /api/twitter
 * Twitter API example.
 */
// exports.getTwitter = async (req, res, next) => {
// 	const token = req.user.tokens.find((token) => token.kind === 'twitter');
// 	const T = new Twitter({
// 		consumer_key: process.env.TWITTER_KEY,
// 		consumer_secret: process.env.TWITTER_SECRET,
// 		access_token_key: token.accessToken,
// 		access_token_secret: token.tokenSecret
// 	});
// 	try {
// 		const { statuses: tweets } = await T.get('search/tweets', {
// 			q: 'nodejs since:2013-01-01',
// 			geocode: '40.71448,-74.00598,5mi',
// 			count: 10
// 		});
// 		res.render('api/twitter', {
// 			title: 'Twitter API',
// 			tweets
// 		});
// 	} catch (error) {
// 		next(error);
// 	}
// };

/**
 * POST /api/twitter
 * Post a tweet.
 */
// exports.postTwitter = async (req, res, next) => {
// 	const validationErrors = [];
// 	if (validator.isEmpty(req.body.tweet)) validationErrors.push({ msg: 'Tweet cannot be empty' });

// 	if (validationErrors.length) {
// 		req.flash('errors', validationErrors);
// 		return res.redirect('/api/twitter');
// 	}

// 	const token = req.user.tokens.find((token) => token.kind === 'twitter');
// 	const T = new Twitter({
// 		consumer_key: process.env.TWITTER_KEY,
// 		consumer_secret: process.env.TWITTER_SECRET,
// 		access_token_key: token.accessToken,
// 		access_token_secret: token.tokenSecret
// 	});
// 	try {
// 		await T.post('statuses/update', { status: req.body.tweet });
// 		req.flash('success', { msg: 'Your tweet has been posted.' });
// 		res.redirect('/api/twitter');
// 	} catch (error) {
// 		next(error);
// 	}
// };

/**
 * GET /api/upload
 * File Upload API example.
 */

exports.getFileUpload = (req, res) => {
	res.render('api/upload', {
		title: 'File Upload'
	});
};

exports.postFileUpload = (req, res) => {
	req.flash('success', { msg: 'File was uploaded successfully.' });
	res.redirect('/api/upload');
};
