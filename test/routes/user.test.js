const session = require('supertest-session');
const app = require('../../app');
const { mongoMemoryServerConnect, getCSRFToken, testAccount } = require('../../helpers/testHelpers.test');

/*
	Test routes while logged out
*/
(() => {
	console.log('logged out routes');
	mongoMemoryServerConnect();

	let request;

	beforeEach(() => {
		request = session(app);
	});

	describe('GET /login', () => {
		it('should return 200 OK', (done) => {
			request
				.get('/login')
				.expect(200, done);
		});
	});

	describe('GET /signup', () => {
		it('should return 200 OK', (done) => {
			request
				.get('/signup')
				.expect(200, done);
		});
	});

	describe('Post /signup with missing information', () => {
		it('should return 500 Internal Server Error', (done) => {
			request
				.post('/signup')
				.send({ })
				.expect(500, done);
		});
	});

	describe('GET /account while logged out', () => {
		it('should return 302 Found', (done) => {
			request
				.get('/account')
				.expect(302, done);
		});
	});
})();

/*
	Test routes while logged in
*/
(() => {
	console.log('logged in routes');
	mongoMemoryServerConnect();

	let _csrf;
	let request;

	beforeEach(async () => {
		request = session(app);

		const res = await request.get('/signup');
		_csrf = getCSRFToken(res);

		// signup with new account
		request
			.post('/signup')
			.send({
				_csrf,
				...testAccount
			});

		_csrf = null;
	});

	describe('GET /account while logged in', () => {
		it('should return 200 OK', async () => {
			request
				.get('/account')
				.expect(200);
		});
	});

	describe('GET /logout while logged in', () => {
		it('should return 302 Found', async () => {
			request
				.get('/logout')
				.expect(302);
		});
	});
})();
