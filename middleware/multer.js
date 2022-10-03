const multer = require('multer');
const path = require("path");

const upload = multer({
	storage: multer.diskStorage({}),
	fileFilter: (req, file, cb) => {
		let ext = path.extname(file.originalname);
		if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png" && ext !== ".webp") {
			//cb is callback for multer, 2nd param means don't include file
			cb(new Error("File type is not supported"), false);
			return;
		}
		//cb is callback for multer, 2nd param means do include file
		cb(null, true);
	},
});

module.exports = upload;