class Mientras{
    constructor(condicion,nodos,tipo){
        this.condicion=condicion;
        this.nodos=nodos;
        this.tipo=tipo;//true es while,false es dowhile
        this.ambitos="";
        this.padre="";
        this.normal="";
        this.codigo=codigo;
        codigo++;
    }
    execute(entorno){
        var result=new Result();
        var local=new Entorno(entorno);
        var temp="";
        var temp_ambi="";
        if(this.padre=="main"){
            temp_ambi=this.ambitos+"/"+this.padre;
        }else{
            temp_ambi=this.ambitos;
        }
        var etiinicio=generarSalto();
        var etisalida=generarSalto();
        this.condicion.ambitos=temp_ambi;
        this.condicion.padre=this.padre;
        this.condicion.normal=this.normal;
        var result_condi=this.condicion.getValue(entorno);
        var tipo_condi=this.condicion.getTipe(entorno);
        if(this.tipo){
            if(result_condi!=null){
                if(tipo_condi=="BOOLEAN"){
                    cargarSimbolosif(this.nodos,local,temp_ambi);
                    temp+=etiinicio+":\n";
                    temp+=result_condi.cadena;
                    temp+="if("+result_condi.u_etiqueta+"==0) goto "+etisalida+";\n";
                    pool_salida.push(etisalida);    
                    for(var i=0;i<this.nodos.length;i++){
                        if(this.nodos[i] instanceof Declaracion){
                            var ambi=temp_ambi;
                            this.nodos[i].padre=this.padre;
                            this.nodos[i].normal=this.normal;
                            this.nodos[i].ambitos=ambi;
                            var result_temp=this.nodos[i].execute(local);
                            var tipo_result=this.nodos[i].getTipe(local);
                            if(!numerico(tipo_result)){
                                if(result_temp!=null){
                                    temp+=result_temp.cadena;
                                    temp+="//declaracion OBJETO local\n";
                                    var temph=generarEtiqueta();
                                    temp+=temph+"=h;\n";
                                    temp+="heap[h]="+result_temp.u_etiqueta+";\n";
                                    temp+="h=h+1;\n";
                                    var simulado=generarEtiqueta();
                                    var sim=local.obtener(this.nodos[i].id+"_"+temp_ambi);
                                    if(sim!=null){
                                        temp+=simulado+"=p+"+sim.posRel+";\n";
                                        temp+="stack["+simulado+"]="+temph+";\n";
                                        temp+="//fin declaracion variable local\n";
                                        sim.inicializado=true;
                                        local.actualizar(this.nodos[i].id+"_"+temp_ambi,sim);
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
                                    var sim=local.obtener(this.nodos[i].id+"_"+temp_ambi);
                                    temp+=simulado+"=p+"+sim.posRel+";\n";
                                    temp+="stack["+simulado+"]="+temph+";\n";
                                    temp+="//fin declaracion variable local\n";
                                    sim.inicializado=result_temp.inicializado;
                                    local.actualizar(this.nodos[i].id+"_"+temp_ambi,sim);
                                }else{
                                    temp="//declaracion variable local\n";
                                    var temph=generarEtiqueta();
                                    temp+=temph+"=h;\n";
                                    temp+="heap[h]=0;\n";
                                    temp+="h=h+1;\n";
                                    var simulado=generarEtiqueta();
                                    var sim=local.obtener(this.nodos[i].id+"_"+temp_ambi);
                                    temp+=simulado+"=p+"+sim.posRel+";\n";
                                    temp+="stack["+simulado+"]="+temph+";\n";
                                    temp+="//fin declaracion variable local\n";
                                    sim.inicializado=false;
                                    local.actualizar(this.nodos[i].id+"_"+temp_ambi,sim);
                                }
                            }
                        }else if(this.nodos[i] instanceof Imprimir){
                            this.nodos[i].padre=this.padre;
                            this.nodos[i].normal=this.normal;
                            this.nodos[i].ambitos=this.ambitos;
                            var temp_tam=0;
                            if(this.padre=="main"){
                                var sim_temp=local.obtener("main");
                                temp_tam=sim_temp.tamanio;
                            }else{
                                var sim_temp=local.obtener(temp_ambi.replace("/","_"));
                                temp_tam=sim_temp.tamanio;
                            }
                            this.nodos[i].tam=temp_tam;
                            var result_temp=this.nodos[i].execute(local);
                            temp+=result_temp.cadena;
                        }else if(this.nodos[i] instanceof Asignacion){
                            var ambi=temp_ambi;
                            this.nodos[i].padre=this.padre;
                            this.nodos[i].normal=this.normal;
                            this.nodos[i].ambitos=temp_ambi;
                            var result_temp=this.nodos[i].execute(local);
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
                                    var sim=local.obtener(this.nodos[i].id+"_"+ambi);
                                    temp+=simulado+"=p+"+sim.posRel+";\n";
                                    temp+="stack["+simulado+"]="+temph+";\n";
                                    temp+="//fin asignacion variable local\n";
                                    if(verificarFinal(sim.modificadores)&&sim.inicializado==true){
                                        alert("Error Semantico, la variable final "+sim.nombre+" ya ha sido inicializada");
                                        temp="";
                                    }else{
                                        sim.inicializado=true;
                                        local.actualizar(this.nodos[i].id+"_"+ambi,sim);
                                    }
                                }
                            }else{   
                            }
                        }else if(this.nodos[i] instanceof Si){
                            var ambi=temp_ambi;
                            this.nodos[i].padre=this.padre;
                            this.nodos[i].normal=this.normal;
                            this.nodos[i].ambitos=ambi;
                            var result_temp=this.nodos[i].execute(local);
                            //aca no vamos a recibir ninguna etiqueta ya que solo se ejecuta el if
                            if(result_temp!=null){  
                                temp+=result_temp.cadena;
                            }
                        }else if(this.nodos[i] instanceof Selecciona){
                            var ambi=temp_ambi;
                            this.nodos[i].padre=this.padre;
                            this.nodos[i].normal=this.normal;
                            this.nodos[i].ambitos=ambi;
                            var result_temp=this.nodos[i].execute(local);
                            //aca no vamos a recibir ninguna etiqueta ya que solo se ejecuta el if
                            if(result_temp!=null){  
                                temp+=result_temp.cadena;
                            }
                        }else if(this.nodos[i] instanceof Detener){
                            if(pool_salida.length>0){
                                temp+="//INICIA DETENER-------------------------\n";
                                var temp_salida=pool_salida.pop();
                                temp+="goto "+temp_salida+";\n";
                                temp+="//FINALIZA DETENER-------------------------\n";
                            }else{
                                alert("Error Semantico, la sentencia breake no corresponde a esta seccion de codigo");
                            }
                        }else if(this.nodos[i] instanceof Mientras){
                            var ambi=temp_ambi;
                            this.nodos[i].padre=this.padre;
                            this.nodos[i].normal=this.normal;
                            this.nodos[i].ambitos=ambi;
                            var result_temp=this.nodos[i].execute(local);
                            if(result_temp!=null){  
                                temp+=result_temp.cadena;
                            }
                        }else if(this.nodos[i] instanceof Aritmetica){
                            if(this.nodos[i].unario){
                                var ambi=temp_ambi;
                                this.nodos[i].padre=this.padre;
                                this.nodos[i].normal=this.normal;
                                this.nodos[i].ambitos=ambi;
                                var result_temp=this.nodos[i].getValue(local);
                                if(result_temp!=null){  
                                    temp+=result_temp.cadena;
                                }   
                            }else{
                                alert("Error Semantico, Operacion no Permitida, unicamente incremento y decremento");
                            }
                        }else if(this.nodos[i] instanceof Para){
                            var ambi=temp_ambi;
                            this.nodos[i].padre=this.padre;
                            this.nodos[i].normal=this.normal;
                            this.nodos[i].ambitos=ambi;
                            var result_temp=this.nodos[i].execute(local);
                            if(result_temp!=null){  
                                temp+=result_temp.cadena;
                            }
                        }else if(this.nodos[i] instanceof Llamada_Metodo){
                            this.nodos[i].ambitos=this.ambitos;
                            this.nodos[i].padre=this.padre;
                            this.nodos[i].normal=this.normal;
                            var result_temp=this.nodos[i].getValue(local);
                            temp+="//INICIA LLAMADA A METODO\n"
                            if(result_temp!=null){
                                temp+=result_temp.cadena;
                            }
                            temp+="//FINALIZA LLAMADA A METODO\n";
                            
                        }else if(this.nodos[i] instanceof Retorno){
                            this.nodos[i].ambitos=this.ambitos;
                            this.nodos[i].padre=this.padre;
                            this.nodos[i].normal=this.normal;
                            var result_temp=this.nodos[i].getValue(local);
                            //aca no vamos a recibir ninguna etiqueta ya que solo se ejecuta el if
                            if(result_temp!=null){  
                                temp+=result_temp.cadena;
                                if(result_temp.lista_dimensiones.length>0){
                                    result.lista_dimensiones=result_temp.lista_dimensiones;
                                }
                            }
                        }else if(this.nodos[i] instanceof DeclaracionArreglos){
                            var ambi=temp_ambi;
                            this.nodos[i].padre=this.padre;
                            this.nodos[i].normal=this.normal;
                            this.nodos[i].ambitos=ambi;
                            var result_temp=this.nodos[i].execute(local);
                            var tipo_result=this.nodos[i].getTipe(local);
                            if(result_temp!=null){
                                temp+="//declaracion ARRAY local\n";
                                temp+=result_temp.cadena;
                                var simulado=generarEtiqueta();
                                var sim=local.obtener(this.nodos[i].id+"_"+ambi);
                                temp+=simulado+"=p+"+sim.posRel+";\n";
                                temp+="stack["+simulado+"]="+result_temp.u_etiqueta+";//asigna el puntero del heap donde inicia el array\n";
                                temp+="//fin declaracion variable local\n";
                                if(this.nodos[i].inicializado==true){
                                    sim.inicializado=true;
                                    sim.lista_dimensiones=this.nodos[i].lista_dimensiones;
                                }else{
                                    sim.inicializado=false;
                                }
                                local.actualizar(this.nodos[i].id+"_"+ambi,sim);
                            }else{
                                alert("Error Semantico, en la operacion declaracion arreglos");
                            }        
                        }else if(this.nodos[i] instanceof AsignacionArreglos){
                            var ambi=temp_ambi;
                            this.nodos[i].padre=this.padre;
                            this.nodos[i].normal=this.normal;
                            this.nodos[i].ambitos=ambi;
                            var result_temp=this.nodos[i].execute(local);
                            var temp="";
                            var sim=local.obtener(this.nodos[i].id+"_"+ambi);
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
                        }else if(this.nodos[i] instanceof AccesoObjetos){
                            var ambi=temp_ambi;
                            this.nodos[i].padre=this.padre;
                            this.nodos[i].normal=this.normal;
                            this.nodos[i].ambitos=ambi;
                            var result_temp=this.nodos[i].getValue(local);
                            temp+="//INICIA LLAMADA A METODO OBJETO\n"
                            if(result_temp!=null){
                                temp+=result_temp.cadena;
                            }
                            temp+="//FINALIZA LLAMADA A METODO OBJETO\n";
                        }else if(this.nodos[i] instanceof AsignacionObjetos){
                            var ambi=temp_ambi;
                            this.nodos[i].padre=this.padre;
                            this.nodos[i].normal=this.normal;
                            this.nodos[i].ambitos=ambi;
                            var result_temp=this.nodos[i].getValue(local);
                            temp+="//INICIA LLAMADA A METODO OBJETO\n"
                            if(result_temp!=null){
                                temp+=result_temp.cadena;
                            }
                            temp+="//FINALIZA LLAMADA A METODO OBJETO\n";
                        }else{
                            console.log("Instancia rara while");
                        }
                    }
                    temp+="goto "+etiinicio+";\n";
                }else{
                    alert("Error Semantico, condicion del while debe de ser boolean");
                }
            }else{
                alert("Error Semantico, condicion del while no valida");
            }

        }else{
            pool_salida.push(etisalida);
            temp+=etiinicio+":\n";
            for(var i=0;i<this.nodos.length;i++){
                if(this.nodos[i] instanceof Declaracion){
                    var ambi=temp_ambi;
                    this.nodos[i].padre=this.padre;
                    this.nodos[i].normal=this.normal;
                    this.nodos[i].ambitos=ambi;
                    var result_temp=this.nodos[i].execute(local);
                    var tipo_result=this.nodos[i].getTipe(local);
                    if(!numerico(tipo_result)){
                        if(result_temp!=null){
                            temp+=result_temp.cadena;
                            temp+="//declaracion OBJETO local\n";
                            var temph=generarEtiqueta();
                            temp+=temph+"=h;\n";
                            temp+="heap[h]="+result_temp.u_etiqueta+";\n";
                            temp+="h=h+1;\n";
                            var simulado=generarEtiqueta();
                            var sim=local.obtener(this.nodos[i].id+"_"+temp_ambi);
                            if(sim!=null){
                                temp+=simulado+"=p+"+sim.posRel+";\n";
                                temp+="stack["+simulado+"]="+temph+";\n";
                                temp+="//fin declaracion variable local\n";
                                sim.inicializado=result_temp.inicializado; 
                                local.actualizar(this.nodos[i].id+"_"+temp_ambi,sim);
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
                            var sim=local.obtener(this.nodos[i].id+"_"+temp_ambi);
                            temp+=simulado+"=p+"+sim.posRel+";\n";
                            temp+="stack["+simulado+"]="+temph+";\n";
                            temp+="//fin declaracion variable local\n";
                            sim.inicializado=true;
                            local.actualizar(this.nodos[i].id+"_"+temp_ambi,sim);
                        }else{
                            temp="//declaracion variable local\n";
                            var temph=generarEtiqueta();
                            temp+=temph+"=h;\n";
                            temp+="heap[h]=0;\n";
                            temp+="h=h+1;\n";
                            var simulado=generarEtiqueta();
                            var sim=local.obtener(this.nodos[i].id+"_"+temp_ambi);
                            temp+=simulado+"=p+"+sim.posRel+";\n";
                            temp+="stack["+simulado+"]="+temph+";\n";
                            temp+="//fin declaracion variable local\n";
                            sim.inicializado=false;
                            local.actualizar(this.nodos[i].id+"_"+temp_ambi,sim);
                        }
                    }
                }else if(this.nodos[i] instanceof Imprimir){
                    this.nodos[i].padre=this.padre;
                    this.nodos[i].normal=this.normal;
                    this.nodos[i].ambitos=this.ambitos;
                    var temp_tam=0;
                    if(this.padre=="main"){
                        var sim_temp=local.obtener("main");
                        temp_tam=sim_temp.tamanio;
                    }else{
                        var sim_temp=local.obtener(temp_ambi.replace("/","_"));
                        temp_tam=sim_temp.tamanio;
                    }
                    this.nodos[i].tam=temp_tam;
                    var result_temp=this.nodos[i].execute(local);
                    temp+=result_temp.cadena;
                }else if(this.nodos[i] instanceof Asignacion){
                    var ambi=temp_ambi;
                    this.nodos[i].padre=this.padre;
                    this.nodos[i].normal=this.normal;
                    this.nodos[i].ambitos=this.ambitos;
                    var result_temp=this.nodos[i].execute(local);
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
                            var sim=local.obtener(this.nodos[i].id+"_"+ambi);
                            temp+=simulado+"=p+"+sim.posRel+";\n";
                            temp+="stack["+simulado+"]="+temph+";\n";
                            temp+="//fin asignacion variable local\n";
                            if(verificarFinal(sim.modificadores)&&sim.inicializado==true){
                                alert("Error Semantico, la variable final "+sim.nombre+" ya ha sido inicializada");
                                temp="";
                            }else{
                                sim.inicializado=true;
                                local.actualizar(this.nodos[i].id+"_"+ambi,sim);
                            }
                        }
                    }else{   
                    }
                }else if(this.nodos[i] instanceof Si){
                    var ambi=temp_ambi;
                    this.nodos[i].padre=this.padre;
                    this.nodos[i].normal=this.normal;
                    this.nodos[i].ambitos=ambi;
                    var result_temp=this.nodos[i].execute(local);
                    //aca no vamos a recibir ninguna etiqueta ya que solo se ejecuta el if
                    if(result_temp!=null){  
                        temp+=result_temp.cadena;
                    }
                }else if(this.nodos[i] instanceof Selecciona){
                    var ambi=temp_ambi;
                    this.nodos[i].padre=this.padre;
                    this.nodos[i].normal=this.normal;
                    this.nodos[i].ambitos=ambi;
                    var result_temp=this.nodos[i].execute(local);
                    //aca no vamos a recibir ninguna etiqueta ya que solo se ejecuta el if
                    if(result_temp!=null){  
                        temp+=result_temp.cadena;
                    }
                }else if(this.nodos[i] instanceof Detener){
                    if(pool_salida.length>0){
                        temp+="//INICIA DETENER-------------------------\n";
                        var temp_salida=pool_salida.pop();
                        temp+="goto "+temp_salida+";\n";
                        temp+="//FINALIZA DETENER-------------------------\n";
                    }else{
                        alert("Error Semantico, la sentencia breake no corresponde a esta seccion de codigo");
                    }
                }else if(this.nodos[i] instanceof Aritmetica){
                    if(this.nodos[i].unario){
                        var ambi=temp_ambi;
                        this.nodos[i].padre=this.padre;
                        this.nodos[i].normal=this.normal;
                        this.nodos[i].ambitos=ambi;
                        var result_temp=this.nodos[i].getValue(local);
                        if(result_temp!=null){  
                            temp+=result_temp.cadena;
                        }   
                    }else{
                        alert("Error Semantico, Operacion no Permitida, unicamente incremento y decremento");
                    }
                }else if(this.nodos[i] instanceof Para){
                    var ambi=temp_ambi;
                    this.nodos[i].padre=this.padre;
                    this.nodos[i].normal=this.normal;
                    this.nodos[i].ambitos=ambi;
                    var result_temp=this.nodos[i].execute(local);
                    if(result_temp!=null){  
                        result.cadena+=result_temp.cadena;
                    }
                }else if(this.nodos[i] instanceof Mientras){
                    var ambi=temp_ambi;
                    this.nodos[i].padre=this.padre;
                    this.nodos[i].normal=this.normal;
                    this.nodos[i].ambitos=ambi;
                    var result_temp=this.nodos[i].execute(local);
                    if(result_temp!=null){  
                        temp+=result_temp.cadena;
                    }
                }else if(this.nodos[i] instanceof Llamada_Metodo){
                    this.nodos[i].ambitos=this.ambitos;
                    this.nodos[i].padre=this.padre;
                    this.nodos[i].normal=this.normal;
                    var result_temp=this.nodos[i].getValue(local);
                    temp+="//INICIA LLAMADA A METODO\n"
                    if(result_temp!=null){
                        temp+=result_temp.cadena;
                    }
                    temp+="//FINALIZA LLAMADA A METODO\n";
                    
                }else if(this.nodos[i] instanceof Retorno){
                    this.nodos[i].ambitos=this.ambitos;
                    this.nodos[i].padre=this.padre;
                    this.nodos[i].normal=this.normal;
                    var result_temp=this.nodos[i].getValue(local);
                    //aca no vamos a recibir ninguna etiqueta ya que solo se ejecuta el if
                    if(result_temp!=null){  
                        temp+=result_temp.cadena;
                        if(result_temp.lista_dimensiones.length>0){
                            result.lista_dimensiones=result_temp.lista_dimensiones;
                        }
                    }
                }else if(this.nodos[i] instanceof DeclaracionArreglos){
                    var ambi=temp_ambi;
                    this.nodos[i].padre=this.padre;
                    this.nodos[i].normal=this.normal;
                    this.nodos[i].ambitos=ambi;
                    var result_temp=this.nodos[i].execute(local);
                    var tipo_result=this.nodos[i].getTipe(local);
                    if(result_temp!=null){
                        temp+="//declaracion ARRAY local\n";
                        temp+=result_temp.cadena;
                        var simulado=generarEtiqueta();
                        var sim=local.obtener(this.nodos[i].id+"_"+ambi);
                        temp+=simulado+"=p+"+sim.posRel+";\n";
                        temp+="stack["+simulado+"]="+result_temp.u_etiqueta+";//asigna el puntero del heap donde inicia el array\n";
                        temp+="//fin declaracion variable local\n";
                        if(this.nodos[i].inicializado==true){
                            sim.inicializado=true;
                            sim.lista_dimensiones=this.nodos[i].lista_dimensiones;
                        }else{
                            sim.inicializado=false;
                        }
                        local.actualizar(this.nodos[i].id+"_"+ambi,sim);
                    }else{
                        alert("Error Semantico, en la operacion declaracion arreglos");
                    }        
                }else if(this.nodos[i] instanceof AsignacionArreglos){
                    var ambi=temp_ambi;
                    this.nodos[i].padre=this.padre;
                    this.nodos[i].normal=this.normal;
                    this.nodos[i].ambitos=ambi;
                    var result_temp=this.nodos[i].execute(local);
                    var sim=local.obtener(this.nodos[i].id+"_"+ambi);
                    if(sim!=null){
                        if(numerico(sim.tipo)){
                            if(result_temp!=null){
                                temp+=result_temp.cadena;
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
                                        var posx=this.nodos[i].dimensiones[0].getValue(local);
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
                                                tempx=this.nodos[i].dimensiones[y].getValue(local);
                                                temp+=tempx.cadena;
                                            }else{
                                                var tempy=this.nodos[i].dimensiones[y].getValue(local);
                                                temp+=tempy.cadena;
                                                sim.lista_dimensiones[y].ambitos=sim.ambitos;
                                                var tamy=sim.lista_dimensiones[y].getValue(local);
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
                                                tempx=this.nodos[i].dimensiones[y].getValue(local);
                                                temp+=tempx.cadena;
                                                var tamx=sim.lista_dimensiones[y].getValue(local);
                                                temp+=tamx.cadena;
                                                temp+=posfinal+"="+tempx.u_etiqueta+"*"+tamx.u_etiqueta+";\n";
                                            }else{
                                                var tempy=this.nodos[i].dimensiones[y].getValue(local);
                                                temp+=tempy.cadena;
                                                sim.lista_dimensiones[y].ambitos=sim.ambitos;
                                                var tamy=sim.lista_dimensiones[y].getValue(local);
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
                }else if(this.nodos[i] instanceof AccesoObjetos){
                    var ambi=temp_ambi;
                    this.nodos[i].padre=this.padre;
                    this.nodos[i].normal=this.normal;
                    this.nodos[i].ambitos=ambi;
                    var result_temp=this.nodos[i].getValue(local);
                    temp+="//INICIA LLAMADA A METODO OBJETO\n"
                    if(result_temp!=null){
                        temp+=result_temp.cadena;
                    }
                    temp+="//FINALIZA LLAMADA A METODO OBJETO\n";
                }else if(this.nodos[i] instanceof AsignacionObjetos){
                    var ambi=temp_ambi;
                    this.nodos[i].padre=this.padre;
                    this.nodos[i].normal=this.normal;
                    this.nodos[i].ambitos=ambi;
                    var result_temp=this.nodos[i].getValue(local);
                    temp+="//INICIA LLAMADA A METODO OBJETO\n"
                    if(result_temp!=null){
                        temp+=result_temp.cadena;
                    }
                    temp+="//FINALIZA LLAMADA A METODO OBJETO\n";
                }else{
                    console.log("instancia rara do while");
                }
            }
            temp+=result_condi.cadena;
            temp+="if("+result_condi.u_etiqueta+"==0) goto "+etisalida+";\n";
            temp+="goto "+etiinicio+";\n";
        }
        temp+=etisalida+":\n";
        result.cadena+=temp;
        return result;
    }
}