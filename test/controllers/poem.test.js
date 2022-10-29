const { expect } = require('chai');
const chai = require('chai');
const sinon = require('sinon');
chai.use(require('sinon-chai'));
const { sanitizeHTML, getLineCount } = require('../../helpers/poemHelpers');
const { postPoem } = require('../../controllers/poem');

describe('Post poem helper functions', () => {
	it('Should correctly count lines', async () => {
		const emptyPoem = '';
		const oneLinePoem = 'one line';
		const fiveLinePoem = '1\r\n2\r\n3\r\n4\r\n5';
		const sixLinePoem = '1\r\n2\r\n3\r\n4\r\n5\r\n6';

		expect(getLineCount(emptyPoem)).to.equal(1);
		expect(getLineCount(oneLinePoem)).to.equal(1);
		expect(getLineCount(fiveLinePoem)).to.equal(5);
		expect(getLineCount(sixLinePoem)).to.equal(6);
	});

	it('Should replace "&," "<," and ">" with HTML entities', (done) => {
		let poem = 'here is a dangerous poem with spooky characters like &, <, and >';
		poem = sanitizeHTML(poem);

		expect(poem).to.equal('here is a dangerous poem with spooky characters like &amp;, &lt;, and &gt;');
		done();
	});
});

describe('Post poem function', () => {
	let req;
	let res;

	beforeEach(() => {
		req = {
			user: { id: '2983928398' },
			body: {
				title: 'poem',
				content: '',
			}
		};
		req.flash = sinon.stub().returns(req);

		res = {};
		res.status = sinon.stub().returns(res);
		res.render = sinon.stub().returns(res);
		res.redirect = sinon.stub().returns(res);
	});

	it('Should respond with "Your Poem Has Less Than 5 Lines"', async () => {
		await postPoem(req, res);

		expect(req.flash).to.have.been.calledWith('errors', [{ msg: 'Your Poem Has Less Than 5 Lines' }]);
		expect(res.redirect).to.have.been.calledWith('/poems/add');
	});

	it('Should respond with "Your Poem Has More Than 5 Lines"', async () => {
		req.body.content = '1\r\n2\r\n3\r\n4\r\n5\r\n6';
		await postPoem(req, res);

		expect(req.flash).to.have.been.calledWith('errors', [{ msg: 'Your Poem Has More Than 5 Lines' }]);
		expect(res.redirect).to.have.been.calledWith('/poems/add');
	});
});
