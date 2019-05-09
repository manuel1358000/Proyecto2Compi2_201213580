function importar(nodoast){
    for(var i=0;i<nodoast.length;i++){
       if(nodoast[i] instanceof Importacion){
            var indice=lista_pesta[nodoast[i].id];
            if(indice!=null){
                if(indice==1){
                    indice=indice-1;
                }else if(indice>1){
                    indice=indice-3;
                }
                var cm = $('.CodeMirror')[indice].CodeMirror;
                var ast=calculadora.parse(cm.getValue());
                importar(ast);
                for(var t=0;t<ast.length;t++){
                    if(ast[t] instanceof Declaracionclase){
                        if(verificarClase(nodoast,ast[t].id)){
                            //si se agrega la clase
                            nodoast.push(ast[t]);
                        }else{
                            //la clase ya se encuentra definida
                            alert("Error, la clase "+ast[t].id +" ya esta definida, no se puede importar");
                        }
                    }
                }   
                
            }else{
                alert("Error, No existe el archivo que se quiere importar con el nombre "+nodoast[i].id);
            }   
        }
    }
    return nodoast;
}

function verificarClase(nodoast,nombre){
    var bandera=true;
    for(var k=0;k<nodoast.length;k++){
        if(nodoast[k] instanceof Declaracionclase){
            if(nodoast[k].id==nombre){
                bandera=false;
                break;
            }
        }
        
    }
    return bandera;
}


