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
    for(var i=0;i<ast.length;i++){
        ejecutar(ast[i]);
    }
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

