class AsignacionObjetos{
    constructor(id,id_acceso,iniValue){
        this.id=id;//nombre del objeto 
        this.id_acceso=id_acceso;//nombre del atributo al que se accede
        this.iniValue=iniValue;//es la expresion que se le tiene que asignar
        this.ambitos="";
        this.padre="";
        this.normal="";
        this.codigo=codigo;
        codigo++;
        this.primitivetipe;
    }
    getValue(entorno){
        var temp="";
        var result=new Result();
        var temp_ambi="";
        if(this.padre=="main"){
            temp_ambi=this.ambitos;
        }else{
            temp_ambi=this.ambitos;
        }
        if(this.iniValue!=null){
            var sim=entorno.obtener(this.id+"_"+temp_ambi);
            if(sim!=null){
                //vamos a buscar el atributo
                var sim_atri=entorno.obtener(this.id_acceso+"_"+sim.tipo);
                if(sim_atri!=null){
                    var sim_ambi;
                    if(this.padre=="main"){
                        sim_ambi=entorno.obtener("main");
                    }else{
                        sim_ambi=entorno.obtener(temp_ambi.replace("/","_"));
                    }
                    if(sim_ambi!=null){
                        this.iniValue.padre=this.padre;
                        this.iniValue.normal=this.normal;
                        this.iniValue.ambitos=this.ambitos;
                        var temp_result=this.iniValue.getValue(entorno);
                        var temp_tipo=this.iniValue.getTipe(entorno);
                        if(temp_result!=null){
                            if(temp_tipo==sim_atri.tipo){
                                temp+=temp_result.cadena;
                                var eti1=generarEtiqueta();
                                temp+=eti1+"=p+"+sim_ambi.tamanio+";\n";
                                 temp+=eti1+"="+eti1+"+"+sim_atri.posRel+";\n";
                                temp+=eti1+"="+eti1+"+1;\n";
                                var eti2=generarEtiqueta();
                                temp+=eti2+"=h;\n";
                                temp+="heap[h]="+temp_result.u_etiqueta+";\n";
                                temp+="h=h+1;\n";
                                temp+="stack["+eti1+"]="+eti2+";\n";
                            }else{
                                alert("Error Semantico, No son de tipos iguales la asignacion a atributo objeto");
                            }
                        }else{
                            alert("Error Semantico, No se completo la expresion a asignar en asignacion objetos");
                        }
                    }else{
                        alert("Error Semantico, No existe el ambiente local en la tabla de simbolos asignacionobjetos");
                    }

                }else{
                    alert("Error Semantico, El atributo "+this.id_acceso+" no existe en el objeto o no esta definido");
                }
            }else{
                alert("Error Semantico, El id del objeto no existe");
            }
        }else{
            //se tiene que retornar el valor del id
            var sim=entorno.obtener(this.id+"_"+temp_ambi);
            if(sim!=null){
                //vamos a buscar el atributo
                var sim_atri=entorno.obtener(this.id_acceso+"_"+sim.tipo);
                if(sim_atri!=null){
                    var sim_ambi;
                    if(this.padre=="main"){
                        sim_ambi=entorno.obtener("main");
                    }else{
                        sim_ambi=entorno.obtener(temp_ambi.replace("/","_"));
                    }
                    if(sim_ambi!=null){
                        var eti1=generarEtiqueta();
                        temp+=eti1+"=p+"+sim_ambi.tamanio+";\n";
                        temp+=eti1+"="+eti1+"+"+sim_atri.posRel+";\n";
                        temp+=eti1+"="+eti1+"+1;\n";
                        var eti2=generarEtiqueta();
                        temp+=eti2+"=stack["+eti1+"];\n";
                        var eti3=generarEtiqueta();
                        temp+=eti3+"=heap["+eti2+"];\n";
                        result.u_etiqueta=eti3;
                        this.primitivetipe=sim_atri.tipo;
                    }else{
                        alert("Error Semantico, No existe el ambiente local en la asignacion de objetos");
                    }
                }else{
                    alert("Error Semantico, El atributo "+this.id_acceso+" no existe en el objeto o no esta definido");
                }
            }else{
                alert("Error Semantico, El id del objeto no existe");
            }
        }
        result.cadena+=temp;
        return result;
    }
    getTipe(entorno){
        return this.primitivetipe;
    }

}