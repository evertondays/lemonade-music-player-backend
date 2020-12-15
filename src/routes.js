const { request, response } = require('express');

const routes = require('express').Router();
const multer = require('multer');
const multerConfig = require('./config/multer');

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

// Banco de dados
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./src/database/database.sqlite');

routes.get('/music/:id', (request, response) => {
	let id = request.params.id;

	db.get("SELECT * FROM songs WHERE id = ?", [id], (error, value) => {
		if (error) {
			throw error;
		}
		
		return response.json(value)
	});
});

routes.get('/music/all', (request, response) => {
	db.all("SELECT * FROM songs", (error, value) => {
		if (error) {
			throw error;
		}

		return response.json(value)
	});
});

routes.post('/music', multer(multerConfig).single('file'), (request, response) => {
	let query = `INSERT INTO songs ('name', 'artist', 'album', 'image', 'file')
	VALUES ('${request.body.name}', '${request.body.artist}', '${request.body.album}', '${request.body.image}','${request.file.filename}')`;

	db.run(query);

	console.log(request.file)
	return response.json({ message: 'Okay, gravado com sucesso!' })
});

routes.delete('/music/:id', (request, response) => {
	let id = request.params.id;

	db.get("SELECT file FROM songs WHERE id = ?", [id], (error, value) => {
		if (error) {
			throw error;
		}

		promisify(fs.unlink)(
			path.resolve(__dirname, '..', 'uploads', value.file)
		);
	});

	db.run(`DELETE FROM songs WHERE id = ${id}`);

	return response.json({ message: 'Musica deletada' })
});

module.exports = routes;