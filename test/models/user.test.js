const { expect } = require('chai');
const sinon = require('sinon');
const { testAccount } = require('../../helpers/testHelpers.test');
const User = require('../../models/User');

describe('User Model', () => {
	it('should create a new user', (done) => {
		const UserMock = sinon.mock(new User(testAccount));
		const user = UserMock.object;

		UserMock
			.expects('save')
			.yields(null);

		user.save((err) => {
			UserMock.verify();
			UserMock.restore();
			expect(err).to.be.null;
			done();
		});
	});

	it('should return error if user is not created', (done) => {
		const UserMock = sinon.mock(new User(testAccount));
		const user = UserMock.object;
		const expectedError = {
			name: 'ValidationError'
		};

		UserMock
			.expects('save')
			.yields(expectedError);

		user.save((err, result) => {
			UserMock.verify();
			UserMock.restore();
			expect(err.name).to.equal('ValidationError');
			expect(result).to.be.undefined;
			done();
		});
	});

	it('should not create a user with the unique email', (done) => {
		const UserMock = sinon.mock(User({
			...testAccount,
			userName: 'different user name'
		}));
		const user = UserMock.object;
		const expectedError = {
			name: 'MongoError',
			code: 11000
		};

		UserMock
			.expects('save')
			.yields(expectedError);

		user.save((err, result) => {
			UserMock.verify();
			UserMock.restore();
			expect(err.name).to.equal('MongoError');
			expect(err.code).to.equal(11000);
			expect(result).to.be.undefined;
			done();
		});
	});

	it('should not create a user with the unique user name', (done) => {
		const UserMock = sinon.mock(User({
			...testAccount,
			email: 'differentemail@gmail.com'
		}));
		const user = UserMock.object;
		const expectedError = {
			name: 'MongoError',
			code: 11000
		};

		UserMock
			.expects('save')
			.yields(expectedError);

		user.save((err, result) => {
			UserMock.verify();
			UserMock.restore();
			expect(err.name).to.equal('MongoError');
			expect(err.code).to.equal(11000);
			expect(result).to.be.undefined;
			done();
		});
	});

	it('should find user by email', (done) => {
		const userMock = sinon.mock(User);
		const expectedUser = testAccount;
		const { email } = expectedUser;
		userMock
			.expects('findOne')
			.withArgs({ email })
			.yields(null, expectedUser);

		User.findOne({ email }, (err, result) => {
			userMock.verify();
			userMock.restore();
			expect(result.email).to.equal(email);
			done();
		});
	});

	it('should remove user by email', (done) => {
		const userMock = sinon.mock(User);
		const expectedResult = {
			nRemoved: 1
		};
		const { email } = testAccount;

		userMock
			.expects('remove')
			.withArgs({ email })
			.yields(null, expectedResult);

		User.remove({ email }, (err, result) => {
			userMock.verify();
			userMock.restore();
			expect(err).to.be.null;
			expect(result.nRemoved).to.equal(1);
			done();
		});
	});

	it('should check password', (done) => {
		const UserMock = sinon.mock(new User(testAccount));

		const user = UserMock.object;

		user.comparePassword('root', (err, isMatched) => {
			expect(err).to.equal(undefined);
			expect(isMatched).to.equal(true);
		});
		done();
	});
});
