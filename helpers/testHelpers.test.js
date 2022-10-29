const { MongoMemoryServer } = require('mongodb-memory-server');
const cheerio = require('cheerio');

exports.mongoMemoryServerConnect = async () => {
	const mongoServer = await MongoMemoryServer.create();
	const mockMongoDBUri = mongoServer.getUri();
	process.env.MONGODB_URI = mockMongoDBUri;
};

exports.getCSRFToken = (res) => {
	const $ = cheerio.load(res.text);
	return $('meta[name="csrf-token"]')
		.attr('content');
};

exports.testAccount = {
	email: 'test@test.com',
	userName: 'test',
	password: '12345678',
	confirmPassword: '12345678'
};

exports.signup = async (request) => {
	const res = await request.get('/signup');
	const _csrf = this.getCSRFToken(res);

	// signup with new account
	request
		.post('/signup')
		.send({
			_csrf,
			...this.testAccount
		});
};