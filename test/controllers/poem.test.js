const { expect } = require('chai');
const { sanitizeHTML, getLineCount } = require('../../helpers/poemHelpers');

describe('Post poem', () => {
	it('Should correctly count lines', (done) => {
		const emptyPoem = '';
		const oneLinePoem = 'one line';
		const fiveLinePoem = '1\r\n2\r\n3\r\n4\r\n5';
		const sixLinePoem = '1\r\n2\r\n3\r\n4\r\n5\r\n6';

		expect(getLineCount(emptyPoem)).to.equal(1);
		expect(getLineCount(oneLinePoem)).to.equal(1);
		expect(getLineCount(fiveLinePoem)).to.equal(5);
		expect(getLineCount(sixLinePoem)).to.equal(6);
		done();
	});

	it('Should replace "&," "<," and ">" with HTML entities', (done) => {
		let poem = 'here is a dangerous poem with spooky characters like &, <, and >';
		poem = sanitizeHTML(poem);

		expect(poem).to.equal('here is a dangerous poem with spooky characters like &amp;, &lt;, and &gt;');
		done();
	});
});
