function graficar() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
         if (this.readyState == 4 && this.status == 200) {
             alert(this.responseText);
             UI_GenerarAST(this.responseText);
         }
    };
    xhttp.open("GET", "http://localhost:3000/grafica?linea="+graficaast, true);
    xhttp.setRequestHeader("Access-Control-Allow-Credentials","true");
    xhttp.send();
}