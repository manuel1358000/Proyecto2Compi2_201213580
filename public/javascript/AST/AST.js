function ejecutar(nodoast,entorno){
    var respuesta="";
    var entorno=new Entorno(null);
    //primera pasada vamos a cargar todas las clases a la tabla de simbolos, son su contenido
    for(var i=0;i<nodoast.length;i++){
        cargarTablaSimbolos(nodoast[i],entorno,"GLOBAL",0);
    }
    /*
    for(var i=0;i<nodoast.length;i++){
        if(nodoast[i] instanceof Declaracionclase){
            //nombre,tipo,ambito,rol,porRel,tamanio,tamdimensiones,visibilidad,modificadores
            console.log("Paso por acui");
            respuesta=nodoast[i].execute(entorno);
        }else{
            alert("Es una instancia rara");
        }
    }
    */
    agregarTablaSimbolos(entorno);
    return respuesta;
}
function cargarTablaSimbolos(nodoast,entorno,ambito,posicion){
    if(nodoast instanceof Declaracionclase){
        var id_instancia=nodoast.id+"_GLOBAL";
        var sim=new Simbolo(nodoast.id,Type.CLASE,"GLOBAL",Type.CLASE,-1,nodoast.gettamClase(),0,nodoast.getVisibilidad(),nodoast.modificadores);
        sim.inicializado=false;
        sim.extiende=nodoast.id_extends;
        entorno.agregar(id_instancia,sim);
        var posrel=0;
        for(var i=0;i<nodoast.nodos.length;i++){
            cargarTablaSimbolos(nodoast.nodos[i],entorno,nodoast.id,posrel);
            if(nodoast.nodos[i] instanceof Declaracion){
                posrel++;
            }
        }
    }else if(nodoast instanceof Declaracion){
        var id_instancia=nodoast.id+"_"+ambito;
        var sim=new Simbolo(nodoast.id,nodoast.tipo,ambito,"VARIABLE",posicion,1,0,nodoast.getVisibilidad(),nodoast.modificadores);
        sim.inicializado=nodoast.inicializado;
        posicion++;
        entorno.agregar(id_instancia,sim);
    }else if(nodoast instanceof Metodo){
        var id_instancia=nodoast.generarNombre(nodoast.id);
        var ambito_local=ambito+"/"+id_instancia;
        var sim=new Simbolo(id_instancia,nodoast.tipo,ambito,"METODO",-1,nodoast.gettamMetodo(),0,nodoast.getVisibilidad(),nodoast.modificadores);
        entorno.agregar(id_instancia,sim);
        var posrel=0;
        for(var i=0;i<nodoast.nodos.length;i++){
            cargarTablaSimbolos(nodoast.nodos[i],entorno,ambito_local,posrel);
            if(nodoast.nodos[i] instanceof Declaracion){
                posrel++;
            }
        }

    }else{
        console.log("Aqui se tienen que agregar las otras instancias");

    }
}


function imprimirentorno(entorno){
    var simbolo=entorno.obtener("a");
    console.log(simbolo.tipo);
}

