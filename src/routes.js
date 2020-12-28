const { request, response } = require('express');

const routes = require('express').Router();
const multer = require('multer');
const multerConfig = require('./config/multer');

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const mp3Duration = require('mp3-duration');

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

routes.get('/all', (request, response) => {
	db.all("SELECT * FROM songs", (error, value) => {
		if (error) {
			throw error;
		}

		return response.json(value)
	});
});

routes.post('/music', multer(multerConfig).single('file'), async (request, response) => {
	// Pegando duração da musica 
	let fileDuration = 0;
	fileDuration = await mp3Duration(`./uploads/${request.file.filename}`, function (err, duration) {
		if (err) return console.log(err.message);

		return duration;
	  });

	let query = `INSERT INTO songs ('name', 'artist', 'album', 'duration', 'image', 'file')
	VALUES ('${request.body.name}', '${request.body.artist}', '${request.body.album}', '${fileDuration}', '${request.body.image}','${request.file.filename}')`;

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