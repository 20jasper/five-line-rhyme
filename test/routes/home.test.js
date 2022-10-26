const request = require('supertest');
const app = require('../../app');
const { mongoMemoryServerConnect } = require('../../helpers/testHelpers..test');

(() => {
	before(mongoMemoryServerConnect);

	describe('GET /', () => {
		it('should return 200 OK', (done) => {
			request(app)
				.get('/')
				.expect(200, done);
		});
	});
})();
