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
})();
