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
                var result_temp=this.nodos[i].execute(entorno);
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
            }
        }
        result.cadena+=temp;
        return result;
    }
}