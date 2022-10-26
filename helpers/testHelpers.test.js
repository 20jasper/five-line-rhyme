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
