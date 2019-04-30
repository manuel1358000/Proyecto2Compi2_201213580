class Si{
    constructor(condicion,nodos,subifs,defecto){
        this.condicion=condicion;
        this.nodos=nodos;
        this.subifs=subifs;
        this.defecto=defecto;
        this.ambitos="";
        this.padre="";
        this.normal="";
    }
    execute(entorno){
        var condi=true;
        var temp="";
        var local=new Entorno(entorno);
        var temp_ambi="";
        if(this.padre=="main"){
            temp_ambi=this.ambitos+"/"+this.padre;
        }else{
            temp_ambi=this.ambitos;
        }
        var result=new Result();
        this.u_etiqueta=false;
        //vamos a evaluar la condicion del if principal
        this.condicion.ambitos=temp_ambi;
        var result_condi=this.condicion.getValue(entorno);
        var tipo_condi=this.condicion.getTipe(entorno);
        var etif=generarSalto();
        var etisalida=generarSalto();
        if(result_condi!=null){
            if(tipo_condi=="BOOLEAN"){
                //tenemos que recorrer dentro de cada if y subif para ver si hay declaracion y estas las vamos a guardar en la tabla de simbolos local
                //PRIMERA PASADA
                cargarSimbolosif(this.nodos,local,temp_ambi);    
                //SEGUNDA PASADA
                //aqui tengo que evaluar el camino por el cual se va a tomar la decision
                temp+="//INICIA VALIDACION DEL IF\n";
                temp+=result_condi.cadena;
                temp+="if("+result_condi.u_etiqueta+"==0) goto "+etif+";\n";
                for(var i=0;i<this.nodos.length;i++){
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
                        var result_temp=this.nodos[i].execute(local);
                        temp+=result_temp.cadena;
                    }else if(this.nodos[i] instanceof Asignacion){
                        var ambi=temp_ambi;
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
                        var ambi=temp_ambi;
                        this.nodos[i].ambitos=ambi;
                        var result_temp=this.nodos[i].execute(local);
                        //aca no vamos a recibir ninguna etiqueta ya que solo se ejecuta el if
                        if(result_temp!=null){  
                            temp+=result_temp.cadena;
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
                            var result_temp=this.nodos[i].getValue(local);
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
                        var result_temp=this.nodos[i].execute(entorno);
                        temp+="//INICIA LLAMADA A METODO\n"
                        if(result_temp!=null){
                            temp+=result_temp.cadena;
                        }
                        temp+="//FINALIZA LLAMADA A METODO\n";
                    }
                }
                temp+="goto "+etisalida+";\n";
                
            }else{
                alert("Error Semantico, la condicion del if debe de ser booleana");
            }
        }
        if(this.subifs.length>0){
            var localif=new Entorno(entorno);
            temp+=etif+":\n";
            condi=false;
            for(var i=0;i<this.subifs.length;i++){
                this.subifs[i].ambitos=this.ambitos;
                this.subifs[i].padre=this.padre;
                this.subifs[i].normal=this.normal;
                var result_temp=this.subifs[i].execute(localif);
                if(result_temp!=null){
                    temp+=result_temp.cadena;
                    temp+="goto "+etisalida+";\n";
                    temp+=result_temp.u_etiqueta+":\n";
                }
            }
        }
        if(this.defecto!=null){
            if(condi){
                temp+=etif+":\n";
            }
            condi=false;
            var localif=new Entorno(entorno);
            this.defecto.ambitos=this.ambitos;
            this.defecto.padre=this.padre;
            this.defecto.normal=this.normal;
            var result_temp=this.defecto.execute(localif);
            if(result_temp!=null){
                temp+=result_temp.cadena;
                temp+="goto "+etisalida+";\n";
            }
        }
        if(condi){
            temp+=etif+":\n";
        }
        temp+=etisalida+":\n";
        temp+="//FINALIZA VALIDACION DEL IF\n";
        result.cadena=temp;
        return result;
    }
}
function cargarSimbolosif(nodo,entorno,ambitos){
    var posrel=0;
    for(var i=0;i<nodo.length;i++){        
        if(nodo[i] instanceof Declaracion){
            var id_instancia=nodo[i].id+"_"+ambitos;
            var sim=new Simbolo(nodo[i].id,"INTEGER",ambitos,Type.ID,posrel,1,0,nodo[i].getVisibilidad(),nodo[i].modificadores);
            sim.inicializado=false;
            entorno.agregar(id_instancia,sim);
            posrel++;
        }
    }
}