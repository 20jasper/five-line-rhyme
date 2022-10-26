const session = require('supertest-session');
const app = require('../../app');
const { mongoMemoryServerConnect, getCSRFToken } = require('../../helpers/testHelpers.test');

(() => {
	before(mongoMemoryServerConnect);
	let _csrf;
	const request = session(app);

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

	describe('Post /signup with missing csrf token', () => {
		it('should return 500 Internal Server Error', (done) => {
			request
				.post('/signup')
				.send({ })
				.expect(500, done);
		});
	});

	describe('Post /signup with only csrf token', () => {
		it('should return 500 Internal Server Error', async () => {
			const res = await request.get('/signup');
			_csrf = getCSRFToken(res);

			request
				.post('/signup')
				.send({ _csrf })
				.expect(500);
		});
	});

	describe('GET /account', () => {
		it('should return 302 Redirect', (done) => {
			request
				.get('/account')
				.expect(302, done);
		});
	});
})();
