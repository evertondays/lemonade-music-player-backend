const sqlite3 = require('sqlite3');

var fs = require('fs');
var dir = './database';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

const db = new sqlite3.Database('./database/database.sqlite');

db.run(`
CREATE TABLE IF NOT EXISTS "songs" (
	"id"	INTEGER NOT NULL,
	"name"	TEXT NOT NULL,
	"artist"	TEXT NOT NULL,
	"album"	TEXT NOT NULL,
	"duration"	REAL NOT NULL,
	"image"	TEXT NOT NULL,
	"file"	TEXT NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);
`);

db.run(`
CREATE TABLE IF NOT EXISTS "playlist_song" (
	"id"	INTEGER NOT NULL,
	"playlist_id"	INTEGER NOT NULL,
	"song_id"	INTEGER NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);
`)

db.run(`
CREATE TABLE IF NOT EXISTS "playlists" (
	"id"	INTEGER NOT NULL,
	"name"	TEXT NOT NULL,
	"description"	TEXT NOT NULL,
	"image"	TEXT NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);
`);

console.clear();
console.log('Okay, tudo pronto! ;)');