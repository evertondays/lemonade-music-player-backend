const { request, response } = require('express');

const routes = require('express').Router();
const multer = require('multer');
const multerConfig = require('./config/multer');

// Banco de dados
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./src/database/database.sqlite');

routes.post('/music', multer(multerConfig).single('file'), (request, response) => {
	let query = `INSERT INTO songs ('name', 'artist', 'album', 'image', 'file')
	VALUES ('${request.body.name}', '${request.body.artist}', '${request.body.album}', '${request.body.image}','${request.file.filename}')`;

	db.run(query);

	console.log(request.file)
	return response.json({ message: query })
});

module.exports = routes;