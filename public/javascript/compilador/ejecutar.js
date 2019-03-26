
/** FUNCION QUE SE MANDA A LLAMAR PARA COMPILAR EL AREA ACTUAL*/
function btn_compilar(){
    //vamos a traer al activo del contenedor
    var elementoDiv=document.querySelector("#contenedor_pesta > div.active");
    //vamos a traer el area de texto para poder enviarle la informacion al parser
    var area_texto=document.getElementById(elementoDiv.id+"_input");
    var ast=calculadora.parse("static public int a,b,c,d,f[][]=5;");
    for(var i=0;i<ast.length;i++){
        ejecutar(ast[i]);
    }

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

