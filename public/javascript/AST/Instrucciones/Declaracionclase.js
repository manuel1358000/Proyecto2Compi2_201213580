

class Declaracionclase{
    constructor(id,modificadores,id_extends,nodos){
        this.id=id;
        this.modificadores=modificadores;
        this.id_extends=id_extends;
        this.nodos=nodos;
        this.codigo=codigo;
        codigo++;
    }
    execute(entorno){
        var respuesta="";
        var variables_globales="proc globales_"+this.id+" begin\n";
        for(var i=0;i<this.nodos.length;i++){
            var nodo=this.nodos[i];
            if(nodo instanceof Declaracion){
                var result=nodo.execute(entorno);
                var tipo_result=nodo.getTipe(entorno);
                if(tipo_result==nodo.tipo){
                    var temp="";
                    if(result.cadena!=null){
                        temp+=result.cadena;
                    }
                    //respuesta+=nodo.execute(entorno);
                    temp+="//EMPIEZA LA INICIALIZACION\n";
                    var eti_this=generarEtiqueta();
                    temp+=eti_this+"=p+1;//se mueve una posicion por el this\n";
                    var eti_aux=generarEtiqueta();
                    temp+=eti_aux+"=stack["+eti_this+"]; //puntero del objeto\n";
                    var eti_aux2=generarEtiqueta();
                    var sim_aux=entorno.obtener(nodo.id+"_"+this.id);
                    temp+=eti_aux2+"="+eti_aux+"+"+sim_aux.posRel+";//direccion de "+nodo.id+"\n";
                    if(result.u_etiqueta==null){
                        temp+="heap["+eti_aux2+"]=0;//asignacion del valor al heap\n";
                    }else{
                        temp+="heap["+eti_aux2+"]="+result.u_etiqueta+";//asignacion del valor al heap\n";
                        if(nodo.iniValue==null){
                            sim_aux.inicializado=false;
                        }else{
                            sim_aux.inicializado=true;
                        }
                        entorno.actualizar(nodo.id+"_"+this.id,sim_aux);
                    }
                    temp+="//Finalizo la signacion \n";
                    //finalizado
                    sim_aux.inicializado=true;
                    entorno.actualizar(nodo.id+"_"+this.id,sim_aux);
                    variables_globales+=temp;
                }else{
                    var c_error="No se puede generar el codigo 3d de la variable "+nodo.id+" Se le quiere asignar un valor "+result.tipo;
                    var error=new Errores("SEMANTICO",c_error,0,0);
                    agregarErrores(error);
                }
            }else if(nodo instanceof Metodo){
                //metodos
                if(this.id==nodo.id){
                    var nombre_constructor=this.id+"_"+this.id;
                    var val="";
                    for(var j=0;j<nodo.parametros.length;j++){
                        nodo.parametros[j].ambitos=this.id;
                        nodo.parametros[j].execute(entorno);
                        var tipo_parametro=nodo.parametros[j].getTipe(entorno);
                        nombre_constructor+="_"+tipo_parametro;
                        val+="_"+tipo_parametro;
                    }
                    
                    nodo.ambitos=this.id;
                    var result=nodo.execute(entorno);
                    var temp="proc "+nombre_constructor+" begin\n";
                    /*var eti1=generarEtiqueta();
                    temp+=eti1+"=p+1;\n";
                    var eti2=generarEtiqueta();
                    temp+=eti2+"=stack["+eti1+"];\n";
                    var eti3=generarEtiqueta();
                    temp+=eti3+"=heap["+eti2+"];\n";*/
                    temp+="//AQUI TENGO QUE REVISAR QUE ESTA PASANDO--------------------------\n";
                    temp+=result.cadena;
                    temp+="end\n \n";
                    respuesta+=temp;
                }else{
                    nodo.ambitos=this.id;
                    var result=nodo.execute(entorno);
                    var temp="";
                    temp+="\n//INICIA LA CREACION DEL METODO\n";
                    if(nodo.id=="main"){
                        temp+="proc " +nodo.id + " begin\n";
                        var eti10=generarEtiqueta();
                        temp+=eti10+"=h;\n";
                        temp+="h=h+1;\n";
                        var sim=entorno.obtener(nodo.id);
                        var eti11=generarEtiqueta();
                        temp+=eti11+"=p+"+sim.tamanio+";\n";
                        var eti12=generarEtiqueta();
                        temp+=eti12+"="+eti11+"+1;\n";
                        temp+="stack["+eti12+"]="+eti10+";\n";
                        temp+="p=p+"+sim.tamanio+";\n";
                        temp+="call globales_"+this.id+";\n";
                        //temp+="p=p-"+sim.tamanio+";\n";
                    }else{
                        var nombre_metodo=this.id+"_"+nodo.id;
                        for(var f=0;f<nodo.parametros.length;f++){ 
                            nombre_metodo+="_"+nodo.parametros[f].tipo;
                        }
                        temp+="proc " +nombre_metodo+ " begin\n";
                    }
                    temp+=result.cadena;
                    temp+="\nend\n";
                    respuesta+=temp;
                }
                
            }else if(nodo instanceof DeclaracionArreglos){
                var temp="";
                temp+="//ESTA PARTE ESTA PENDIENTE\n";
                variables_globales+=temp;
            }else{
                alert("Es un valor cualquiera");
            }

        }
        variables_globales+="end\n";
        respuesta=variables_globales+respuesta;

        return respuesta;
    }
    getTipe(){
        return this.tipo;
    }
    getVisibilidad(){
        var indice="";
        for(var i=0;i<this.modificadores.length;i++){
            if(this.modificadores[i]=="PUBLIC"||this.modificadores[i]=="PRIVATE"||this.modificadores[i]=="PROTECTED"){
                if(indice==""){
                    indice=this.modificadores[i];
                    this.modificadores.splice(i,1);
                }else{
                    this.modificadores.splice(i,1);
                    var c_error="Solo puede existir un elemento de visibilidad";
                    agregarErrores(new Errores("SEMANTICO",c_error,0,0));
                }
            }
        }
        return indice;
    }
    gettamClase(){
        var tam=0;
        for(var i=0;i<this.nodos.length;i++){
            if(this.nodos[i] instanceof Declaracion){
                tam++;
            }
        }
        return tam;
    }
}