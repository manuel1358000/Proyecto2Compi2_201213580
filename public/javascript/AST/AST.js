var conteo=0;
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
                            var errores_1=new Errores("Semantico","La clase "+ast[t].id+" ya esta definida, no se puede importar",0,0);
                            lista_errores.push(errores_1);
                        }
                    }
                }   
                
            }else{
                alert("Error, No existe el archivo que se quiere importar con el nombre "+nodoast[i].id);
                var errores_1=new Errores("Semantico","No existe el archivo que se quiere importar con el nombre "+nodoast[i].id,0,0);
                lista_errores.push(errores_1);
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
function verificarClaseHerencia(nodoast,nombre){
    var bandera=-1;
    for(var k=0;k<nodoast.length;k++){
        if(nodoast[k] instanceof Declaracionclase){
            if(nodoast[k].id==nombre){
                bandera=k;
                break;
            }
        }
        
    }
    return bandera;
}
function verificarExistencia(nodoast,nombre,tipo){
    var bandera=true;
    for(var i=0;i<nodoast.nodos.length;i++){
        if(tipo=="VARIABLE"){
            if(nodoast.nodos[i].id==nombre){
                bandera=false;
                break;
            }
        }
    }
    return bandera;
}

function verificarExistenciaMetodo(nodoast,nodo){
    //es el nodo completo de la clase hija
    //nodo es el nodo del metodo que tenemos que comparar
    var bandera=true;
    //del nodo que se quiere agregar conocemos 
    var nombre=nodo.generarNombre(nodo.id);
    for(var i=0;i<nodoast.length;i++){
        if(nodoast[i] instanceof Metodo){
            var nombre2=nodoast[i].generarNombre(nodoast[i].id);
            if(nombre==nombre2){
                bandera=false
                break;
            }
        }   
    }
    return bandera;
}

function verificarClaseFinal(nodoast,indice){
    var bandera=true;
    for(var i=0;i<nodoast[indice].modificadores.length;i++){
        console.log(nodoast[indice].modificadores[i]);
        if(nodoast[indice].modificadores[i]=="FINAL"||nodoast[indice].modificadores[i]=="final"){
            bandera=false;
            break;
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
    //vamos a realizar las herencias que se encuentren en las clases
    for(var i=0;i<nodoast.length;i++){
        if(nodoast[i].id_extends!=null){
            if(nodoast[i].id_extends!=nodoast[i].id){
                var indice=verificarClaseHerencia(nodoast,nodoast[i].id_extends);
                if(indice!=-1){
                    if(verificarClaseFinal(nodoast,indice)){
                        for(var t=0;t<nodoast[indice].nodos.length;t++){
                            if(nodoast[indice].nodos[t] instanceof Declaracion){
                                if(verificarExistencia(nodoast[i],nodoast[indice].nodos[t].id,"VARIABLE")){
                                    if(nodoast[indice].nodos[t].getVisibilidad()=="PRIVATE"||nodoast[indice].nodos[t].getVisibilidad()=="private"){
                                        alert("Error Semantico, la variable no se puede hereadar tiene visibilidad PRIVATE");
                                        var errores_1=new Errores("Semantico","la variable no se puede heredar tiene visibilidad PRIVATE",0,0);
                                        lista_errores.push(errores_1);
                                    }else{
                                        nodoast[i].nodos.push(nodoast[indice].nodos[t]);
                                    }
                                }else{
                                    alert("Error Semantico, ya existe una declaracion con el mismo nombre, herencia");
                                    var errores_1=new Errores("Semantico","Ya existe una declaracion con el mismo nombre, herencia",0,0);
                                    lista_errores.push(errores_1);
                                }
                            }else if(nodoast[indice].nodos[t] instanceof Metodo){
                                if(nodoast[indice].nodos[t].id==nodoast[indice].id){
                                    //tengo al constructor voy a verificar si existe ese contructor
                                    var nodo_temp=new Metodo(nodoast[i].id,nodoast[indice].nodos[t].tipo,nodoast[indice].nodos[t].nodos,nodoast[indice].nodos[t].parametros);
                                    nodo_temp.constructor=true;
                                    if(verificarExistenciaMetodo(nodoast[i].nodos,nodo_temp)){
                                        nodoast[i].nodos.push(nodo_temp);
                                    }else{
                                        alert("Error Semantico, no se puede heredar el constructor ya que existe uno con la misma firma");
                                        var errores_1=new Errores("Semantico","no se puede pasar el constructor ya que existe uno con la misma firma",0,0);
                                        lista_errores.push(errores_1);
                                    }
                                }else{
                                    if(verificarExistenciaMetodo(nodoast[i].nodos,nodoast[indice].nodos[t])){
                                        if(nodoast[indice].nodos[t].getVisibilidad()=="PRIVATE"||nodoast[indice].nodos[t].getVisibilidad()=="private"){
                                            alert("Error Semantico, el metodo no se puede heredar ya tiene visibilidad private");
                                            var errores_1=new Errores("Semantico","el metodo no se puede heredar ya tiene visibilidad private",0,0);
                                            lista_errores.push(errores_1);
                                        }else{
                                            nodoast[i].nodos.push(nodoast[indice].nodos[t]);
                                        }
                                    }else{
                                        alert("Error Semantico, el metodo no se puede heredar ya que existe uno con las mismas caracteristicas en la clase hija");
                                        var errores_1=new Errores("Semantico","El metodo no se puede heredar ya que existe uno con las mismas caracteristicas en la clase hija",0,0);
                                        lista_errores.push(errores_1);
                                    }
                                }
                            }else{
                                alert("Error Semantico, es una instancia rara de una clase");
                            }
                        }
                    }else{
                        alert("Error Semantico, La clase que quiere heredar es FINAL por lo que no puede realizar la operacion");
                        var errores_1=new Errores("Semantico","la clase que quiere heredar es FINAL por lo que no puede realizar la operacion",0,0);
                        lista_errores.push(errores_1);
                    }
                }else{
                    alert("Error Semantico, la clase que se quiere heredar no existe");
                    var errores_1=new Errores("Semantico","La clase que se quiere heredar no existe",0,0);
                    lista_errores.push(errores_1);
                }
            }else{
                alert("Error Semantico, la herencia no puede ser de la misma clase");
                var errores_1=new Errores("Semantico","la herencia no puede ser de la misma clase",0,0);
                lista_errores.push(errores_1);
            }
        }

    }

    //------------------------- EMPIEZA SEGUNDA PASADA, VAMOS A CARGAR TODOS LOS SIMBOLOS A LA TABLA DE SIMBOLOS
    //------------------------- SE AGREGAN, CLASES, ATRIBUTOS, METODOS
 
    for(var i=0;i<nodoast.length;i++){
        cargarTablaSimbolos(nodoast[i],entorno,"GLOBAL",0);
    }
    //agregarTablaSimbolos(entorno);
    //------------------------- EMPIEZA TERCERA PASADA, SE REALIZA LA GENERACION DE CODIGO INTERMEDIO
    //vamos a recorrer la tabla de simbolo en busca del metodo main
    var bandera=false;
    for(var i=0;i<nodoast.length;i++){
        var clases=nodoast[i];
        if(clases instanceof Declaracionclase){
            for(var a=0;a<clases.nodos.length;a++){
                var metodo=clases.nodos[a];
                if(metodo.id==clases.id){
                    bandera=true;
                    break;
                }
            }
            if(bandera==false){
                nodoast[i].nodos.push(new Metodo(clases.id,"VOID",[],[]));
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
    graficarArbol(nodoast);
    return respuesta;
}
function agregarSimbolosDinamo(){
    for(var i=0;i<lista_tabla_simbolo.length;i++){
        var modificadores="-";
        for(var f=0;f<lista_tabla_simbolo[i].modificadores.length;f++){
            modificadores+=lista_tabla_simbolo[i].modificadores[f]+"-";
        }
        if(lista_tabla_simbolo[i].nombre==""||lista_tabla_simbolo[i].nombre==null){
            lista_tabla_simbolo[i].nombre=="-";
        }else if(lista_tabla_simbolo[i].tipo==""||lista_tabla_simbolo[i].tipo==null){
            lista_tabla_simbolo[i].tipo="-";
        }else if(lista_tabla_simbolo[i].ambito==""||lista_tabla_simbolo[i].ambito==null){
            lista_tabla_simbolo[i].ambito="-";
        }else if(lista_tabla_simbolo[i].rol==""||lista_tabla_simbolo[i].rol==null){
            lista_tabla_simbolo[i].rol="-";
        }else if(lista_tabla_simbolo[i].posRel==""||lista_tabla_simbolo[i].posRel==null){
            lista_tabla_simbolo[i].posRel="-";
        }else if(lista_tabla_simbolo[i].tamanio==""||lista_tabla_simbolo[i].tamanio==null){
            lista_tabla_simbolo[i].tamanio="-";
        }else if(lista_tabla_simbolo[i].dim==""||lista_tabla_simbolo[i].dim==null){
            lista_tabla_simbolo[i].dimensiones="-";
        }else if(lista_tabla_simbolo[i].visibilidad==""||lista_tabla_simbolo[i].visibilidad==null){
            lista_tabla_simbolo[i].visibilidad="-";
        }else if(modificadores==""||modificadores==null){
            modificadores="-";
        }else if(lista_tabla_simbolo[i].inicializado==""||lista_tabla_simbolo[i].inicializado==null){
            lista_tabla_simbolo[i].inicializado="-";
        }else if(lista_tabla_simbolo[i].extiende==""||lista_tabla_simbolo[i].extiende==null){
            lista_tabla_simbolo[i].extiende="-";
        }
        createElementoSimbolos(i,lista_tabla_simbolo[i].nombre,lista_tabla_simbolo[i].tipo,lista_tabla_simbolo[i].ambito,lista_tabla_simbolo[i].rol,lista_tabla_simbolo[i].posRel,lista_tabla_simbolo[i].tamanio,lista_tabla_simbolo[i].dim,lista_tabla_simbolo[i].visibilidad,modificadores,lista_tabla_simbolo[i].inicializado,"-");
    }
}
function verificarStatic(modificadores){
    var bandera=false;
    if(modificadores!=null){
        for(var i=0;i<modificadores.length;i++){
            if(modificadores[i]=="STATIC"||modificadores[i]=="static"){
                bandera=true;
                break;
            }
        }
    }
    
    return bandera;
}
function verificarProtected(modificadores){
    var bandera=false;
    if(modificadores!=null){
        for(var i=0;i<modificadores.length;i++){
            if(modificadores[i]=="PROTECTED"){
                bandera=true;
            }
        }
    }
    return bandera;
}
function verificarPrivate(modificadores){
    var bandera=false;
    if(modificadores!=null){
        for(var i=0;i<modificadores.length;i++){
            if(modificadores[i]=="PRIVATE"){
                bandera=true;
            }
        }
    }
    return bandera;
}
function verificarPublic(modificadores){
    var bandera=false;
    if(modificadores!=null){
        for(var i=0;i<modificadores.length;i++){
            if(modificadores[i]=="PUBLIC"){
                bandera=true;
            }
        }
    }
    return bandera;
}
function verificarFinal(modificadores){
    var bandera=false;
    if(modificadores!=null){
        for(var i=0;i<modificadores.length;i++){
            if(modificadores[i]=="FINAL"){
                bandera=true;
            }
        }
    }
    return bandera;
}
function cargarTablaSimbolos(nodoast,entorno,ambito,posicion,tipo){
    if(nodoast instanceof Declaracionclase){
        if(tipo=="VARIABLE_GLOBAL"){
            if(verificarPublic(nodoast.modificadores)){
                alert("Error Semantico, la clase miembro "+nodoast.id+" no puede tener un modificador PUBLIC");
                var errores_1=new Errores("Semantico","La clase miembro "+nodoast.id+" no puede tener  un modificador PUBLIC",0,0);
                lista_errores.push(errores_1);
            }
        }else{
            if(verificarProtected(nodoast.modificadores)){
                alert("Error Semantico, la clase superior "+nodoast.id+" tiene un modificador PROTECTED es un error");
                var errores_1=new Errores("Semantico","la clase superior "+nodoast.id+ "tiene un modificador PROTECTED es un error",0,0);
                lista_errores.push(errores_1);
            }
            if(verificarPrivate(nodoast.modificadores)){
                alert("Error Semantico, la clase superior "+nodoast.id+" tiene un modificador PRIVATE es un error");
                var errores_1=new Errores("Semantico","la clase superior "+nodoast.id+" tiene un modificador PRIVATE ES UN ERROR",0,0);
                lista_errores.push(errores_1);
            }
            if(verificarStatic(nodoast.modificadores)){
                alert("Error Semantico, la clase superior "+nodoast.id+" tiene un modificador STATIC es un error");
                var errores_1=new Errores("Semantico","la clase superior "+nodoast.id+" tiene un modificador STATIC es un error",0,0);
                lista_errores.push(errores_1);
            }
            if(verificarAbstract(nodoast.modificadores)&&verificarFinal(nodoast.modificadores)){
                alert("Error Semantico, la clase superior "+nodoast.id+" no puede ser abstrac y final a la vez");
                var errores_1=new Errores("Semantico","La clase superior "+nodoast.id+" no puede ser abstract y final a la vez",0,0);
                lista_errores.push(errores_1);
            }


        }
        
        var id_instancia=nodoast.id+"_GLOBAL";
        var sim=new Simbolo(nodoast.id,Type.CLASE,"GLOBAL",Type.CLASE,-1,nodoast.gettamClase(),0,nodoast.getVisibilidad(),nodoast.modificadores);
        sim.inicializado=false;
        sim.extiende=nodoast.id_extends;
        entorno.agregar(id_instancia,sim);
        var posrel=0;
        for(var i=0;i<nodoast.nodos.length;i++){
            if(nodoast.nodos[i] instanceof Declaracion){
                if(verificarStatic(nodoast.nodos[i].modificadores)){
                    cargarTablaSimbolos(nodoast.nodos[i],entorno,nodoast.id,conteo,"VARIABLE_GLOBAL");
                }else{
                    cargarTablaSimbolos(nodoast.nodos[i],entorno,nodoast.id,posrel,"VARIABLE_GLOBAL");
                }
            }else{
                cargarTablaSimbolos(nodoast.nodos[i],entorno,nodoast.id,posrel,"VARIABLE_GLOBAL");
            }
            if(nodoast.nodos[i] instanceof Declaracion){
                if(verificarStatic(nodoast.nodos[i].modificadores)){
                    conteo++;       
                }else{
                    posrel++;
                }
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
        if(verificarAbstract(nodoast.modificadores)&&verificarPrivate(nodoast.modificadores)){
            alert("Error Semantico, No se puede implementar un metodo que sea abstract y private");
        }
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

