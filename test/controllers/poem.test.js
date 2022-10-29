const { expect } = require('chai');
const { sanitizeHTML } = require('../../helpers/poemHelpers');

describe('Post poem', () => {
	it('Should replace "&," "<," and ">" with HTML entities', (done) => {
		let poem = 'here is a dangerous poem with spooky characters like &, <, and >';
		poem = sanitizeHTML(poem);

		expect(poem).to.equal('here is a dangerous poem with spooky characters like &amp;, &lt;, and &gt;');
		done();
	});
});
