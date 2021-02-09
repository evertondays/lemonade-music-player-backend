const routes = require('express').Router();

// Banco de dados
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./src/database/database.sqlite');

routes.get('/playlist/:id', (request, response) => {

	let id = request.params.id;

	db.all("SELECT * FROM playlist_song WHERE playlist_id = ?", [id],  (error, value) => {
		if (error) {
			console.log(error);
		}

		let songsQuery = '';
		if(value.length != 0){
			value.forEach((item, i) => {
				if (i != 0){
					songsQuery += ` OR id = ${item.song_id}`
				} else {
					songsQuery += `id = ${item.song_id}`
				}
			})

		} else {
			return response.json([]);
		}

		console.log(`SELECT * FROM songs WHERE ${songsQuery}`)

		db.all(`SELECT * FROM songs WHERE ${songsQuery}`, (error, value) => {
			if (error) {
				console.log(error);
			}
			
			return response.json(value);
		})
	});
});

routes.get('/playlist-info/:id', (request, response) => {
	let id = request.params.id;

	db.all("SELECT * FROM playlists WHERE id = ?", [id], (error, value) => {
		if (error) {
			console.log(error);
			return response.json({message: 'Error 500'})
		}
		
		return response.json(value);
	})
});

// Criar playlist
routes.post('/playlist/create', (request, response) => {	
	db.run("INSERT INTO playlists ('name', 'description', 'image') VALUES (?, ?, ?)",
		[request.body.name, request.body.description, request.body.image]);

	return response.json({ message: 'Okay, playlist criada com sucesso!' })
});

// Adiciona musica a uma playlist
routes.post('/add-song-playlist/:playlist_id/:song_id', (request, response) => {
	db.run("INSERT INTO playlist_song ('playlist_id', 'song_id') VALUES (?, ?)",
		[request.params.playlist_id, request.params.song_id]);

	return response.json({ message: 'Okay' })
});

// Remove musica de uma playlist
routes.delete('/remove-song-playlist/:playlist_id/:song_id', (request, response) => {
	db.run("DELETE FROM playlist_song WHERE playlist_id = ? AND song_id = ?", 
		[request.params.playlist_id, request.params.song_id]);

	return response.json({ message: 'Okay' })
});

// Lista todas as playlist
routes.get('/all-playlists', (request, response) => {
	db.all("SELECT * FROM playlists", (error, value) => {
		if (error) {
			console.log(error);
			return response.json({message: 'Error 500'})
		}

		return response.json(value)
	});
});

routes.delete('/delete-playlist/:id', (request, response) => {
	db.run(`DELETE FROM playlists WHERE id = ?`, [request.params.id]);

	return response.json({ message: 'Playlist deletada' })
});

module.exports = routes;