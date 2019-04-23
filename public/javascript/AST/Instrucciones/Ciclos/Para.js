class Para{
    //inicializado,condicion,aumento,nodos
    constructor(inicializado,condicion,aumento,nodos,tipo){
        this.inicializado=inicializado;
        this.condicion=condicion;
        this.aumento=aumento;
        this.nodos=nodos;
        this.ambitos="";
        this.tipo=tipo;//true es para un for normal, false es para un foreach
    }
    execute(entorno){
        var local=new Entorno(entorno);
        var result=new Result();
        var temp="";
        if(this.tipo){
            cargarSimbolosif(this.nodos,local,this.ambitos);
            var result_inicializado=null;
            if(this.inicializado.length>0){
                var ambi=this.ambitos;
                cargarSimbolosif(this.inicializado,entorno,this.ambitos);
                this.inicializado=this.inicializado[0];
                this.inicializado.ambitos=this.ambitos;
                result_inicializado=this.inicializado.execute(local);
            }else{
                this.inicializado.ambitos=this.ambitos;
                result_inicializado=this.inicializado.execute(local);
            }
            var eti_salida=generarSalto();
            pool_salida.push(eti_salida);
            //ASIGNACION INICIA
            if(result_inicializado!=null){
                temp+=result_inicializado.cadena;
                temp+="//empieza la asignacion variable local\n";
                var temph=generarEtiqueta();
                temp+=temph+"=h;\n";
                temp+="heap[h]="+result_inicializado.u_etiqueta+";\n";
                temp+="h=h+1;\n";
                var simulado=generarEtiqueta();
                var sim=local.obtener(this.inicializado.id+"_"+this.ambitos);
                temp+=simulado+"=p+"+sim.posRel+";\n";
                temp+="stack["+simulado+"]="+temph+";\n";
                temp+="//fin asignacion variable local\n";
            }else{               
            }
            this.condicion.ambitos=this.ambitos;
            var result_condicion=this.condicion.getValue(local);
            this.aumento.ambitos=this.ambitos;
            var result_aumento=this.aumento.getValue(local);
            var eti_regresa=generarSalto();
            temp+=eti_regresa+":\n";
            if(result_condicion!=null){
                temp+=result_condicion.cadena;
                temp+="if("+result_condicion.u_etiqueta+"==0) goto "+eti_salida+";\n";
            }
            for(var i=0;i<this.nodos.length;i++){
                if(this.nodos[i] instanceof Declaracion){
                    var ambi=this.ambitos;
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
                    this.nodos[i].ambitos=this.ambitos;
                    var result_temp=this.nodos[i].execute(local);
                    temp+=result_temp.cadena;
                }else if(this.nodos[i] instanceof Asignacion){
                    var ambi=this.ambitos;
                    this.nodos[i].ambitos=ambi;
                    var result_temp=this.nodos[i].execute(local);
                    if(result_temp!=null){
                        result.cadena+=result_temp.cadena;
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
                }else if(this.nodos[i] instanceof Si){
                    var ambi=this.ambitos;
                    this.nodos[i].ambitos=ambi;
                    var result_temp=this.nodos[i].execute(local);
                    //aca no vamos a recibir ninguna etiqueta ya que solo se ejecuta el if
                    if(result_temp!=null){  
                        temp+=result_temp.cadena;
                    }
                }else if(this.nodos[i] instanceof Selecciona){
                    var ambi=this.ambitos;
                    this.nodos[i].ambitos=ambi;
                    var result_temp=this.nodos[i].execute(local);
                    //aca no vamos a recibir ninguna etiqueta ya que solo se ejecuta el if
                    if(result_temp!=null){  
                        temp+=result_temp.cadena;
                    }
                }else if(this.nodos[i] instanceof Asignacion){
                    var ambi=this.ambitos;
                    this.nodos[i].ambitos=ambi;
                    var result_temp=this.nodos[i].execute(local);
                    if(result_temp!=null){
                        result.cadena+=result_temp.cadena;
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
                        temp+="//INICIA DETENER-------------------------\n";
                        var temp_salida=pool_salida.pop();
                        pool_salida.push(temp_salida);
                        this.u_etiqueta=true;
                        temp+="goto "+temp_salida+";\n";
                        temp+="//FINALIZA DETENER-------------------------\n";
                    }else{
                        alert("Error Semantico, la sentencia breake no corresponde a esta seccion de codigo");
                        console.log("tam pool "+pool_salida.length);
                    }
                }else if(this.nodos[i] instanceof Aritmetica){
                    if(this.nodos[i].unario){
                        var ambi=this.ambitos;
                        this.nodos[i].ambitos=ambi;
                        var result_temp=this.nodos[i].getValue(local);
                        if(result_temp!=null){  
                            temp+=result_temp.cadena;
                        }   
                    }else{
                        alert("Error Semantico, Operacion no Permitida, unicamente incremento y decremento");
                    }
                }else if(this.nodos[i] instanceof Para){
                    var ambi=this.ambitos;
                    this.nodos[i].ambitos=ambi;
                    var result_temp=this.nodos[i].execute(local);
                    if(result_temp!=null){  
                        result.cadena+=result_temp.cadena;
                    }
                }
            }
            temp+=result_aumento.cadena;
            temp+="goto "+eti_regresa+";\n";
            //FIN ASIGNACION
            temp+=eti_salida+":\n";
        }else{
            alert("soy un for each");
        }
        result.cadena+=temp;
        return result;
    }
}