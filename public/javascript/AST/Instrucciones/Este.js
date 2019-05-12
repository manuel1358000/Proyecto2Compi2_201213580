

class Este{
    constructor(nodos){
        this.nodos=nodos;
        this.ambitos="";
        this.tipo=null;
        this.iniValue=null;
        this.codigo=codigo;
        codigo++;
        this.padre="";
        this.normal="";
    }
    getValue(entorno){
        var result=new Result();
        if(this.nodos.length==1){
            if(this.nodos[0] instanceof Llamada_Metodo){
            }else if(this.nodos[0] instanceof Aritmetica){
                if(this.iniValue!=null){
                    var sim=entorno.obtener(this.nodos[0].valor+"_"+this.normal);
                    var temp="";
                    if(sim!=null){
                        this.iniValue.ambitos=this.ambitos;
                        this.iniValue.padre=this.padre;
                        this.iniValue.normal=this.normal;
                        var result_ini=this.iniValue.getValue(entorno);
                        var tipo_ini=this.iniValue.getTipe(entorno);
                        if(tipo_ini=="ID"){
                            if(verificarFinal(sim.modificadores)&&sim.inicializado==true){
                                alert("Error Semantico, La variable final "+sim.nombre+" ya esta inicializada");
                            }else{
                                //aqui tambien se tiene que hacer la validacion
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
                                        alert("Este 0 Error Semantico, no son del mismo tipo las variables");
                                    }
                                }else{
                                    alert("Este 1Error Semantico, La variable a asignar no existe en el entorno "+this.ambitos);
                                }
                            }
                        }else{
                            //asignacion simple
                            if(tipo_ini==sim.tipo){
                                if(verificarFinal(sim.modificadores)&&sim.inicializado==true){
                                    alert("Error Semantico, La variable final "+sim.nombre+" ya esta inicializada");
                                }else{
                                    temp+=result_ini.cadena;
                                    var eti1=generarEtiqueta();
                                    var temp1=generarEtiqueta();
                                    var simulado=generarEtiqueta();
                                    temp+=eti1+"=p+1;\n";
                                    temp+=temp1+"=stack["+eti1+"];\n";//en esta posicion esta almacenado el puntero h que contiene al numero
                                    if(verificarStatic(sim.modificadores)){
                                        temp+=simulado+"="+sim.posRel+";\n";
                                    }else{
                                        temp+=simulado+"="+temp1+"+"+sim.posRel+";\n";
                                    }
                                    var temp2=generarEtiqueta();
                                    temp+="heap["+simulado+"]="+result_ini.u_etiqueta+";\n";
                                    result.u_etiqueta=simulado;
                                    result.cadena+=temp;
                                    sim.inicializado=true;
                                    entorno.actualizar(this.nodos[0].valor+"_"+this.normal,sim);
                                }
                                
                            }else{
                                alert("Este 3 Error Semantico, No se puede realizar la asignacion, son de tipos diferentes");
                            }
                        }
                    }else{
                        alert("Este 4 Error Semantico, La variable global "+this.nodos[0].valor+" no existe");
                    }
                }else{
                    var sim=entorno.obtener(this.nodos[0].valor+"_"+this.normal);
                    var temp="";
                    if(sim!=null){
                        if(sim.inicializado==true){
                            var eti1=generarEtiqueta();
                            var temp1=generarEtiqueta();
                            var simulado=generarEtiqueta();
                            temp+=eti1+"=p+1;\n";
                            temp+=temp1+"=stack["+eti1+"];\n";//en esta posicion esta almacenado el puntero h que contiene al numero
                            if(verificarStatic(sim.modificadores)){
                                temp+=simulado+"="+sim.posRel+";\n";
                            }else{
                                temp+=simulado+"="+temp1+"+"+sim.posRel+";\n";
                            }
                            var temp2=generarEtiqueta();
                            temp+=temp2+"=heap["+simulado+"];\n";
                            result.u_etiqueta=temp2;
                            result.cadena+=temp;
                            this.tipo=sim.tipo;
                        }else{
                            alert("Este 5 Error Semantico, La variable global "+this.nodos[0].valor+" no esta inicializada");
                        }
                    }else{  
                        console.log("Este 6 No existe el id que se busca en la clase");
                    }
                }
            }
        }else{
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
function verificarFinal(modificadores){
    var bandera=false;
    for(var i=0;i<modificadores.length;i++){
        if(modificadores[i]=="FINAL"||modificadores[i]=="final"){
            bandera=true;
            break;
        }
    }
    return bandera;   
}