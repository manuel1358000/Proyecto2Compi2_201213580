class Caso{
    constructor(condicion,nodos){
        this.condicion=condicion;
        this.nodos=nodos;
        this.ambitos="";
        this.salida="";
    }
    execute(entorno){
        var temp="";
        var temp_salida="";
        var result=new Result();
        var local=new Entorno(entorno);
        //cargamos todas las variables locales a la tabla de simbolos
        cargarSimbolosif(this.nodos,local,this.ambitos); 
        //vamos a recorrer todos los nodos que estan dentro de el caso del switch
        for(var i=0;i<this.nodos.length;i++){
            this.nodos[i].ambitos=this.ambitos;
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
            }else if(this.nodos[i] instanceof Detener){
                if(pool_salida.length>0){
                    var temp_salida=pool_salida.pop();
                    temp="goto "+temp_salida+";\n";
                }else{
                    alert("Error Semantico, la sentencia breake no corresponde a esta seccion de codigo");
                }
            }else if(this.nodos[i] instanceof Si){
                var ambi=this.ambitos;
                this.nodos[i].ambitos=ambi;
                var result_temp=this.nodos[i].execute(local);
                //aca no vamos a recibir ninguna etiqueta ya que solo se ejecuta el if
                if(result_temp!=null){  
                    temp+=result_temp.cadena;
                }
            }else if(this.nodos[i] instanceof Asignacion){
                var ambi=this.ambitos+"/"+this.id;
                console.log("revisar esto "+ambi);
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
            }else if(this.nodos[i] instanceof Selecciona){
                var ambi=this.ambitos;
                this.nodos[i].ambitos=ambi;
                var result_temp=this.nodos[i].execute(entorno);
                //aca no vamos a recibir ninguna etiqueta ya que solo se ejecuta el if
                if(result_temp!=null){  
                    temp+=result_temp.cadena;
                }
            }
        }
        result.cadena+=temp;
        return result;
    }
}