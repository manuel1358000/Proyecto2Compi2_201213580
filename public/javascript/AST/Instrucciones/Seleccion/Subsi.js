class Subsi{
    constructor(condicion,nodos){
        this.condicion=condicion;
        this.nodos=nodos;
        this.ambitos="";
        this.padre="";
        this.normal="";
    }
    execute(entorno){//aqui ya viene el entorno local, no hay que moverle nada
        var result=new Result();
        var local=new Entorno(entorno);
        var temp="";
        var temp_ambi="";
        if(this.padre=="main"){
            temp_ambi=this.ambitos+"/"+this.padre;
        }else{
            temp_ambi=this.ambitos;
        }
        this.u_etiqueta=false;
        if(this.condicion!=null){
            this.condicion.ambitos=temp_ambi;
            this.condicion.padre=this.padre;
            this.condicion.normal=this.normal;
            var result_condicion=this.condicion.getValue(entorno);
            var tipo_condicion=this.condicion.getTipe(entorno);
            if(tipo_condicion=="BOOLEAN"){
                //primer pasada para cargar todas las variables
                cargarSimbolosif(this.nodos,local,temp_ambi); 
                var etif=generarSalto();
                temp+=result_condicion.cadena;
                result.u_etiqueta=etif;
                temp+="if("+result_condicion.u_etiqueta+"==0) goto "+etif+";\n";
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
                    }else if(this.nodos[i] instanceof Si){
                        var ambi=temp_ambi;
                        this.nodos[i].ambitos=ambi;
                        var result_temp=this.nodos[i].execute(local);
                        //aca no vamos a recibir ninguna etiqueta ya que solo se ejecuta el if
                        if(result_temp!=null){  
                            temp+=result_temp.cadena;
                            this.u_etiqueta=result_temp.u_etiqueta;
                        }
                    }else if(this.nodos[i] instanceof Selecciona){
                        var ambi=temp_ambi;
                        this.nodos[i].ambitos=ambi;
                        var result_temp=this.nodos[i].execute(local);
                        //aca no vamos a recibir ninguna etiqueta ya que solo se ejecuta el if
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
                    }else if(this.nodos[i] instanceof Detener){
                        if(pool_salida.length>0){
                            temp+="//inicia detener -----------------------------\n";
                            var temp_salida=pool_salida.pop();
                            pool_salida.push(temp_salida);
                            this.u_etiqueta=true;
                            temp+="goto "+temp_salida+";\n";
                            temp+="//finaliza detener -----------------------------\n";
                        }else{
                            alert("Error Semantico, la sentencia breake no corresponde a esta seccion de codigo");
                        }
                    }else if(this.nodos[i] instanceof Mientras){
                        var ambi=temp_ambi;
                        this.nodos[i].ambitos=ambi;
                        var result_temp=this.nodos[i].execute(entorno);
                        if(result_temp!=null){  
                            temp+=result_temp.cadena;
                        }
                    }else if(this.nodos[i] instanceof Aritmetica){
                        if(this.nodos[i].unario){
                            var ambi=temp_ambi;
                            this.nodos[i].ambitos=ambi;
                            var result_temp=this.nodos[i].getValue(entorno);
                            if(result_temp!=null){  
                                temp+=result_temp.cadena;
                            }   
                        }else{
                            alert("Error Semantico, Operacion no Permitida, unicamente incremento y decremento");
                        }
                    }else if(this.nodos[i] instanceof Para){
                        var ambi=temp_ambi;
                        this.nodos[i].ambitos=ambi;
                        var result_temp=this.nodos[i].execute(local);
                        if(result_temp!=null){  
                            temp+=result_temp.cadena;
                        }
                    }else if(this.nodos[i] instanceof Llamada_Metodo){
                        this.nodos[i].ambitos=this.ambitos;
                        this.nodos[i].padre=this.padre;
                        this.nodos[i].normal=this.normal;
                        var result_temp=this.nodos[i].getValue(entorno);
                        temp+="//INICIA LLAMADA A METODO\n"
                        if(result_temp!=null){
                            temp+=result_temp.cadena;
                        }
                        temp+="//FINALIZA LLAMADA A METODO\n";
                    }else if(this.nodos[i] instanceof Retorno){
                        this.nodos[i].ambitos=this.ambitos;
                        this.nodos[i].padre=this.padre;
                        this.nodos[i].normal=this.normal;
                        var result_temp=this.nodos[i].getValue(entorno);
                        //aca no vamos a recibir ninguna etiqueta ya que solo se ejecuta el if
                        if(result_temp!=null){  
                            temp+=result_temp.cadena;
                        }
                    }
                }
            }else{
                alert("Error Semantico, La condicion de un else if debe de ser boolean");
            }
            
        }else{
            //esta entrando al ELSE
            //entonces es un else
            //primer pasada para cargar todas las variables
            cargarSimbolosif(this.nodos,local,temp_ambi);    
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
                }else if(this.nodos[i] instanceof Si){
                    var ambi=temp_ambi;
                    this.nodos[i].ambitos=ambi;
                    var result_temp=this.nodos[i].execute(local);
                    //aca no vamos a recibir ninguna etiqueta ya que solo se ejecuta el if
                    if(result_temp!=null){  
                        temp+=result_temp.cadena;
                        this.u_etiqueta=result_temp.u_etiqueta;
                    }
                }else if(this.nodos[i] instanceof Selecciona){
                    var ambi=temp_ambi;
                    this.nodos[i].ambitos=ambi;
                    var result_temp=this.nodos[i].execute(local);
                    //aca no vamos a recibir ninguna etiqueta ya que solo se ejecuta el if
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
                }else if(this.nodos[i] instanceof Detener){
                    if(pool_salida.length>0){
                        temp+="//inicia detener -----------------------------\n";
                        var temp_salida=pool_salida.pop();
                        pool_salida.push(temp_salida);
                        this.u_etiqueta=true;
                        temp+="goto "+temp_salida+";\n";
                        temp+="//finaliza detener -----------------------------\n";
                    }else{
                        alert("Error Semantico, la sentencia breake no corresponde a esta seccion de codigo");
                        console.log("tam pool "+pool_salida.length);
                    }
                }else if(this.nodos[i] instanceof Mientras){
                    var ambi=temp_ambi;
                    this.nodos[i].ambitos=ambi;
                    var result_temp=this.nodos[i].execute(entorno);
                    if(result_temp!=null){  
                        temp+=result_temp.cadena;
                    }
                }else if(this.nodos[i] instanceof Aritmetica){
                    if(this.nodos[i].unario){
                        var ambi=temp_ambi;
                        this.nodos[i].ambitos=ambi;
                        var result_temp=this.nodos[i].getValue(entorno);
                        if(result_temp!=null){  
                            temp+=result_temp.cadena;
                        }   
                    }else{
                        alert("Error Semantico, Operacion no Permitida, unicamente incremento y decremento");
                    }
                }else if(this.nodos[i] instanceof Para){
                    var ambi=temp_ambi;
                    this.nodos[i].ambitos=ambi;
                    var result_temp=this.nodos[i].execute(local);
                    if(result_temp!=null){  
                        temp+=result_temp.cadena;
                    }
                }else if(this.nodos[i] instanceof Llamada_Metodo){
                    this.nodos[i].ambitos=this.ambitos;
                    this.nodos[i].padre=this.padre;
                    this.nodos[i].normal=this.normal;
                    var result_temp=this.nodos[i].getValue(entorno);
                    temp+="//INICIA LLAMADA A METODO\n"
                    if(result_temp!=null){
                        temp+=result_temp.cadena;
                    }
                    temp+="//FINALIZA LLAMADA A METODO\n";
                }else if(this.nodos[i] instanceof Retorno){
                    this.nodos[i].ambitos=this.ambitos;
                    this.nodos[i].padre=this.padre;
                    this.nodos[i].normal=this.normal;
                    var result_temp=this.nodos[i].getValue(entorno);
                    //aca no vamos a recibir ninguna etiqueta ya que solo se ejecuta el if
                    if(result_temp!=null){  
                        temp+=result_temp.cadena;
                    }
                }
            }
        }
        result.cadena+=temp;
        return result;
    }
}