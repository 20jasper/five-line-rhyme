const { expect } = require('chai');
const sinon = require('sinon');
const { testPoem } = require('../../helpers/testHelpers.test');
const Poem = require('../../models/Poem');

describe('Poem Model', () => {
	it('should create a new poem', (done) => {
		const PoemMock = sinon.mock(new Poem(testPoem));
		const poem = PoemMock.object;

		PoemMock
			.expects('save')
			.yields(null);

		poem.save((err) => {
			PoemMock.verify();
			PoemMock.restore();
			expect(err).to.be.null;
			done();
		});
	});

	it('should return error if poem is not created', (done) => {
		const PoemMock = sinon.mock(new Poem(testPoem));
		const poem = PoemMock.object;
		const expectedError = {
			name: 'ValidationError'
		};

		PoemMock
			.expects('save')
			.yields(expectedError);

		poem.save((err, result) => {
			PoemMock.verify();
			PoemMock.restore();
			expect(err.name).to.equal('ValidationError');
			expect(result).to.be.undefined;
			done();
		});
	});
});
