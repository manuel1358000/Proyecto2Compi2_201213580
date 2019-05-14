
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
    agregarHeap();
    agregarStack();
}
function btn_compilar(){
    lista_temporales="";
    scanDataSimbolos();
    conteo=0;
    codigo=0;
    //SECCION DONDE SE INICIALIZAN LOS VALORES DE DYNAMO
    conditionalDeleteAST();  
    scanData2();
    
    indice_errores=0;
    cont_e=-1;
    pool_salida=[];
   
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
    codigo3d=ejecutar(ast);
    codigo3d+=generaImpresion();
    codigo3d+=doubleString();
    codigo3d+=obtenerInt();
    codigo3d+=enteroString();
    codigo3d+=generaImpresion2();
    lista_temporales="var heap[];\nvar stack[];\nvar h="+(conteo+1)+";\nvar p="+(conteo+1)+";\n"+lista_temporales;
    codigo3d=lista_temporales+";\n"+codigo3d;
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
    //graficarArbol(ast);
    agregarSimbolosDinamo();
}


function agregarElementosErrores(){
    for(var i=0;i<lista_errores.length;i++){
        createElementoErrores(lista_errores[i].indice_errores,lista_errores[i].tipo,lista_errores[i].descripcion,lista_errores[i].linea,lista_errores[i].columna);
    }
    if(lista_errores.length==0){
        scanData();
    }
    alert("Cargando Reporte");
    anidarErrores();
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

function agregarHeap(){
    var tabla_heap=document.getElementById("cuerpo_heap");
    tabla_heap.innerHTML="";
    var fila="";
    for(var i=0;i<heap.length;i++){
        if(heap[i]==null){
            fila+="<tr>";
            fila+="<td>"+i+"</td>";
            fila+="<td></td>";
            fila+="</tr>";
        }else{
            fila+="<tr>";
            fila+="<td>"+i+"</td>";
            fila+="<td>"+heap[i]+"</td>";
            fila+="</tr>";
        }
    }
    tabla_heap.insertAdjacentHTML('beforeend',fila);
}
function agregarStack(){
    var tabla_stack=document.getElementById("cuerpo_stack");
    tabla_stack.innerHTML="";
    var fila="";
    for(var i=0;i<stack.length;i++){
        if(stack[i]==null){
            fila+="<tr>";
            fila+="<td>"+i+"</td>";
            fila+="<td></td>";
            fila+="</tr>";
        }else{
            fila+="<tr>";
            fila+="<td>"+i+"</td>";
            fila+="<td>"+stack[i]+"</td>";
            fila+="</tr>";
        }
    }
    tabla_stack.insertAdjacentHTML('beforeend',fila);
}

function agregarTablaSimbolos(entorno){
    var tabla=document.getElementById("cuerpo_tabla");
    tabla.innerHTML = "";
    var fila="";
    for(var e=entorno;e!=null;e=e.padre){
        for(var clave in e.tabla.valores) {
            if(typeof e.tabla.valores[clave]!="undefined"){
                lista_tabla_simbolo.push(e.tabla.valores[clave]);
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

var temp_grafica="";

function graficarArbol(lista_clases){
    temp_grafica="";
    temp_grafica +="digraph lista{\n rankdir=TB; \nnode [shape = box,color=red]; \n";
    for(var i=0;i<lista_clases.length;i++){
        crearAST(lista_clases[i]);
    }
    temp_grafica+="\n}";
    graficaast=temp_grafica;
    createElementoAST(temp_grafica);  
}

function crearAST(nodoraiz){
    if(nodoraiz instanceof Declaracionclase){
        temp_grafica+="struct"+nodoraiz.codigo+"[label=\" CLASE "+nodoraiz.id+"\"];\n";
        for(var i=0;i<nodoraiz.nodos.length;i++){
            temp_grafica+="struct"+nodoraiz.codigo+"->"+"struct"+nodoraiz.nodos[i].codigo+";\n";
        }
        for(var i=0;i<nodoraiz.nodos.length;i++){
            var hijo=nodoraiz.nodos[i];
            crearAST(hijo);
        }
    }else if(nodoraiz instanceof Aritmetica){
        temp_grafica+="struct"+nodoraiz.codigo+"[label=\"ARITMETICA\"];\n";
    }else if(nodoraiz instanceof Logica){
        temp_grafica+="struct"+nodoraiz.codigo+"[label=\"LOGICA\"];\n";
    }else if(nodoraiz instanceof Relacional){
        temp_grafica+="struct"+nodoraiz.codigo+"[label=\"RELACIONAL\"];\n";
    }else if(nodoraiz instanceof Ternario){
        temp_grafica+="struct"+nodoraiz.codigo+"[label=\"TERNARIO\"];\n";
    }else if(nodoraiz instanceof Llamada_Metodo){
        temp_grafica+="struct"+nodoraiz.codigo+"[label=\"LLAMADA METODO\"];\n";
    }else if(nodoraiz instanceof Retorno){
        temp_grafica+="struct"+nodoraiz.codigo+"[label=\"RETORNO\"];\n";
    }else if(nodoraiz instanceof Mientras){
        temp_grafica+="struct"+nodoraiz.codigo+"[label=\"MIENTRAS\"];\n";
        temp_grafica+="struct"+nodoraiz.codigo+"->"+"struct"+nodoraiz.condicion.codigo+";\n";
        crearAST(nodoraiz.condicion);
        for(var i=0;i<nodoraiz.nodos.length;i++){
            temp_grafica+="struct"+nodoraiz.codigo+"->"+"struct"+nodoraiz.nodos[i].codigo+";\n";
        }
        for(var i=0;i<nodoraiz.nodos.length;i++){
            var hijo=nodoraiz.nodos[i];
            crearAST(hijo);
        }
    }else if(nodoraiz instanceof Para){
        temp_grafica+="struct"+nodoraiz.codigo+"[label=\"PARA\"];\n";
        temp_grafica+="struct"+nodoraiz.codigo+"->"+"struct"+nodoraiz.inicializado.codigo+";\n";
        crearAST(nodoraiz.inicializado);
        temp_grafica+="struct"+nodoraiz.codigo+"->"+"struct"+nodoraiz.condicion.codigo+";\n";
        crearAST(nodoraiz.condicion);
        temp_grafica+="struct"+nodoraiz.codigo+"->"+"struct"+nodoraiz.aumento.codigo+";\n";
        crearAST(nodoraiz.aumento);
        for(var i=0;i<nodoraiz.nodos.length;i++){
            temp_grafica+="struct"+nodoraiz.codigo+"->"+"struct"+nodoraiz.nodos[i].codigo+";\n";
        }
        for(var i=0;i<nodoraiz.nodos.length;i++){
            var hijo=nodoraiz.nodos[i];
            crearAST(hijo);
        }
    }else if(nodoraiz instanceof Caso){
        temp_grafica+="struct"+nodoraiz.codigo+"[label=\"CASE\"];\n";
        temp_grafica+="struct"+nodoraiz.codigo+"->"+"struct"+nodoraiz.condicion.codigo+";\n";
        crearAST(nodoraiz.condicion);
        for(var i=0;i<nodoraiz.nodos.length;i++){
            temp_grafica+="struct"+nodoraiz.codigo+"->"+"struct"+nodoraiz.nodos[i].codigo+";\n";
        }
        for(var i=0;i<nodoraiz.nodos.length;i++){
            var hijo=nodoraiz.nodos[i];
            crearAST(hijo);
        }
    }else if(nodoraiz instanceof Selecciona){
        temp_grafica+="struct"+nodoraiz.codigo+"[label=\"SELECCIONA\"];\n";
        temp_grafica+="struct"+nodoraiz.codigo+"->"+"struct"+nodoraiz.condicion.codigo+";\n";
        crearAST(nodoraiz.condicion);
        for(var i=0;i<nodoraiz.lista_cases.length;i++){
            temp_grafica+="struct"+nodoraiz.codigo+"->"+"struct"+nodoraiz.lista_cases[i].codigo+";\n";
        }
        for(var i=0;i<nodoraiz.lista_cases.length;i++){
            var hijo=nodoraiz.lista_cases[i];
            crearAST(hijo);
        }
        if(nodoraiz.defecto!=null){
            temp_grafica+="struct"+nodoraiz.codigo+"->"+"struct"+nodoraiz.defecto.codigo+";\n";
            temp_grafica+="struct"+nodoraiz.defecto.codigo+"[label=\"DEFECTO\"];\n";
        }
        
    }else if(nodoraiz instanceof Si){
        temp_grafica+="struct"+nodoraiz.codigo+"[label=\"SI\"];\n";
        temp_grafica+="struct"+nodoraiz.codigo+"->"+"struct"+nodoraiz.condicion.codigo+";\n";
        crearAST(nodoraiz.condicion);
        for(var i=0;i<nodoraiz.nodos.length;i++){
            temp_grafica+="struct"+nodoraiz.codigo+"->"+"struct"+nodoraiz.nodos[i].codigo+";\n";
        }
        for(var i=0;i<nodoraiz.nodos.length;i++){
            var hijo=nodoraiz.nodos[i];
            crearAST(hijo);
        }
        for(var i=0;i<nodoraiz.subifs.length;i++){
            temp_grafica+="struct"+nodoraiz.codigo+"->"+"struct"+nodoraiz.subifs[i].codigo+";\n";
        }
        for(var i=0;i<nodoraiz.subifs.length;i++){
            var hijo=nodoraiz.subifs[i];
            crearAST(hijo);
        }
        if(nodoraiz.defecto!=null){
            temp_grafica+="struct"+nodoraiz.codigo+"->"+"struct"+nodoraiz.defecto.codigo+";\n";
            temp_grafica+="struct"+nodoraiz.defecto.codigo+"[label=\"DEFECTO\"];\n";
        }
    }else if(nodoraiz instanceof Subsi){
        temp_grafica+="struct"+nodoraiz.codigo+"[label=\"SI\"];\n";
        temp_grafica+="struct"+nodoraiz.codigo+"->"+"struct"+nodoraiz.condicion.codigo+";\n";
        crearAST(nodoraiz.condicion);
        for(var i=0;i<nodoraiz.nodos.length;i++){
            temp_grafica+="struct"+nodoraiz.codigo+"->"+"struct"+nodoraiz.nodos[i].codigo+";\n";
        }
        for(var i=0;i<nodoraiz.nodos.length;i++){
            var hijo=nodoraiz.nodos[i];
            crearAST(hijo);
        }
    }else if(nodoraiz instanceof Asignacion){
        temp_grafica+="struct"+nodoraiz.codigo+"[label=\" ASIGNACION\"];\n";
    }else if(nodoraiz instanceof AsignacionArreglos){
        temp_grafica+="struct"+nodoraiz.codigo+"[label=\" ASIGNACION ARREGLO\"];\n";
    }else if(nodoraiz instanceof Declaracion){
        temp_grafica+="struct"+nodoraiz.codigo+"[label=\" DECLARACION\"];\n";
    }else if(nodoraiz instanceof DeclaracionArreglos){
        temp_grafica+="struct"+nodoraiz.codigo+"[label=\" DECLARACION ARREGLO\"];\n";
    }else if(nodoraiz instanceof Detener){
        temp_grafica+="struct"+nodoraiz.codigo+"[label=\" DETENER\"];\n";
    }else if(nodoraiz instanceof Este){
        temp_grafica+="struct"+nodoraiz.codigo+"[label=\"THIS\"];\n";
    }else if(nodoraiz instanceof Imprimir){
        temp_grafica+="struct"+nodoraiz.codigo+"[label=\"IMPRIMIR\"];\n";
        temp_grafica+="struct"+nodoraiz.codigo+"->"+"struct"+nodoraiz.expresion.codigo+";\n";
        var hijo=nodoraiz.expresion;
        crearAST(hijo);
    }else if(nodoraiz instanceof Metodo){
        temp_grafica+="struct"+nodoraiz.codigo+"[label=\"METODO "+nodoraiz.id+"\"];\n";
        for(var i=0;i<nodoraiz.nodos.length;i++){
            temp_grafica+="struct"+nodoraiz.codigo+"->"+"struct"+nodoraiz.nodos[i].codigo+";\n";
        }
        for(var i=0;i<nodoraiz.nodos.length;i++){
            var hijo=nodoraiz.nodos[i];
            crearAST(hijo);
        }
    }
}
