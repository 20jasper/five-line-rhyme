# Five Line Rhyme
Five Line Rhyme is a full stack web app full of poems only 5 lines long.

**Link to project:** https://five-line-rhyme.up.railway.app/

![The home page of five line rhyme. There are a few user–submitted poems to read](https://user-images.githubusercontent.com/78604367/192157859-4262bdf5-cc72-4e23-8035-4666a210f82d.png) 

- [Five Line Rhyme](#five-line-rhyme)
	- [How It's Made:](#how-its-made)
	- [Optimizations](#optimizations)
	- [Lessons Learned:](#lessons-learned)
	- [Installation](#installation)
	- [Usage](#usage)
	- [Dependencies](#dependencies)
	- [Dev Dependencies](#dev-dependencies)
## How It's Made:

**Front end:** HTML, CSS, Bootstrap, JavaScript

**Back end:** Node, Express, Pug, MongoDB, Mongoose

Users can look at poems shared by others or create an account to post their own.

## Optimizations

I would like to add pagination as well as user profile pages and post pages to make sharing content created on the platform easier. A indicator for how many lines and characters there are would be very helpful to the user as well

## Lessons Learned:

I learned how to extend Pug layouts and use conditionals to set attributes. This project also taught me a lot about validating unique emails and user names. I learned how to update an existing user's profile. I learned how to populate posts with user information. I learned how to set defaults for keys in schemas. I learned how to use multer to handle file uploads.

## Installation
You can install the necessary dependencies with
```
npm install
```
Then create a file in the config folder called ".env" and add the following variables
```
MONGODB_URI
SESSION_SECRET
``` 

## Usage
Use ```npm run start``` to run the app normally and ```npm run dev``` to run the app in development mode
## Dependencies

```
"@fortawesome/fontawesome-free": "^6.1.1",
"@ladjs/bootstrap-social": "^7.0.2",
"@node-rs/bcrypt": "^1.6.0",
"@octokit/rest": "^18.12.0",
"axios": "^0.27.2",
"body-parser": "^1.19.2",
"bootstrap": "^5.1.3",
"chalk": "^5.0.1",
"compression": "^1.7.4",
"connect-mongo": "^4.6.0",
"dotenv": "^16.0.0",
"errorhandler": "^1.5.1",
"express": "^4.17.3",
"express-flash": "^0.0.2",
"express-handlebars": "^6.0.3",
"express-session": "^1.17.2",
"jquery": "^3.6.0",
"lodash": "^4.17.21",
"lusca": "^1.7.0",
"mailchecker": "^4.1.14",
"moment": "^2.29.1",
"mongoose": "^6.2.8",
"morgan": "^1.10.0",
"multer": "^1.4.4",
"node-sass": "^7.0.1",
"node-sass-middleware": "^1.0.1",
"nodemailer": "^6.7.3",
"nodemailer-sendgrid": "^1.0.3",
"passport": "^0.5.2",
"passport-github2": "^0.1.12",
"passport-local": "^1.0.0",
"passport-oauth": "^1.0.0",
"passport-oauth2-refresh": "^2.1.0",
"passport-openid": "^0.4.0",
"passport-twitter": "^1.0.4",
"popper.js": "^1.16.1",
"pug": "^3.0.2",
"twitter-lite": "^1.1.0",
"validator": "^13.7.0"
```

## Dev Dependencies
```
"chai": "^4.3.6",
"eslint": "^8.12.0",
"eslint-config-airbnb-base": "^15.0.0",
"eslint-plugin-chai-friendly": "^0.7.2",
"eslint-plugin-import": "^2.25.4",
"mocha": "^9.2.2",
"mongodb-memory-server": "^8.4.1",
"nodemon": "^2.0.19",
"nyc": "^15.1.0",
"sinon": "^13.0.1",
"supertest": "^6.2.2"
```
