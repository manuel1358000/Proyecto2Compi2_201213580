//tener cuidado con el nombre de las variales
//aqui vamos a manejar todo lo de la interfaz

/** funcion que agrega una pestaña nueva al editor de texto */
var editor;
function crearPesta(nombre){
    if(nombre==null){
        var nombre_modal=document.getElementById("nombre_pesta");
        nombre=nombre_modal.value;    
    }
    var d=new Date();
    var n=d.getTime();
    var content=document.getElementById("contenedor_pesta");
    var nav=document.getElementById("nav_pesta");
    var elemento=document.querySelector('#nav_pesta > li.active');
    elemento.className="";
    var elementoDiv=document.querySelector("#contenedor_pesta > div.active");
    elementoDiv.className="tab-pane fade";
    var indice="pesta_"+(content.childNodes.length+1)+"_input"; 
    var compo_li="<li class=\"active\"><a data-toggle=\"pill\" href=\"#pesta_"+(content.childNodes.length+1)+"\">"+nombre+"</a></li>";
    nav.insertAdjacentHTML('beforeend',compo_li);
    var text_area="<div id=\"pesta_"+(content.childNodes.length+1)+"\" class=\"tab-pane fade in active\">"+
                    "<textarea class=\"form-control rounded-0\" id=\"pesta_"+(content.childNodes.length+1)+"_input\" type=\"text\" cols=\"120\" rows=\"30\"></textarea>"+
                  "</div>";
    content.insertAdjacentHTML('beforeend',text_area);
    settextarea(indice);
    return content.childNodes.length-3;
}
function settextarea(id){
    editor=CodeMirror.fromTextArea(document.getElementById(id), {
                mode: "text/x-java",
                continuosScanning:500,
                lineNumbers : true,
                matchBrackets : true,
                lineWrapping:true,
                height:"350px",
                gutter:true,
                });   
}
function cerrarPesta(){
    var content=document.getElementById("contenedor_pesta");
    var nav=document.getElementById("nav_pesta");
    var elemento_tab=document.querySelector('#nav_pesta > li.active');
    var elemento_campo=document.querySelector("#contenedor_pesta > div.active");
    if(elemento_campo.id!="pesta_1"){
        elemento_tab.remove();
        elemento_campo.remove();
        var nav2=document.getElementById("pesta_1");
        nav2.className="tab-pane fade active show in";
        var nav3=document.getElementById("nav_inicio");
        nav3.className="active";
        
    }else{
        alert("Esta pesta;a no de puede eliminar");
    }
}

