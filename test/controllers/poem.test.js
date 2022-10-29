const { expect } = require('chai');
const chai = require('chai');
const sinon = require('sinon');
chai.use(require('sinon-chai'));

const { sanitizeHTML, getLineCount, getPoemXLinesLong } = require('../../helpers/poemHelpers');
const { postPoem } = require('../../controllers/poem');
const Poem = require('../../models/Poem');

describe('Post poem helper functions', () => {
	it('Should correctly count lines', async () => {
		for (let i = 1; i < 9; i++) {
			expect(getLineCount(getPoemXLinesLong(i))).to.equal(i);
		}
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

		Poem.create = sinon.stub().returns(Poem);
	});

	it('Should respond with "Your Poem Has Less Than 5 Lines"', async () => {
		req.body.content = getPoemXLinesLong(4);
		await postPoem(req, res);

		expect(req.flash).to.have.been.calledWith('errors', [{ msg: 'Your Poem Has Less Than 5 Lines' }]);
		expect(res.redirect).to.have.been.calledWith('/poems/add');
	});

	it('Should respond with "Your Poem Has More Than 5 Lines"', async () => {
		req.body.content = getPoemXLinesLong(6);
		await postPoem(req, res);

		expect(req.flash).to.have.been.calledWith('errors', [{ msg: 'Your Poem Has More Than 5 Lines' }]);
		expect(res.redirect).to.have.been.calledWith('/poems/add');
	});

	it('Should respond with "Your Poem Is Longer than 500 characters" and "Your Poem Has Less Than 5 Lines"', async () => {
		req.body.content = 'a'.repeat(501);

		await postPoem(req, res);

		expect(req.flash).to.have.been.calledWith('errors', [{ msg: 'Your Poem Is Longer than 500 characters' }, { msg: 'Your Poem Has Less Than 5 Lines' }]);
		expect(res.redirect).to.have.been.calledWith('/poems/add');
	});

	it('Should post trimmed and escaped poem', async () => {
		req.body.content = 'a&<>\r\n'.repeat(5);

		await postPoem(req, res);

		expect(Poem.create).to.have.been.calledWith({
			title: 'poem',
			content: `${'a&amp;&lt;&gt;\r\n'.repeat(4)}a&amp;&lt;&gt;`,
			user: '2983928398'
		});
		expect(req.flash).to.not.have.been.called;
		expect(res.redirect).to.have.been.calledWith('/');
	});
});
