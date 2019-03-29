function ejecutar(nodoast){
    var entorno=new Entorno(null);
    if(nodoast instanceof Declaracionclase){
        //nombre,tipo,ambito,rol,porRel,tamanio,tamdimensiones,visibilidad,modificadores
        var sim=new Simbolo(nodoast.id,Type.CLASE,"GLOBAL",Type.CLASE,0,nodoast.gettamClase(),0,nodoast.getVisibilidad(),nodoast.modificadores);
        entorno.agregar(nodoast.id,sim);
        nodoast.execute(entorno);
    }else if(nodoast instanceof Aritmetica){
        var resultado=nodoast.getValue(entorno);
        console.log(resultado.cadena);
        console.log("El temporal del heap es "+resultado.u_etiqueta);
    }else if(nodoast instanceof Relacional){
        var resultado=nodoast.getValue(entorno);
        console.log(resultado.cadena);
        console.log("El temporal del heap es "+resultado.u_etiqueta);
    }else if(nodoast instanceof Logica){

    }else{
        alert("Es una instancia rara");
    }
}

function imprimirentorno(entorno){
    var simbolo=entorno.obtener("a");
    console.log(simbolo.tipo);
}

