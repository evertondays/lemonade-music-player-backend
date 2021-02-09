const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');

const app = express();

// Config
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Rota de arquivos
app.use('/song', express.static(path.resolve(__dirname, '..', 'uploads')));

// Rotas da API
app.use(require('./routes/music'));
app.use(require('./routes/playlist'));

app.listen(3333);

/* Mensagem de log */
console.log(require('./message'));