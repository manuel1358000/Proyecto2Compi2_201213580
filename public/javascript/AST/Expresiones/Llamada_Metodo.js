class Llamada_Metodo{
    constructor(id,parametros){
        this.id=id;
        this.parametros=parametros;
        this.ambitos="";
        this.padre="";
        this.normal="";
        this.primitivetipe;
    }
    getValue(entorno){
        var result=null;
        var nombre_completo=this.normal+"_"+this.id;
        var temp="\n\n\n\n";
        var param_temp=this.parametros;
        var indices=[];
        var indice_result=[];
        var indice_tipo=[];
        var temp_ambi="";
        if(this.padre=="main"){
            temp_ambi=this.ambitos+"/"+this.padre;
        }else{
            temp_ambi=this.ambitos;
        }
        for(var i=0;i<param_temp.length;i++){
            if(this.parametros[i].getTipe(entorno)=="ID"){
                indices.unshift(i);
            }
            if(this.padre=="main"){
                param_temp[i].ambitos=temp_ambi;
            }else{
                param_temp[i].ambitos=temp_ambi;
            }
            param_temp[i].padre=this.padre;
            param_temp[i].normal=this.normal;
            var result1=param_temp[i].getValue(entorno);
            var tipo1=param_temp[i].getTipe(entorno);
            indice_result.push(result1);
            indice_tipo.push(tipo1);
            nombre_completo+="_"+tipo1;
        }
        //vamos a verificar si existe el metodo en el entorno
        var sim=entorno.obtener(nombre_completo);
        if(sim!=null){
            //if(sim.ambito==this.ambitos){
                result=new Result();
                var sim_temp=entorno.obtener(this.padre);
                if(sim_temp!=null){
                    var eti1=generarEtiqueta();
                    temp+=eti1+"=p+"+sim_temp.tamanio+";//simulacion de cambio de ambito para pasar los parametros\n";
                    var pos=2;
                    for(var i=0;i<this.parametros.length;i++){
                        for(var t=0;t<indices.length;t++){
                            if(indices[t]==i){
                                this.parametros[i].tipoprimitivo="ID";
                            }
                        }
                        var sim_actual=entorno.obtener(this.parametros[i].valor+"_"+temp_ambi);
                        var sim_actual2=entorno.obtener(sim.referencia[i]+"_"+sim.ambitos_parametros);
                        if(sim_actual!=null&&sim_actual2!=null){
                            sim_actual2.lista_dimensiones=sim_actual.lista_dimensiones;
                            entorno.actualizar(sim.referencia[i]+"_"+sim.ambitos_parametros,sim_actual2);
                            var result_temp=indice_result[i];
                            var tipo_parametro=indice_tipo[i];
                            temp+="         //INICIO PARAMETRO "+(i+1)+"\n";
                            var temp_h=generarEtiqueta();
                            temp+=temp_h+"=h;\n";
                            var eti2=generarEtiqueta();
                            temp+=result_temp.cadena;
                            temp+=eti2+"="+eti1+"+"+pos+";//posicion del parametro\n";
                            temp+="stack["+eti2+"]="+result_temp.u_etiqueta+";\n";
                            pos++;
                            temp+="//ESTO TENDRIA QUE APARECER EN EL FACTORIAL\n";
                            temp+="         //FIN PARAMETRO "+(i+1)+"\n";
                        }else{
                            var result_temp=indice_result[i];
                            var tipo_parametro=indice_tipo[i];
                            if(tipo_parametro=="INTEGER"||tipo_parametro=="DOUBLE"||tipo_parametro=="BOOLEAN"){
                                temp+="         //INICIO PARAMETRO "+(i+1)+"\n";
                                var temp_h=generarEtiqueta();
                                temp+=temp_h+"=h;\n";
                                var eti2=generarEtiqueta();
                                temp+=result_temp.cadena;
                                temp+=eti2+"="+eti1+"+"+pos+";//posicion del parametro\n";
                                temp+="heap["+temp_h+"]="+result_temp.u_etiqueta+";\n";
                                temp+="h=h+1;\n";
                                temp+="stack["+eti2+"]="+temp_h+";\n";
                                pos++;
                                temp+="//ESTO TENDRIA QUE APARECER EN EL FACTORIAL\n";
                                temp+="         //FIN PARAMETRO "+(i+1)+"\n";
                            }else if(tipo_parametro=="STRING"||tipo_parametro=="CHAR"){
                                temp+="         //INICIO PARAMETRO "+(i+1)+"\n";
                                var temp_h=generarEtiqueta();
                                temp+=temp_h+"=h;\n";
                                temp+="h=h+1;\n";
                                var eti2=generarEtiqueta();
                                temp+=result_temp.cadena;
                                temp+=eti2+"="+eti1+"+"+pos+";//posicion del parametro\n";
                                temp+="heap["+temp_h+"]="+result_temp.u_etiqueta+";\n";
                                temp+="h=h+1;\n";
                                temp+="stack["+eti2+"]="+temp_h+";\n";
                                pos++;
                                temp+="         //FIN PARAMETRO "+(i+1)+"\n";
                            }else{
                                alert("Es un id el que se esta mandando como parametro "+tipo_parametro);
                            }
                        }
                        
                    }
                    temp+="p=p+"+sim_temp.tamanio+";\n";
                    temp+="call "+nombre_completo+";\n";
                    this.primitivetipe=sim.tipo;
                    if(this.primitivetipe!="VOID"){
                        var eti10=generarEtiqueta();
                        temp+=eti10+"=p+0;//posicion del valor de retorno\n";
                        var eti11=generarEtiqueta();
                        temp+=eti11+"=stack["+eti10+"];\n";
                        var eti12=generarEtiqueta();
                        temp+=eti12+"=heap["+eti11+"];";
                        temp+="//PODER PERRUNO\n";
                        result.u_etiqueta=eti12;
                    }else{
                        result.u_etiqueta=null;
                    }
                    temp+="p=p-"+sim_temp.tamanio+";\n";
                }else{
                    alert("Ocurrio un error en el indice padre llamada a metodo");
                }
           /* }else{
                alert("Error Semantico, No existe el metodo en la clase");
            }*/
        }else{
            alert("Error Semantico, No existe el metodo que se esta llamando "+nombre_completo);
        }
        temp+="\n\n\n";
        temp+="\n";
        result.cadena+=temp;
        return result;
    }
    getTipe(entorno){
        return this.primitivetipe;
    }
}