

var cont_e=-1;
var cont_s=-1;
/** FUNCION QUE SE MANDA A LLAMAR PARA COMPILAR EL AREA ACTUAL*/
function generarEtiqueta(){
    cont_e++;
    if(cont_e==0){
        lista_temporales+="var t"+cont_e;
    }else{
        lista_temporales+=",t"+cont_e;
    }
    return "t"+cont_e;

}
function generarSalto(){
    cont_s++;
    return "L"+cont_s;
}
function btn_guardar(){
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
    cont_e=-1;
    cont_s=-1;
    var nombre_modal=document.getElementById("nombre_archivo");
    descargarArchivo(generarTexto(cm.getValue()),nombre_modal.value);
    nombre_modal.value="";    
}
function generarTexto(datos) {
    var texto = [];
    texto.push(datos);
    texto.push('\n');
    //El contructor de Blob requiere un Array en el primer parámetro
    //así que no es necesario usar toString. el segundo parámetro
    //es el tipo MIME del archivo
    return new Blob(texto, {
        type: 'text/plain'
    });
};
function descargarArchivo(contenidoEnBlob,nombreArchivo){
        var reader = new FileReader();
        reader.onload = function (event) {
            var save = document.createElement('a');
            save.href = event.target.result;
            save.target = '_blank';
            save.download = nombreArchivo || 'archivo.dat';
            var clicEvent = new MouseEvent('click', {
                'view': window,
                    'bubbles': true,
                    'cancelable': true
            });
            save.dispatchEvent(clicEvent);
            (window.URL || window.webkitURL).revokeObjectURL(save.href);
        };
        reader.readAsDataURL(contenidoEnBlob);
}

function btn_3dcompilar(){
    limpiarConsola();
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
    var ast3d=parser3d.parse(cm.getValue());
    ejecutar3D(ast3d);
    alert("Finalizo el analisis");
}
function btn_compilar(){
    cont_e=-1;
    lista_temporales="var heap[];\nvar stack[];\nvar h=0;\nvar p=0;\n";
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
    /*
    var codigo3d=ejecutar(ast);
    codigo3d+=generaImpresion();
    codigo3d+=doubleString();
    codigo3d+=obtenerInt();
    codigo3d+=enteroString();
    codigo3d+=generaImpresion2();
    codigo3d=lista_temporales+";\n"+codigo3d;
    */
    var elementoNav=document.querySelector("#nav_pesta > li.active >a");
    var nombrenuevo=elementoNav.innerHTML;
    var elementos2=nombrenuevo.split(".");
    if(elementos2.length==2){
        nombrenuevo=elementos2[0];
    }
    crearPesta(nombrenuevo+"_3D");
    var elementoDiv2=document.querySelector("#contenedor_pesta > div.active");
    //vamos a traer el area de texto para poder enviarle la informacion al parser
    var elementos2=elementoDiv2.id.split("_");
    var indice2=elementos2[1];
    if(indice2==1){
        indice2=indice2-1;
    }else if(indice2>1){
        indice2=indice2-3;
    }
    agregar_contenido(codigo3d,indice2);
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


function anidarErrores(){
    var tabla=document.getElementById("cuerpo_tabla_errores");
    tabla.innerHTML = "";
    var fila="";
    for(var i=0;i<lista_errores.length;i++){
        fila+="<tr>";
        fila+="<td>"+lista_errores[i].tipo+"</td>";
        fila+="<td>"+lista_errores[i].descripcion+"</td>";
        fila+="<td>"+lista_errores[i].linea+"</td>";
        fila+="<td>"+lista_errores[i].columna+"</td>";
        fila+="</tr>";      
    }
    tabla.insertAdjacentHTML('beforeend',fila);
}

function agregarTablaSimbolos(entorno){
    var tabla=document.getElementById("cuerpo_tabla");
    tabla.innerHTML = "";
    var fila="";
    for(var e=entorno;e!=null;e=e.padre){
        for(var clave in e.tabla.valores) {
            if(typeof e.tabla.valores[clave]!="undefined"){
                fila+="<tr>";
                fila+="<td>"+clave+"</td>";
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
function limpiarConsola(){
    var consola=document.getElementById("consola");
    consola.value="";
}
function escribirConsola(contenido){
    var consola=document.getElementById("consola");
    consola.value+=contenido;
}
