const port = 3333;

var date = new Date();
var logDate = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

console.clear()

module.exports = `O servidor está no ar!\n\n  + Porta: ${port}\n  + Url: http://localhost:${port}/\n  + Feito por: Everton Dias\n\n-> Ultima atualização às ${logDate}\n`;