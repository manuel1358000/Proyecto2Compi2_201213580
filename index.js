
var express = require('express');
var app = express();
const fs = require('fs');
var exec = require('child_process').exec;
const path = require('path');
var cmd = '\"C:\\Program Files (x86)\\Graphviz2.38\\bin\\dot.exe" -Tjpg ./public/static/hola.txt -o ./public/static/grafo1.png';
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
    
    exec(cmd, function(error, stdout, stderr) {
    // command output is in stdout
      console.log(error);
    });
    res.send("http://localhost:3000/static/grafo1.png");
})
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
