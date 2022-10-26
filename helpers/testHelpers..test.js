const { MongoMemoryServer } = require('mongodb-memory-server');

exports.mongoMemoryServerConnect = async () => {
	const mongoServer = await MongoMemoryServer.create();
	const mockMongoDBUri = mongoServer.getUri();
	process.env.MONGODB_URI = mockMongoDBUri;
};
