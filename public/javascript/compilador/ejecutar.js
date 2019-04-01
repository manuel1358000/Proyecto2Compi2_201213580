

var cont_e=-1;
var cont_s=-1;
/** FUNCION QUE SE MANDA A LLAMAR PARA COMPILAR EL AREA ACTUAL*/
function generarEtiqueta(){
    cont_e++;
    return "t"+cont_e;

}
function generarSalto(){
    cont_s++;
    return "L"+cont_s;
}

function btn_compilar(){
    
    cont_e=-1;
    //vamos a traer al activo del contenedor
    var elementoDiv=document.querySelector("#contenedor_pesta > div.active");
    //vamos a traer el area de texto para poder enviarle la informacion al parser
    var elementos=elementoDiv.id.split("_");
    var indice=elementos[1];
    if(indice==1){
        indice=indice-1;
    }else if(indice>1){
        indice=indice-3;
    }
    var cm = $('.CodeMirror')[indice].CodeMirror;
    var ast=calculadora.parse(cm.getValue());
    cont_e=-1;
    cont_s=-1;
    ejecutar(ast);
    alert("Se finalizo la ejecucion");
}

function processFiles(files) {
    var file = files[0];
    var indice=crearPesta(file.name);
    var reader = new FileReader();
    reader.onload = function (e) {
        agregar_contenido(e.target.result,indice);
    };
    reader.readAsText(file);
}

function agregar_contenido(contenido,indice){
    var cm = $('.CodeMirror')[indice].CodeMirror;
    var doc = cm.getDoc();
    var cursor=doc.getCursor(); // get the line contents
    doc.replaceRange(contenido, cursor);

}

function agregarTablaSimbolos(entorno){
    var tabla=document.getElementById("cuerpo_tabla");
    tabla.innerHTML = "";
    var fila="";
    for(var e=entorno;e!=null;e=e.padre){
        for(var clave in e.tabla.valores) {
            if(typeof e.tabla.valores[clave]!="undefined"){
                fila+="<tr>";
                //fila+="<td>"+clave+"</td>";
                fila+="<td>"+e.tabla.valores[clave].nombre+"</td>";
                fila+="<td>"+e.tabla.valores[clave].tipo+"</td>";
                fila+="<td>"+e.tabla.valores[clave].ambito+"</td>";
                fila+="<td>"+e.tabla.valores[clave].rol+"</td>";
                fila+="<td>"+e.tabla.valores[clave].posRel+"</td>";
                fila+="<td>"+e.tabla.valores[clave].tamanio+"</td>";
                fila+="<td>"+e.tabla.valores[clave].dim+"</td>";
                fila+="<td>"+e.tabla.valores[clave].visibilidad+"</td>";
                var modificadores="";
                for(var f=0;f<e.tabla.valores[clave].modificadores.length;f++){
                    modificadores+=e.tabla.valores[clave].modificadores[f]+"-";
                }
                modificadores = modificadores.substring(0,modificadores.length-1);
                fila+="<td>"+modificadores+"</td>";
                fila+="<td>"+e.tabla.valores[clave].inicializado+"</td>"
                fila+="<td>"+e.tabla.valores[clave].extiende+"</td>";
                fila+="</tr>";
            }
        }
    }
    tabla.insertAdjacentHTML('beforeend',fila);
}


