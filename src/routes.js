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

// ********
// Playlist
// ********
routes.get('/playlist/:id', (request, response, next) => {

	let id = request.params.id;

	db.all("SELECT * FROM playlist_song WHERE playlist_id = ?", [id], (error, value) => {
		if (error) {
			throw error;
		}

		return response.json(value)
	});
});


// Criar playlist
routes.post('/playlist/create', (request, response) => {
	let query = `INSERT INTO playlists ('name', 'description', 'image')
	VALUES ('${request.body.name}', '${request.body.description}', '${request.body.image}')`;
	
	db.run(query);

	return response.json({ message: 'Okay, playlist criada com sucesso!' })
});

// Adiciona musica a uma playlist
routes.post('/add-song-playlist/:playlist_id/:song_id', (request, response) => {
	let query = `INSERT INTO playlist_song ('playlist_id', 'song_id')
	VALUES ('${request.params.playlist_id}', '${request.params.song_id}')`;

	db.run(query);

	return response.json({ message: 'Okay' })
});

// Remove musica de uma playlist
routes.delete('/remove-song-playlist/:playlist_id/:song_id', (request, response) => {
	let query = `DELETE FROM playlist_song
	WHERE playlist_id = ${request.params.playlist_id} AND song_id = ${request.params.song_id}`;

	db.run(query);

	return response.json({ message: 'Okay' })
});

// Lista todas as playlist
routes.get('/all-playlists', (request, response) => {
	db.all("SELECT * FROM playlists", (error, value) => {
		if (error) {
			throw error;
		}

		return response.json(value)
	});
});

routes.delete('/delete-playlist/:id', (request, response) => {
	db.run(`DELETE FROM playlists WHERE id = ${request.params.id}`);

	return response.json({ message: 'Playlist deletada' })
});

module.exports = routes;