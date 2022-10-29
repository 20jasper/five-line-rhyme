const session = require('supertest-session');
const app = require('../../app');
const {
	mongoMemoryServerConnect, signup
} = require('../../helpers/testHelpers.test');

mongoMemoryServerConnect();

/*
	Test routes while logged out
*/
(() => {
	console.log('logged out routes');

	let request;

	beforeEach(() => {
		request = session(app);
	});

	describe('GET /poems/add', () => {
		it('should return 302 Found', (done) => {
			request
				.get('/poems/add')
				.expect(302, done);
		});
	});

	describe('GET /poems/randomPoemID', () => {
		it('should return 404 not Found', (done) => {
			request
				.get('/poems/randomPoemID')
				.expect(404, done);
		});
	});

	describe('GET an existing poem', () => {
		it('should return 200 OK', (done) => {
			request
				.get('/poems/6321b96b985cb15bd091102d')
				.expect(200, done);
		});
	});
})();

/*
	Test routes while logged in
*/
(() => {
	console.log('logged in routes');

	let request;

	beforeEach(async () => {
		request = session(app);
		signup(request);
	});

	describe('GET /poems/add', () => {
		it('should return 200 OK', async () => {
			request
				.get('/poems/add')
				.expect(200);
		});
	});
})();
