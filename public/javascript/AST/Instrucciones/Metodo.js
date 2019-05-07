class Metodo{
    constructor(id,tipo,nodos,parametros){
        this.id=id;
        this.tipo=tipo;
        this.nodos=nodos;
        this.parametros=parametros;
        this.parametros_entrada=[];
        this.retorno=null;
        this.modificadores=[];
        this.constructor=false;
        this.ambitos="";
        this.codigo=codigo;
        codigo++;
    }
    execute(entorno){
        //vamos a cargar los parametros a la tabla de simbolos
        //aqui queda pendiente
        var result=new Result();
        //tengo que crear el nuevo nodo
        for(var i=0;i<this.nodos.length;i++){
            if(this.nodos[i] instanceof Declaracion){
                var ambi=this.ambitos;
                var temp="";
                var nombre="";
                var ambi2;
                if(this.id=="main"){
                    nombre="main";
                    ambi2=this.ambitos+"/"+this.id;
                    this.nodos[i].ambitos=ambi;
                }else{
                    var complemento="";
                    for(var f=0;f<this.parametros.length;f++){
                        complemento+="_"+this.parametros[f].tipo;
                    }
                    nombre=this.ambitos+"_"+this.id+complemento;
                    this.nodos[i].ambitos=ambi+"/"+this.id+complemento;
                    ambi2=this.nodos[i].ambitos;
                }
                this.nodos[i].padre=nombre;
                this.nodos[i].normal=ambi;
                var result_temp=this.nodos[i].execute(entorno);
                var tipo_result=this.nodos[i].getTipe(entorno);
                var temp="";
                if(!numerico(tipo_result)){
                    if(result_temp!=null){
                        temp+=result_temp.cadena;
                        temp+="//declaracion OBJETO local\n";
                        var temph=generarEtiqueta();
                        temp+=temph+"=h;\n";
                        temp+="heap[h]="+result_temp.u_etiqueta+";\n";
                        temp+="h=h+1;\n";
                        var simulado=generarEtiqueta();
                        var sim=entorno.obtener(this.nodos[i].id+"_"+ambi2);
                        if(sim!=null){
                            temp+=simulado+"=p+"+sim.posRel+";\n";
                            temp+="stack["+simulado+"]="+temph+";\n";
                            temp+="//fin declaracion variable local\n";
                            sim.inicializado=true; 
                            entorno.actualizar(this.nodos[i].id+"_"+ambi,sim);
                        }else{
                            alert("Error Semantico, En la declaracion");
                        }
                    }else{
                        alert("Error Semantico, OBJETO");
                    }
                }else{
                    if(result_temp!=null){
                        temp+=result_temp.cadena;
                        temp+="//declaracion variable local\n";
                        var temph=generarEtiqueta();
                        temp+=temph+"=h;\n";
                        temp+="heap[h]="+result_temp.u_etiqueta+";\n";
                        temp+="h=h+1;\n";
                        var simulado=generarEtiqueta();
                        var sim=entorno.obtener(this.nodos[i].id+"_"+ambi2);
                        temp+=simulado+"=p+"+sim.posRel+";\n";
                        temp+="stack["+simulado+"]="+temph+";\n";
                        temp+="//fin declaracion variable local\n";
                        sim.inicializado=true;
                        entorno.actualizar(this.nodos[i].id+"_"+ambi2,sim);
                    }else{
                        temp="//declaracion variable local\n";
                        var temph=generarEtiqueta();
                        temp+=temph+"=h;\n";
                        temp+="heap[h]=0;\n";
                        temp+="h=h+1;\n";
                        var simulado=generarEtiqueta();
                        var sim=entorno.obtener(this.nodos[i].id+"_"+ambi2);
                        temp+=simulado+"=p+"+sim.posRel+";\n";
                        temp+="stack["+simulado+"]="+temph+";\n";
                        temp+="//fin declaracion variable local\n";
                        sim.inicializado=true;
                        entorno.actualizar(this.nodos[i].id+"_"+ambi2,sim);
                    }
                }
                result.cadena+=temp;
            }else if(this.nodos[i] instanceof Imprimir){
                var ambi=this.ambitos;
                var temp="";
                var nombre="";
                var result_tamanio_salto;
                if(this.id=="main"){
                    nombre="main";
                    result_tamanio_salto=entorno.obtener(nombre);
                    this.nodos[i].ambitos=ambi;
                }else{
                    var complemento="";
                    for(var f=0;f<this.parametros.length;f++){
                        complemento+="_"+this.parametros[f].tipo;
                    }
                    nombre=this.ambitos+"_"+this.id+complemento;
                    this.nodos[i].ambitos=ambi+"/"+this.id+complemento;
                    result_tamanio_salto=entorno.obtener(ambi+"_"+this.id+complemento);
                }
                this.nodos[i].padre=nombre;
                this.nodos[i].normal=ambi;
                this.nodos[i].tam=result_tamanio_salto.tamanio; 
                var result_temp=this.nodos[i].execute(entorno);
                result.cadena+=result_temp.cadena;
            }else if(this.nodos[i] instanceof Asignacion){
                var ambi=this.ambitos;
                var temp="";
                var ambi2;
                var nombre="";
                if(this.id=="main"){
                    nombre="main";
                    ambi2=this.ambitos+"/"+this.id;
                    this.nodos[i].ambitos=ambi;
                }else{
                    var complemento="";
                    for(var f=0;f<this.parametros.length;f++){
                        complemento+="_"+this.parametros[f].tipo;
                    }
                    nombre=this.ambitos+"_"+this.id+complemento;
                    this.nodos[i].ambitos=ambi+"/"+this.id+complemento;
                    ambi2=this.nodos[i].ambitos;
                }
                this.nodos[i].padre=nombre;
                this.nodos[i].normal=ambi;
                var result_temp=this.nodos[i].execute(entorno);
                var temp="";
                if(result_temp!=null){
                    if(result_temp.tipo=="this"){
                        temp+="//ACCESO A UN ELEMENTO DEL THIS\n";
                        temp+=result_temp.cadena;
                        temp+="//FINALIZA ACCESO A UN ELEMENTO DEL THIS\n";
                    }else{
                        temp=result_temp.cadena;
                        temp+="//empieza la asignacion variable local\n";
                        var temph=generarEtiqueta();
                        temp+=temph+"=h;\n";
                        temp+="heap[h]="+result_temp.u_etiqueta+";\n";
                        temp+="h=h+1;\n";
                        var simulado=generarEtiqueta();
                        var sim=entorno.obtener(this.nodos[i].id+"_"+ambi2);
                        temp+=simulado+"=p+"+sim.posRel+";\n";
                        temp+="stack["+simulado+"]="+temph+";\n";
                        temp+="//fin asignacion variable local\n";
                    }
                }else{
                   
                }
                result.cadena+=temp;
            }else if(this.nodos[i] instanceof Selecciona){
                var ambi=this.ambitos;
                var temp="";
                var nombre="";
                if(this.id=="main"){
                    nombre="main";
                    this.nodos[i].ambitos=ambi;
                }else{
                    var complemento="";
                    for(var f=0;f<this.parametros.length;f++){
                        complemento+="_"+this.parametros[f].tipo;
                    }
                    nombre=this.ambitos+"_"+this.id+complemento;
                    this.nodos[i].ambitos=ambi+"/"+this.id+complemento;
                }
                this.nodos[i].padre=nombre;
                this.nodos[i].normal=ambi;
                var result_temp=this.nodos[i].execute(entorno);
                //aca no vamos a recibir ninguna etiqueta ya que solo se ejecuta el if
                if(result_temp!=null){  
                    result.cadena+=result_temp.cadena;
                }
            }else if(this.nodos[i] instanceof Mientras){
                var ambi=this.ambitos;
                var temp="";
                var nombre="";
                if(this.id=="main"){
                    nombre="main";
                    this.nodos[i].ambitos=ambi;
                }else{
                    var complemento="";
                    for(var f=0;f<this.parametros.length;f++){
                        complemento+="_"+this.parametros[f].tipo;
                    }
                    nombre=this.ambitos+"_"+this.id+complemento;
                    this.nodos[i].ambitos=ambi+"/"+this.id+complemento;
                }
                this.nodos[i].padre=nombre;
                this.nodos[i].normal=ambi;
                var result_temp=this.nodos[i].execute(entorno);
                if(result_temp!=null){  
                    result.cadena+=result_temp.cadena;
                }
            }else if(this.nodos[i] instanceof Aritmetica){
                if(this.nodos[i].unario){
                    var ambi=this.ambitos;
                    var temp="";
                    var nombre="";
                    if(this.id=="main"){
                        nombre="main";
                        this.nodos[i].ambitos=ambi;
                    }else{
                        var complemento="";
                        for(var f=0;f<this.parametros.length;f++){
                            complemento+="_"+this.parametros[f].tipo;
                        }
                        nombre=this.ambitos+"_"+this.id+complemento;
                        this.nodos[i].ambitos=ambi+"/"+this.id+complemento;
                    }
                    this.nodos[i].padre=nombre;
                    this.nodos[i].normal=ambi;
                    var result_temp=this.nodos[i].getValue(entorno);
                    if(result_temp!=null){  
                        result.cadena+=result_temp.cadena;
                    }   
                }else{
                    alert("Error Semantico, Operacion no Permitida, unicamente incremento y decremento");
                }
            }else if(this.nodos[i] instanceof Para){
                var ambi=this.ambitos;
                var temp="";
                var nombre="";
                if(this.id=="main"){
                    nombre="main";
                    this.nodos[i].ambitos=ambi;
                }else{
                    var complemento="";
                    for(var f=0;f<this.parametros.length;f++){
                        complemento+="_"+this.parametros[f].tipo;
                    }
                    nombre=this.ambitos+"_"+this.id+complemento;
                    this.nodos[i].ambitos=ambi+"/"+this.id+complemento;
                }
                this.nodos[i].padre=nombre;
                this.nodos[i].normal=ambi;
                var result_temp=this.nodos[i].execute(entorno);
                if(result_temp!=null){  
                    result.cadena+=result_temp.cadena;
                }
            }else if(this.nodos[i] instanceof Si){
                var ambi=this.ambitos;
                var temp="";
                var nombre="";
                if(this.id=="main"){
                    nombre="main";
                    this.nodos[i].ambitos=ambi;
                }else{
                    var complemento="";
                    for(var f=0;f<this.parametros.length;f++){
                        complemento+="_"+this.parametros[f].tipo;
                    }
                    nombre=this.ambitos+"_"+this.id+complemento;
                    this.nodos[i].ambitos=ambi+"/"+this.id+complemento;
                }
                this.nodos[i].padre=nombre;
                this.nodos[i].normal=ambi;
                var result_temp=this.nodos[i].execute(entorno);
                //aca no vamos a recibir ninguna etiqueta ya que solo se ejecuta el if
                if(result_temp!=null){  
                    result.cadena+=result_temp.cadena;
                }
            }else if(this.nodos[i] instanceof Llamada_Metodo){
                var ambi=this.ambitos;
                var temp="";
                var nombre="";
                if(this.id=="main"){
                    nombre="main";
                    this.nodos[i].ambitos=ambi;
                }else{
                    var complemento="";
                    for(var f=0;f<this.parametros.length;f++){
                        complemento+="_"+this.parametros[f].tipo;
                    }
                    nombre=this.ambitos+"_"+this.id+complemento;
                    this.nodos[i].ambitos=ambi+"/"+this.id+complemento;
                }
                this.nodos[i].padre=nombre;
                this.nodos[i].normal=ambi;
                var result_temp=this.nodos[i].getValue(entorno);
                temp+="//INICIA LLAMADA A METODO\n"
                if(result_temp!=null){
                    temp+=result_temp.cadena;
                }
                temp+="//FINALIZA LLAMADA A METODO\n";
                result.cadena+=temp;
            }else if(this.nodos[i] instanceof Retorno){
                var ambi=this.ambitos;
                var temp="";
                var nombre="";
                if(this.id=="main"){
                    nombre="main";
                    this.nodos[i].ambitos=ambi;
                }else{
                    var complemento="";
                    for(var f=0;f<this.parametros.length;f++){
                        complemento+="_"+this.parametros[f].tipo;
                    }
                    nombre=this.ambitos+"_"+this.id+complemento;
                    this.nodos[i].ambitos=ambi+"/"+this.id+complemento;
                }
                this.nodos[i].padre=nombre;
                this.nodos[i].normal=ambi;
                var result_temp=this.nodos[i].getValue(entorno);
                //aca no vamos a recibir ninguna etiqueta ya que solo se ejecuta el if
                if(result_temp!=null){  
                    result.cadena+=result_temp.cadena;
                }
            }else if(this.nodos[i] instanceof DeclaracionArreglos){
                var ambi=this.ambitos;
                var temp="";
                var nombre="";
                var ambi2;
                if(this.id=="main"){
                    nombre="main";
                    ambi2=this.ambitos+"/"+this.id;
                    this.nodos[i].ambitos=ambi;
                }else{
                    var complemento="";
                    for(var f=0;f<this.parametros.length;f++){
                        complemento+="_"+this.parametros[f].tipo;
                    }
                    nombre=this.ambitos+"_"+this.id+complemento;
                    this.nodos[i].ambitos=ambi+"/"+this.id+complemento;
                    ambi2=this.nodos[i].ambitos;
                }
                this.nodos[i].padre=nombre;
                this.nodos[i].normal=ambi;
                var result_temp=this.nodos[i].execute(entorno);
                var tipo_result=this.nodos[i].getTipe(entorno);
                var temp="";
                if(result_temp!=null){
                    temp+="//declaracion ARRAY local\n";
                    temp+=result_temp.cadena;
                    var simulado=generarEtiqueta();
                    var sim=entorno.obtener(this.nodos[i].id+"_"+ambi2);
                    temp+=simulado+"=p+"+sim.posRel+";\n";
                    temp+="stack["+simulado+"]="+result_temp.u_etiqueta+";//asigna el puntero del heap donde inicia el array\n";
                    temp+="//fin declaracion variable local\n";
                    if(this.nodos[i].inicializado==true){
                        sim.inicializado=true;
                        sim.lista_dimensiones=this.nodos[i].lista_dimensiones;
                    }else{
                        sim.inicializado=false;
                    }
                    entorno.actualizar(this.nodos[i].id+"_"+ambi2,sim);
                    result.cadena+=temp;
                }else{
                    alert("Error Semantico, en la operacion declaracion arreglos");
                }        
            }else if(this.nodos[i] instanceof AsignacionArreglos){
                var ambi=this.ambitos;
                var temp="";
                var ambi2;
                var nombre="";
                if(this.id=="main"){
                    nombre="main";
                    ambi2=this.ambitos+"/"+this.id;
                    this.nodos[i].ambitos=ambi;
                }else{
                    var complemento="";
                    for(var f=0;f<this.parametros.length;f++){
                        complemento+="_"+this.parametros[f].tipo;
                    }
                    nombre=this.ambitos+"_"+this.id+complemento;
                    this.nodos[i].ambitos=ambi+"/"+this.id+complemento;
                    ambi2=this.nodos[i].ambitos;
                }
                this.nodos[i].padre=nombre;
                this.nodos[i].normal=ambi;
                var result_temp=this.nodos[i].execute(entorno);
                var temp="";
                var sim=entorno.obtener(this.nodos[i].id+"_"+ambi2);
                if(sim!=null){
                    if(numerico(sim.tipo)){
                        if(result_temp!=null){
                            temp=result_temp.cadena;
                            temp+="//empieza la asignacion ARREGLO PRIMITIVO\n";
                            //se tiene el valor puntual a asignar result_temp.u_etiqueta
                            var eti_principio=generarEtiqueta();
                            var simulado=generarEtiqueta();
                            temp+=simulado+"=p+"+sim.posRel+";\n";
                            temp+=eti_principio+"=stack["+simulado+"];\n";
                            //posicion del heap donde inicia el arreglo eti_principio
                            if(sim.lista_dimensiones.length==this.nodos[i].dimensiones.length){
                                if(sim.lista_dimensiones.length==1){
                                    //cuando es de una sola dimension
                                    //sim es el tamanio total
                                    this.nodos[i].dimensiones[0].ambitos=sim.entorno;
                                    var posx=this.nodos[i].dimensiones[0].getValue(entorno);
                                    var postemp=generarEtiqueta();
                                    temp+=posx.cadena;
                                    temp+=postemp+"="+eti_principio+"+"+posx.u_etiqueta+";\n";
                                    temp+="heap["+postemp+"]="+result_temp.u_etiqueta+";\n";
                                }else if(sim.lista_dimensiones.length==2){
                                    var tempx;
                                    var posfinal=generarEtiqueta();
                                    for(var y=0;y<this.nodos[i].dimensiones.length;y++){
                                        this.nodos[i].dimensiones[y].ambitos=sim.entorno;
                                        if(y==0){
                                            tempx=this.nodos[i].dimensiones[y].getValue(entorno);
                                            temp+=tempx.cadena;
                                        }else{
                                            var tempy=this.nodos[i].dimensiones[y].getValue(entorno);
                                            temp+=tempy.cadena;
                                            sim.lista_dimensiones[y].ambitos=sim.ambitos;
                                            var tamy=sim.lista_dimensiones[y].getValue(entorno);
                                            temp+=tamy.cadena;
                                            temp+=posfinal+"="+tempx.u_etiqueta+"*"+tamy.u_etiqueta+";\n";
                                            temp+=posfinal+"="+posfinal+"+"+tempy.u_etiqueta+";\n";
                                        }
                                    }
                                    var postemp=generarEtiqueta();
                                    temp+=postemp+"="+eti_principio+"+"+posfinal+";\n";
                                    temp+="heap["+postemp+"]="+result_temp.u_etiqueta+";\n";
                                    
                                }else{
                                    var tempx;
                                    var posfinal=generarEtiqueta();
                                    for(var y=0;y<this.nodos[i].dimensiones.length;y++){
                                        this.nodos[i].dimensiones[y].ambitos=sim.entorno;
                                        if(y==0){
                                            tempx=this.nodos[i].dimensiones[y].getValue(entorno);
                                            temp+=tempx.cadena;
                                            var tamx=sim.lista_dimensiones[y].getValue(entorno);
                                            temp+=tamx.cadena;
                                            temp+=posfinal+"="+tempx.u_etiqueta+"*"+tamx.u_etiqueta+";\n";
                                        }else{
                                            var tempy=this.nodos[i].dimensiones[y].getValue(entorno);
                                            temp+=tempy.cadena;
                                            sim.lista_dimensiones[y].ambitos=sim.ambitos;
                                            var tamy=sim.lista_dimensiones[y].getValue(entorno);
                                            temp+=tamy.cadena;
                                            temp+=posfinal+"="+posfinal+"+"+tempy.u_etiqueta+";\n";
                                            if(y<this.nodos[i].dimensiones.length-1){
                                                temp+=posfinal+"="+posfinal+"*"+tamy.u_etiqueta+";\n";
                                            }
                                        }
                                    }
                                    var postemp=generarEtiqueta();
                                    temp+=postemp+"="+eti_principio+"+"+posfinal+";\n";
                                    temp+="heap["+postemp+"]="+result_temp.u_etiqueta+";\n";
                                }
                            }else{
                                alert("Error Semantico, Numero de dimensiones incorrectas para la asignacion del valor al arreglo primitivo");
                                temp="//empieza la asignacion ARREGLO PRIMITIVO\n";
                            }
                            temp+="//fin asignacion ARREGLO PRIMITIVO\n";
                        }else{
                            alert("Error Semantico, en la expresion a asignar a posicion de arreglo");
                        }
                    }else{

                        //terminar esta parte
                        /******* 
                         * 
                         * 
                         * 
                         * 
                        */
                        alert("Es una asignacion a un arreglo de objetos FALTA TERMINAR");
                    }
                }else{
                    alert("Error Semantico, Arreglo no existe en el entorno");
                }
                result.cadena+=temp;
            }else{
                //es cualquier otra instancia como una asignacion,llamada a metodo
                console.log("Es otra instancia");
            }
        }
        return result;
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
                    alert("Solo puede existir un elemento de visibilidad");
                }
            }
        }
        return indice;
    }
    generarNombre(id){
        var respuesta="";
        var indices="";
        respuesta+=id;
        for(var i=0;i<this.parametros.length;i++){
            if(this.parametros[i] instanceof Declaracion){
                indices+="_"+this.parametros[i].tipo;
            }else if(this.parametros[i] instanceof DeclaracionArreglos){
                indices+="_"+this.parametros[i].tipo;
            }
        }

        respuesta+=indices;
        return respuesta;
    }
    gettamMetodo(){
        var tam=2+this.parametros.length;
        for(var i=0;i<this.nodos.length;i++){
            if(this.nodos[i] instanceof Declaracion){
                tam++;
            }else if(this.nodos[i] instanceof DeclaracionArreglos){
                tam++;
            }
        }
        return tam;
    }

}