function ejecutar(nodoast,entorno){
    var respuesta="";
    var entorno=new Entorno(null);
    lista_pesta={};
    var elementoNav=document.querySelector("#nav_pesta");
    var elementoLi=elementoNav.children;
    for(var i=0;i<elementoLi.length;i++){
        var elementoA=elementoLi[i].children;
        var nombre_pesta=elementoLi[i].textContent;
        var indice_temp=$(elementoA).attr('href');
        var indice_temp=indice_temp.split("_");
        indice_temp=indice_temp[1];
        lista_pesta[nombre_pesta]=indice_temp;
    }

    importar(nodoast);
    //--------------------------EMPIEZA PRIMERA PASADA, VAMOS A REALIZAR LAS IMPORTACIONES 
            



    //------------------------- EMPIEZA SEGUNDA PASADA, VAMOS A CARGAR TODOS LOS SIMBOLOS A LA TABLA DE SIMBOLOS
    //------------------------- SE AGREGAN, CLASES, ATRIBUTOS, METODOS
    for(var i=0;i<nodoast.length;i++){
        cargarTablaSimbolos(nodoast[i],entorno,"GLOBAL",0);
    }
    agregarTablaSimbolos(entorno);
    //------------------------- EMPIEZA TERCERA PASADA, SE REALIZA LA GENERACION DE CODIGO INTERMEDIO
    //vamos a recorrer la tabla de simbolo en busca del metodo main
    for(var i=0;i<nodoast.length;i++){
        var clases=nodoast[i];
        if(clases instanceof Declaracionclase){
            for(var a=0;a<clases.nodos.length;a++){
                var metodo=clases.nodos[a];
                /*if(metodo instanceof Metodo){
                    if(metodo.id=="main"){
                        clases.nodos.splice(a,1)
                        clases.nodos.unshift(metodo);
                        var temp=clases;
                        nodoast.splice(i,1);
                        nodoast.unshift(temp);
                    }
                }*/
            }
        }
    }
    for(var i=0;i<nodoast.length;i++){
        if(nodoast[i] instanceof Declaracionclase){
            respuesta+=nodoast[i].execute(entorno);
        }
    }
    //------------------------
    agregarTablaSimbolos(entorno);
    //anidarErrores();
    return respuesta;
}
function cargarTablaSimbolos(nodoast,entorno,ambito,posicion,tipo){
    if(nodoast instanceof Declaracionclase){
        var id_instancia=nodoast.id+"_GLOBAL";
        var sim=new Simbolo(nodoast.id,Type.CLASE,"GLOBAL",Type.CLASE,-1,nodoast.gettamClase(),0,nodoast.getVisibilidad(),nodoast.modificadores);
        sim.inicializado=false;
        sim.extiende=nodoast.id_extends;
        entorno.agregar(id_instancia,sim);
        var posrel=0;
        for(var i=0;i<nodoast.nodos.length;i++){
            cargarTablaSimbolos(nodoast.nodos[i],entorno,nodoast.id,posrel,"VARIABLE_GLOBAL");
            if(nodoast.nodos[i] instanceof Declaracion){
                posrel++;
            }else if(nodoast.nodos[i] instanceof DeclaracionArreglos){  
                posrel++;
            }
        }
    }else if(nodoast instanceof Declaracion){
        var id_instancia=nodoast.id+"_"+ambito;
        var sim=new Simbolo(nodoast.id,nodoast.tipo,ambito,tipo,posicion,1,0,nodoast.getVisibilidad(),nodoast.modificadores);
        if(tipo=="PARAMETRO"){
            sim.inicializado=true;
        }else{
            sim.inicializado=nodoast.inicializado;
        }
        posicion++;
        entorno.agregar(id_instancia,sim);
    }else if(nodoast instanceof DeclaracionArreglos){
        var id_instancia=nodoast.id+"_"+ambito;
        var sim=new Simbolo(nodoast.id,nodoast.tipo,ambito,tipo,posicion,1,nodoast.dimensiones,nodoast.getVisibilidad(),nodoast.modificadores);
        if(tipo=="PARAMETRO"){
            sim.inicializado=true;
        }else{
            sim.inicializado=nodoast.inicializado;
        }
        posicion++;
        entorno.agregar(id_instancia,sim);
    }else if(nodoast instanceof Metodo){
        var id_instancia=nodoast.generarNombre(nodoast.id);
        var ambito_local=ambito+"/"+id_instancia;
        if(id_instancia!="main"){
            id_instancia=ambito+"_"+id_instancia;
        }
        var sim=new Simbolo(id_instancia,nodoast.tipo,ambito,"METODO",-1,nodoast.gettamMetodo(),0,nodoast.getVisibilidad(),nodoast.modificadores);
        
        var posrel=0;
        var retu_this=[];
        retu_this.push(new Declaracion("return",PrimitiveType.VOID,null,[],0,0,0));
        retu_this.push(new Declaracion("this",PrimitiveType.VOID,null,[],0,0,0));
        for(var i=0;i<retu_this.length;i++){
            cargarTablaSimbolos(retu_this[i],entorno,ambito_local,posrel,"VARIABLE");
            if(retu_this[i] instanceof Declaracion){
                posrel++;
            }
        }
        for(var i=0;i<nodoast.parametros.length;i++){
            cargarTablaSimbolos(nodoast.parametros[i],entorno,ambito_local,posrel,"PARAMETRO");
            if(nodoast.parametros[i] instanceof Declaracion){
                sim.referencia.push(nodoast.parametros[i].id);
                posrel++;
            }else if(nodoast.parametros[i] instanceof DeclaracionArreglos){
                sim.referencia.push(nodoast.parametros[i].id);
                posrel++;
            }
        }
        sim.ambitos_parametros=ambito_local;
        for(var i=0;i<nodoast.nodos.length;i++){
            cargarTablaSimbolos(nodoast.nodos[i],entorno,ambito_local,posrel,"VARIABLE");
            if(nodoast.nodos[i] instanceof Declaracion){
                posrel++;
            }else if(nodoast.nodos[i] instanceof DeclaracionArreglos){
                posrel++;
            }   
        }
        entorno.agregar(id_instancia,sim);
    }else{
        //instancias extras
    }
}


function imprimirentorno(entorno){
    var simbolo=entorno.obtener("a");
    console.log(simbolo.tipo);
}

