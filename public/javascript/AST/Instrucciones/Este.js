
class Este{
    constructor(nodos){
        this.nodos=nodos;
        this.ambitos="";
        this.tipo=null;
        this.iniValue=null;
    }
    getValue(entorno){
        var result=new Result();
        var separado=this.ambitos.split("/");
        if(this.nodos.length==1){
            if(this.nodos[0] instanceof Llamada_Metodo){
                alert("LLamada a un metodo, simple");
                alert("el ambito para un metodo es "+this.nodos[0].id+"_"+separado[0]);
            }else if(this.nodos[0] instanceof Aritmetica){
                if(this.iniValue!=null){
                    var sim=entorno.obtener(this.nodos[0].valor+"_"+separado[0]);
                    var temp="";
                    if(sim!=null){
                        var result_ini=this.iniValue.getValue(entorno);
                        var tipo_ini=this.iniValue.getTipe(entorno);
                        if(tipo_ini=="ID"){
                            var sim_temp=entorno.obtener(this.iniValue.valor+"_"+this.ambitos);
                            if(sim_temp!=null){
                                if(sim_temp.tipo==sim.tipo){
                                    var eti_temp1=generarEtiqueta();
                                    temp+=eti_temp1+"=p+"+sim_temp.posRel+";\n";
                                    var eti_temp2=generarEtiqueta();
                                    temp+=eti_temp2+"=stack["+eti_temp1+"];\n";
                                    var eti_temp3=generarEtiqueta();
                                    temp+=eti_temp3+"=heap["+eti_temp2+"];\n";
                                    var eti1=generarEtiqueta();
                                    var temp1=generarEtiqueta();
                                    var simulado=generarEtiqueta();
                                    temp+=eti1+"=p+1;\n";
                                    temp+=simulado+"="+eti1+"+"+sim.posRel+";\n";
                                    temp+=temp1+"=stack["+simulado+"];\n";//en esta posicion esta almacenado el puntero h que contiene al numero
                                    var temp2=generarEtiqueta();
                                    temp+="heap["+temp1+"]="+eti_temp3+";\n";
                                    result.u_etiqueta=temp1;
                                    result.cadena+=temp;
                                    sim.inicializado=true;
                                    entorno.actualizar(this.nodos[0].valor+"_"+separado[0],sim);
                                }else{
                                    alert("Error Semantico, no son del mismo tipo las variables");
                                }
                            }else{
                                alert("Error Semantico, La variable a asignar no existe en el entorno "+this.ambitos);
                            }
                        }else{
                            if(tipo_ini==sim.tipo){
                                temp+=result_ini.cadena;
                                var eti1=generarEtiqueta();
                                var temp1=generarEtiqueta();
                                var simulado=generarEtiqueta();
                                temp+=eti1+"=p+1;\n";
                                temp+=simulado+"="+eti1+"+"+sim.posRel+";\n";
                                temp+=temp1+"=stack["+simulado+"];\n";//en esta posicion esta almacenado el puntero h que contiene al numero
                                var temp2=generarEtiqueta();
                                temp+="heap["+temp1+"]="+result_ini.u_etiqueta+";\n";
                                result.u_etiqueta=temp1;
                                result.cadena+=temp;
                                sim.inicializado=true;
                                entorno.actualizar(this.nodos[0].valor+"_"+separado[0],sim);
                            }else{
                                alert("Error Semantico, No se puede realizar la asignacion, son de tipos diferentes");
                            }
                        }
                    }else{
                        alert("Error Semantico, La variable global "+this.nodos[0].valor+" no existe");
                    }
                }else{
                    var sim=entorno.obtener(this.nodos[0].valor+"_"+separado[0]);
                    var temp="";
                    if(sim!=null){
                        if(sim.inicializado==true){
                            var eti1=generarEtiqueta();
                            var temp1=generarEtiqueta();
                            var simulado=generarEtiqueta();
                            temp+=eti1+"=p+1;\n";
                            temp+=simulado+"="+eti1+"+"+sim.posRel+";\n";
                            temp+=temp1+"=stack["+simulado+"];\n";//en esta posicion esta almacenado el puntero h que contiene al numero
                            var temp2=generarEtiqueta();
                            temp+=temp2+"=heap["+temp1+"];\n";
                            result.u_etiqueta=temp2;
                            result.cadena+=temp;
                            this.tipo=sim.tipo;
                        }else{
                            alert("Error Semantico, La variable global "+this.nodos[0].valor+" no esta inicializada");
                        }
                    }else{  
                        console.log("No existe el id que se busca en la clase");
                    }
                }
            }
        }else{
            alert("Se van a acceder a objetos propios de la clase y se quieren acceder a sus atributos");
            for(var i=0;i<this.nodos.length;i++){
                if(this.nodos[i] instanceof Llamada_Metodo){    
                    alert("Es una llamada a un metodo, multiple");
                }else if(this.nodos[i] instanceof Aritmetica){
                    alert("Es una aritmetica de un id, multiple");
                }
            }
        }
        return result;
    }
    getTipe(entorno){
        return this.tipo;
    }

}