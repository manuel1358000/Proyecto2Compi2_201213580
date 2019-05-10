
var express = require('express');
var app = express();
const fs = require('fs');
const path = require('path');
app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname+'/public/javascript/template/index.html'));
});

app.get('/grafica', function (req, res) {
    fs.writeFile("./public/static/hola.txt",req.query.linea, function (err) {
      // la funcion es la que maneja lo que sucede despues de termine el evento
      if (err) {
          return console.log(err);
      }
      console.log("Archivo Escrito");
    });
    res.send("http://localhost:3000/static/grafo.png");
})
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
