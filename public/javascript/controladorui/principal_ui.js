//tener cuidado con el nombre de las variales
//aqui vamos a manejar todo lo de la interfaz
function crearPesta(){
    var d=new Date();
    var n=d.getTime();
    var content=document.getElementById("contenedor_pesta");
    var nav=document.getElementById("nav_pesta");
    var elemento=document.querySelector('#nav_pesta > li.active');
    elemento.className="";
    
    var elementoDiv=document.querySelector("#contenedor_pesta > div.active");
    elementoDiv.className="tab-pane fade";

    var compo_li="<li class=\"active\"><a data-toggle=\"pill\" href=\"#pesta_"+(content.childNodes.length+1)+"\">Archivo "+n+"</a></li>";
    nav.insertAdjacentHTML('beforeend',compo_li);
    var text_area="<div id=\"pesta_"+(content.childNodes.length+1)+"\" class=\"tab-pane fade in active\">"+
                    "<textarea class=\"form-control rounded-0\" id=\"pesta_text_"+(content.childNodes.length+1)+"_input\" rows=\"10\"></textarea>"+
                  "</div>";
    content.insertAdjacentHTML('beforeend',text_area);


}