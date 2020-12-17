const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');

const app = express();

const port = 3333;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/song', express.static(path.resolve(__dirname, '..', 'uploads')));

app.use(require('./routes'));
app.listen(port);

/* Mensagem de log */
console.log(require('./message'));