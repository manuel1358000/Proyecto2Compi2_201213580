function ejecutar(nodoast){
    var entorno=new Entorno(null);
    if(nodoast instanceof Declaracion){
        alert("Asignacion, Modificadores "+nodoast.modificadores.length+" Tipo "+nodoast.tipo+" dimensiones "+nodoast.dimensiones);
        if(nodoast.iniValue instanceof Aritmetica){
            alert("Es una aritmetica");        
        }
    }else{
        alert("Es cualquiera otra instancia");
    }
}


function imprimirentorno(entorno){
    var simbolo=entorno.obtener("a");
    console.log(simbolo.tipo);
}
