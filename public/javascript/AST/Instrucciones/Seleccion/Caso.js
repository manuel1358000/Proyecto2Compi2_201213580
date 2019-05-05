class Caso{
    constructor(condicion,nodos){
        this.condicion=condicion;
        this.nodos=nodos;
        this.ambitos="";
        this.salida="";
        this.padre="";
        this.normal="";
    }
    execute(entorno){
        var temp="";
        var temp_salida="";
        var result=new Result();
        var local=new Entorno(entorno);
        var temp_ambi="";
        if(this.padre=="main"){
            temp_ambi=this.ambitos+"/"+this.padre;
        }else{
            temp_ambi=this.ambitos;
        }
        this.u_etiqueta=false;
        //cargamos todas las variables locales a la tabla de simbolos
        cargarSimbolosif(this.nodos,local,temp_ambi); 
        //vamos a recorrer todos los nodos que estan dentro de el caso del switch
        for(var i=0;i<this.nodos.length;i++){
            this.nodos[i].ambitos=temp_ambi;
            if(this.nodos[i] instanceof Declaracion){
                var ambi=temp_ambi;
                this.nodos[i].ambitos=ambi;
                var result_temp=this.nodos[i].execute(local);
                if(result_temp!=null){
                    temp+=result_temp.cadena;
                    temp+="//declaracion variable local\n";
                    var temph=generarEtiqueta();
                    temp+=temph+"=h;\n";
                    temp+="heap[h]="+result_temp.u_etiqueta+";\n";
                    temp+="h=h+1;\n";
                    var simulado=generarEtiqueta();
                    var sim=local.obtener(this.nodos[i].id+"_"+ambi);
                    if(sim!=null){
                        temp+=simulado+"=p+"+sim.posRel+";\n";
                        temp+="stack["+simulado+"]="+temph+";\n";
                    }else{
                        alert("Error semantico, no se cuentra el simbolo en la tabla de simbolos");
                    }
                    temp+="//fin declaracion variable local\n";
                }else{
                    temp+="//declaracion variable local\n";
                    var temph=generarEtiqueta();
                    temp+=temph+"=h;\n";
                    temp+="heap[h]=0;\n";
                    temp+="h=h+1;\n";
                    var simulado=generarEtiqueta();
                    var sim=local.obtener(this.nodos[i].id+"_"+ambi);
                    temp+=simulado+"=p+"+sim.posRel+";\n";
                    temp+="stack["+simulado+"]="+temph+";\n";
                    temp+="//fin declaracion variable local\n";
                }
            }else if(this.nodos[i] instanceof Imprimir){
                this.nodos[i].ambitos=temp_ambi;
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
            }else if(this.nodos[i] instanceof Detener){
                if(pool_salida.length>0){
                    var temp_salida=pool_salida.pop();
                    pool_salida.push(temp_salida);
                    temp+="//------------------------------------------DETENER\n";
                    temp+="goto "+temp_salida+";\n";
                    temp+="//------------------------------------------DETENER\n";
                    this.u_etiqueta=true;
                }else{
                    alert("Error Semantico, la sentencia breake no corresponde a esta seccion de codigo");
                    console.log("tam pool "+pool_salida.length);
                }
            }else if(this.nodos[i] instanceof Mientras){
                var ambi=temp_ambi;
                this.nodos[i].ambitos=ambi;
                var result_temp=this.nodos[i].execute(local);
                if(result_temp!=null){  
                    temp+=result_temp.cadena;
                }
            }else if(this.nodos[i] instanceof Si){
                var ambi=temp_ambi;
                this.nodos[i].ambitos=ambi;
                var result_temp=this.nodos[i].execute(local);
                //aca no vamos a recibir ninguna etiqueta ya que solo se ejecuta el if
                this.u_etiqueta=result_temp.u_etiqueta;
                if(result_temp!=null){  
                    temp+=result_temp.cadena;
                }
            }else if(this.nodos[i] instanceof Asignacion){
                var ambi=temp_ambi;
                this.nodos[i].ambitos=ambi;
                var result_temp=this.nodos[i].execute(local);
                if(result_temp!=null){
                    temp+=result_temp.cadena;
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
                }else{
                   
                }
            }else if(this.nodos[i] instanceof Selecciona){
                var ambi=temp_ambi;
                this.nodos[i].ambitos=ambi;
                var result_temp=this.nodos[i].execute(local);
                //aca no vamos a recibir ninguna etiqueta ya que solo se ejecuta el if
                if(result_temp!=null){  
                    temp+=result_temp.cadena;
                }
            }else if(this.nodos[i] instanceof Aritmetica){
                if(this.nodos[i].unario){
                    var ambi=temp_ambi;
                    this.nodos[i].ambitos=ambi;
                    var result_temp=this.nodos[i].getValue(local);
                    if(result_temp!=null){  
                        temp+=result_temp.cadena;
                    }   
                }else{
                    alert("Error Semantico, Operacion no Permitida, unicamente incremento y decremento");
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
            }else if(this.nodos[i] instanceof Para){
                var ambi=temp_ambi;
                this.nodos[i].ambitos=ambi;
                var result_temp=this.nodos[i].execute(local);
                if(result_temp!=null){  
                    temp+=result_temp.cadena;
                    
                }
            }else if(this.nodos[i] instanceof Retorno){
                this.nodos[i].ambitos=this.ambitos;
                this.nodos[i].padre=this.padre;
                this.nodos[i].normal=this.normal;
                var result_temp=this.nodos[i].getValue(local);
                //aca no vamos a recibir ninguna etiqueta ya que solo se ejecuta el if
                if(result_temp!=null){  
                    temp+=result_temp.cadena;
                }
            }else if(this.nodos[i] instanceof DeclaracionArreglos){
                var ambi=temp_ambi;
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
            }else{
                console.log("Instancia rara case");
            }
        }
        result.cadena+=temp;
        return result;
    }
}