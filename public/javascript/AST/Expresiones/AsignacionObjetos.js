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
                                if(sim_atri.visibilidad=="PRIVATE"||sim_atri.visibilidad=="private"){
                                    alert("Error Semantico, la variable tiene visibilidad private no se puede acceder a ella");
                                    var errores_1=new Errores("Semantico","la variable tiene visibilidad private no se puede acceder a ella asignacionobjetos",0,0);
                            lista_errores.push(errores_1);
                                }else{
                                    //tengo que verificar si la variable ya esta inicializada
                                    temp+=temp_result.cadena;
                                    var eti1=generarEtiqueta();
                                    temp+=eti1+"=p+"+sim.posRel+";\n";
                                    var eti3=generarEtiqueta();
                                    temp+=eti3+"=stack["+eti1+"];\n";
                                    var eti4=generarEtiqueta();
                                    temp+=eti4+"=heap["+eti3+"];\n";
                                    if(verificarStatic(sim_atri.modificadores)){
                                        temp+=eti4+"="+sim_atri.posRel+";\n";
                                    }else{
                                        temp+=eti4+"="+eti4+"+"+sim_atri.posRel+";\n";
                                    }
                                    temp+="heap["+eti4+"]="+temp_result.u_etiqueta+";\n";
                                }
                            }else{
                                alert("Error Semantico, No son de tipos iguales la asignacion a atributo objeto");
                                var errores_1=new Errores("Semantico","no son de tipos iguales la asignacion a atributo objeto asigncionobjeto",0,0);
                            lista_errores.push(errores_1);
                            }
                        }else{
                            alert("Error Semantico, No se completo la expresion a asignar en asignacion objetos");
                            var errores_1=new Errores("Semantico","No se completo la expresion a asignar en asignacion objetos",0,0);
                            lista_errores.push(errores_1);
                        }
                    }else{
                        alert("Error Semantico, No existe el ambiente local en la tabla de simbolos asignacionobjetos");
                        var errores_1=new Errores("Semantico","no existe el ambiente local en la tabla de simbolos asignacion objetos",0,0);
                            lista_errores.push(errores_1);
                    }

                }else{
                    alert("Error Semantico, El atributo "+this.id_acceso+" no existe en el objeto o no esta definido");
                    var errores_1=new Errores("Semantico","el atributo "+this.id_acceso+" no existe en el objeto o no esta definido",0,0);
                            lista_errores.push(errores_1);
                }
            }else{
                var sim2=entorno.obtener(this.id_acceso+"_"+this.id);
                if(sim2!=null){
                    this.iniValue.padre=this.padre;
                    this.iniValue.normal=this.normal;
                    this.iniValue.ambitos=this.ambitos;
                    var temp_result=this.iniValue.getValue(entorno);
                    var temp_tipo=this.iniValue.getTipe(entorno);
                    if(temp_result!=null){
                        if(temp_tipo==sim2.tipo){
                            if(sim2.visibilidad=="PRIVATE"||sim2.visibilidad=="private"){
                                alert("Error Semantico, la variable tiene visibilidad private no se puede acceder a ella");
                                var errores_1=new Errores("Semantico","la variable tiene visibilidad private no se puede acceder a ella",0,0);
                            lista_errores.push(errores_1);
                            }else{
                                //tengo que verificar si la variable ya esta inicializada
                                temp+=temp_result.cadena;
                                if(verificarStatic(sim2.modificadores)){
                                    var eti4=generarEtiqueta();
                                    temp+=eti4+"="+sim2.posRel+";\n";
                                    temp+="heap["+eti4+"]="+temp_result.u_etiqueta+";\n";
                                }else{
                                    alert("Error Semantico, el atributo no es static para poder acceder a el directamente");
                                    var errores_1=new Errores("Semantico","El atributo no es static para pdoer acceder a el directamente",0,0);
                            lista_errores.push(errores_1);
                                }
                            }
                        }else{
                            alert("Error Semantico, No son de tipos iguales la asignacion a atributo objeto");
                            var errores_1=new Errores("Semantico","No son de tipos iguales la asignacion a atributo objeto",0,0);
                            lista_errores.push(errores_1);
                        }
                    }else{
                        alert("Error Semantico, No se completo la expresion a asignar en asignacion objetos");
                        var errores_1=new Errores("Semantico","no se completo la expresion a asignar en la asignacion objetos",0,0);
                            lista_errores.push(errores_1);
                    }
                }else{
                    alert("Error Semantico, El id del objeto no existe");
                    var errores_1=new Errores("Semantico","el id del objeto no existe",0,0);
                            lista_errores.push(errores_1);
                }
            }
        }else{
            //se tiene que retornar el valor del id
            alert(this.id+"_"+temp_ambi);
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
                        if(sim_atri.visibilidad=="PRIVATE"||sim_atri.visibilidad=="private"){
                            alert("Error Semantico, la variable tiene visibilidad private no se puede acceder a ella");
                            var errores_1=new Errores("Semantico","la variable tiene la visibilidad private no se puede acceder a ella",0,0);
                            lista_errores.push(errores_1);
                        }else{
                            var eti1=generarEtiqueta();
                            temp+=eti1+"=p+"+sim.posRel+";\n";
                            var eti2=generarEtiqueta();
                            temp+=eti2+"=stack["+eti1+"];\n";
                            var eti3=generarEtiqueta();
                            temp+=eti3+"=heap["+eti2+"];\n";
                            var eti4=generarEtiqueta();
                            if(verificarStatic(sim_atri.modificadores)){
                                temp+=eti3+"="+sim_atri.posRel+";\n";
                            }else{
                                temp+=eti3+"="+eti3+"+"+sim_atri.posRel+";\n";
                            }
                            temp+=eti4+"=heap["+eti3+"];\n";
                            result.u_etiqueta=eti4;
                            this.primitivetipe=sim_atri.tipo;
                        }
                    }else{
                        alert("Error Semantico, No existe el ambiente local en la asignacion de objetos");
                        var errores_1=new Errores("Semantico","no existe el ambiente local en la asignacion de objetos",0,0);
                            lista_errores.push(errores_1);
                    }
                }else{
                    alert("Error Semantico, El atributo "+this.id_acceso+" no existe en el objeto o no esta definido");
                    var errores_1=new Errores("Semantico","el atributo"+this.id_acceso+" no existe en el objeto o no esta definido",0,0);
                            lista_errores.push(errores_1);
                }
            }else{
                var sim2=entorno.obtener(this.id_acceso+"_"+this.id);
                if(sim2!=null){
                    if(sim2.visibilidad=="PRIVATE"||sim2.visibilidad=="private"){
                        alert("Error Semantico, la variable tiene visibilidad private no se puede acceder a ella");
                        var errores_1=new Errores("Semantico","la variable tiene visibilidad private no se puede acceder a ella",0,0);
                            lista_errores.push(errores_1);
                    }else{
                        //tengo que verificar si la variable ya esta inicializada
                        if(verificarStatic(sim2.modificadores)){
                            var eti4=generarEtiqueta();
                            temp+=eti4+"="+sim2.posRel+";\n";
                            var eti5=generarEtiqueta();
                            temp+=eti5+"=heap["+eti4+"];\n";
                            result.u_etiqueta=eti5;
                            this.primitivetipe=sim2.tipo;
                        }else{
                            alert("Error Semantico, el atributo no es static para poder acceder a el directamente");
                            var errores_1=new Errores("Semantico","el atributo no es static para poder acceder a el directamente",0,0);
                            lista_errores.push(errores_1);
                        }
                    }
                }else{
                    alert("Error Semantico, El id del objeto no existe");
                    var errores_1=new Errores("Semantico","el id del objeto no existe",0,0);
                            lista_errores.push(errores_1);
                }
            }
        }
        result.cadena+=temp;
        return result;
    }
    getTipe(entorno){
        return this.primitivetipe;
    }

}