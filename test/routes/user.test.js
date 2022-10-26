const request = require('supertest');
const app = require('../../app');
const { mongoMemoryServerConnect } = require('../../helpers/testHelpers..test');

(() => {
	before(mongoMemoryServerConnect);

	describe('GET /login', () => {
		it('should return 200 OK', (done) => {
			request(app)
				.get('/login')
				.expect(200, done);
		});
	});

	describe('GET /signup', () => {
		it('should return 200 OK', (done) => {
			request(app)
				.get('/signup')
				.expect(200, done);
		});
	});

	describe('GET /account', () => {
		it('should return 302 Redirect', (done) => {
			request(app)
				.get('/account')
				.expect(302, done);
		});
	});
})();
