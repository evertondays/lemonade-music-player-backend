const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

module.exports = {
	dest: path.resolve(__dirname, '..', '..', 'uploads'),
	storage: multer.diskStorage({
		destination: (req, file, cb) => {
			cb(null, path.resolve(__dirname, "..", "..", "uploads"));
		},
		filename: (req, file, cb) => {
			crypto.randomBytes(16, (err, hash) => {
				if (err) cb(err);
		
				const fileName = `${hash.toString("hex")}.mp3`;
		
				cb(null, fileName);
			});
		}
	}),
	fileFilter: (req, file, cb) => {
		const allowedMimes = [
			'audio/mpeg'
		];

		if (allowedMimes.includes(file.mimetype)) {
			cb(null, true);
		} else {
			cb(new Error("Invalid file type."));
		}
	}
};