class Mientras{
    constructor(condicion,nodos,tipo){
        this.condicion=condicion;
        this.nodos=nodos;
        this.tipo=tipo;//true es while,false es dowhile
        this.ambitos="";
    }
    execute(entorno){
        var result=new Result();
        var local=new Entorno(entorno);
        var temp="";
        var etiinicio=generarSalto();
        var etisalida=generarSalto();
        this.condicion.ambitos=this.ambitos;
        var result_condi=this.condicion.getValue(entorno);
        var tipo_condi=this.condicion.getTipe(entorno);
        if(this.tipo){
            if(result_condi!=null){
                if(tipo_condi=="BOOLEAN"){
                    temp+=etiinicio+":\n";
                    temp+=result_condi.cadena;
                    temp+="if("+result_condi.u_etiqueta+"==0) goto "+etisalida+";\n";
                    pool_salida.push(etisalida);    
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
                                temp+=result_temp.cadena;
                                temp+="//empieza la asignacion variable local\n";
                                var temph=generarEtiqueta();
                                temp+=temph+"=h;\n";
                                temp+="heap[h]="+result_temp.u_etiqueta+";\n";
                                temp+="h=h+1;\n";
                                var simulado=generarEtiqueta();
                                alert(this.nodos[i].id+"_"+ambi);
                                var sim=local.obtener(this.nodos[i].id+"_"+ambi);
                                temp+=simulado+"=p+"+sim.posRel+";\n";
                                temp+="stack["+simulado+"]="+temph+";\n";
                                temp+="//fin asignacion variable local\n";
                            }else{
                                alert("es nulo");
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
                                temp+=result_temp.cadena;
                                console.log(result_temp.cadena);
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
                                temp+="goto "+temp_salida+";\n";
                                temp+="//FINALIZA DETENER-------------------------\n";
                            }else{
                                alert("Error Semantico, la sentencia breake no corresponde a esta seccion de codigo");
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
                        temp+=result_temp.cadena;
                        temp+="//empieza la asignacion variable local\n";
                        var temph=generarEtiqueta();
                        temp+=temph+"=h;\n";
                        temp+="heap[h]="+result_temp.u_etiqueta+";\n";
                        temp+="h=h+1;\n";
                        var simulado=generarEtiqueta();
                        alert(this.nodos[i].id+"_"+ambi);
                        var sim=local.obtener(this.nodos[i].id+"_"+ambi);
                        temp+=simulado+"=p+"+sim.posRel+";\n";
                        temp+="stack["+simulado+"]="+temph+";\n";
                        temp+="//fin asignacion variable local\n";
                    }else{
                        alert("es nulo");
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
                        temp+=result_temp.cadena;
                        console.log(result_temp.cadena);
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
                        temp+="goto "+temp_salida+";\n";
                        temp+="//FINALIZA DETENER-------------------------\n";
                    }else{
                        alert("Error Semantico, la sentencia breake no corresponde a esta seccion de codigo");
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
            temp+=result_condi.cadena;
            temp+="if("+result_condi.u_etiqueta+"==0) goto "+etisalida+";\n";
            temp+="goto "+etiinicio+";\n";
        }
        temp+=etisalida+":\n";
        result.cadena+=temp;
        return result;
    }
}