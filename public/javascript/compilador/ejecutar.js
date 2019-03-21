function btn_compilar(){
    //vamos a traer al activo del contenedor
    var elementoDiv=document.querySelector("#contenedor_pesta > div.active");
    //vamos a traer el area de texto para poder enviarle la informacion al parser
    var area_texto=document.getElementById(elementoDiv.id+"_input");
    calculadora.parse(area_texto.value);
}