class Llamada_Metodo{
    constructor(id,parametros){
        this.id=id;
        this.parametros=parametros;
        this.ambitos="";
        this.padre="";
        this.normal="";
        this.primitivetipe;
        this.codigo=codigo;
        codigo++;
    }
    getValue(entorno){
        var result=null;
        if(this.id=="super"||this.id=="this"){
            this.id=this.normal;
        }
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
        if(this.id=="str"){
            result=new Result();
            if(this.parametros.length==1){
                this.parametros[0].ambitos=temp_ambi;
                this.parametros[0].normal=this.normal;
                this.parametros[0].padre=this.padre;
                var result_temp=this.parametros[0].getValue(entorno);
                var result_tipo=this.parametros[0].getTipe(entorno);
                var sim_correr=entorno.obtener(this.padre);
                if(sim_correr!=null){
                    if(result_tipo=="CHAR"){
                        var respuesta=generarString(result_temp.u_etiqueta,true,"CHAR");
                        temp+=result_temp.cadena;
                        temp+="p=p+"+sim_correr.tamanio+";\n";
                        temp+=respuesta.cadena;
                        temp+="p=p-"+sim_correr.tamanio+";\n";
                        result.u_etiqueta=respuesta.u_etiqueta;
                        this.primitivetipe="STRING";
                    }else if(result_tipo=="INTEGER"){
                        var respuesta=generarString(result_temp.u_etiqueta,true,"INTEGER");
                        temp+=result_temp.cadena;
                        temp+="p=p+"+sim_correr.tamanio+";\n";
                        temp+=respuesta.cadena;
                        temp+="p=p-"+sim_correr.tamanio+";\n";
                        result.u_etiqueta=respuesta.u_etiqueta;
                        this.primitivetipe="STRING";
                    }else if(result_tipo=="DOUBLE"){
                        var respuesta=generarString(result_temp.u_etiqueta,true,"DOUBLE");
                        temp+=result_temp.cadena;
                        temp+="p=p+"+sim_correr.tamanio+";\n";
                        temp+=respuesta.cadena;
                        temp+="p=p-"+sim_correr.tamanio+";\n";
                        result.u_etiqueta=respuesta.u_etiqueta;
                        this.primitivetipe="STRING";
                    }else if(result_tipo=="STRING"){
                        temp+="p=p+"+sim_correr.tamanio+";\n";
                        temp+=result_temp.cadena;
                        temp+="p=p-"+sim_correr.tamanio+";\n";
                        result.u_etiqueta=result_temp.u_etiqueta;
                        this.primitivetipe="STRING";
                    }else{
                        alert("Error Semantico, el casteo explicito solo puede operar INTEGER, DOUBLE,CHAR Y STRING, EL TIPO QUE SE QUIERE CASTEAR ES "+result_tipo);
                        var errores_1=new Errores("Semantico","el casteo explicito solo puede operar INTEGER DOUBLE CHAR Y STRING EL TIPO QUE SE UQIERE CASTEAR ES "+result_tipo,0,0);
                            lista_errores.push(errores_1);
                    }
                }else{
                    alert("Error Semantico, No existe el entorno en la tabla de simbolos casteos");
                    var errores_1=new Errores("Semantico","no existe el entorno en la tabla de simbolos",0,0);
                            lista_errores.push(errores_1);
                }
            }else{
                alert("Error Semantico, el casteo explicito STR solo puede contener un parametro");
                var errores_1=new Errores("Semantico","el casteo explicito str solo puede contener un parametro",0,0);
                            lista_errores.push(errores_1);

            }
        }else if(this.id=="toDouble"){
            result=new Result();
            if(this.parametros.length==1){
                this.parametros[0].ambitos=temp_ambi;
                this.parametros[0].normal=this.normal;
                this.parametros[0].padre=this.padre;
                var result_temp=this.parametros[0].getValue(entorno);
                var result_tipo=this.parametros[0].getTipe(entorno);
                var sim_correr=entorno.obtener(this.padre);
                if(sim_correr!=null){
                    if(result_tipo=="DOUBLE"){
                        temp+="p=p+"+sim_correr.tamanio+";\n";
                        temp+=result_temp.cadena;
                        temp+="p=p-"+sim_correr.tamanio+";\n";
                        result.u_etiqueta=result_temp.u_etiqueta;
                        this.primitivetipe="DOUBLE";
                    }else if(result_tipo=="CHAR"){
                        temp+="p=p+"+sim_correr.tamanio+";\n";
                        temp+=result_temp.cadena;
                        temp+="p=p-"+sim_correr.tamanio+";\n";
                        result.u_etiqueta=result_temp.u_etiqueta;
                        alert("Entro aqui");
                        this.primitivetipe="DOUBLE";
                    }else if(result_tipo=="INTEGER"){
                        temp+="p=p+"+sim_correr.tamanio+";\n";
                        temp+=result_temp.cadena;
                        temp+="p=p-"+sim_correr.tamanio+";\n";
                        result.u_etiqueta=result_temp.u_etiqueta;
                        this.primitivetipe="DOUBLE";
                    }else if(result_tipo=="STRING"){
                        alert("Error Semantico, no se puede realizar la conversison de string a double");
                        var errores_1=new Errores("Semantico","no se puede realizar la conversion de string a double",0,0);
                            lista_errores.push(errores_1);
                        this.primitivetipe="STRING";
                    }else{
                        alert("Error Semantico, el casteo explicito solo puede operar INTEGER, DOUBLE,CHAR Y STRING, EL TIPO QUE SE QUIERE CASTEAR ES "+result_tipo);
                        var errores_1=new Errores("Semantico","el casteo explicto solo puede operar INTEGER DOUBLE CHAR Y STRING EL TIPO QUE SE QUIERE CASTEAR ES "+result_tipo,0,0);
                            lista_errores.push(errores_1);
                    }
                }else{
                    alert("Error Semantico, No existe el entorno en la tabla de simbolos casteos");
                    var errores_1=new Errores("Semantico","no existe el entorno en la tabla de simbolos casteos",0,0);
                            lista_errores.push(errores_1);
                }
            }else{
                alert("Error Semantico, el casteo explicito STR solo puede contener un parametro");
                var errores_1=new Errores("Semantico","el casteo explicito str solo puede contener un parametro",0,0);
                            lista_errores.push(errores_1);

            }
        }else if(this.id=="toInt"){
            result=new Result();
            if(this.parametros.length==1){
                this.parametros[0].ambitos=temp_ambi;
                this.parametros[0].normal=this.normal;
                this.parametros[0].padre=this.padre;
                var result_temp=this.parametros[0].getValue(entorno);
                var result_tipo=this.parametros[0].getTipe(entorno);
                var sim_correr=entorno.obtener(this.padre);
                if(sim_correr!=null){
                    if(result_tipo=="DOUBLE"){
                        temp+="p=p+"+sim_correr.tamanio+";\n";
                        temp+=result_temp.cadena;
                        var eti1=generarEtiqueta();
                        temp+=eti1+"=p+5;\n";
                        temp+=eti1+"="+eti1+"+1;\n";
                        temp+="stack["+eti1+"]="+result_temp.u_etiqueta+";\n";
                        temp+="p=p+5;\n";
                        temp+="call obtenerInt;\n";
                        var eti2=generarEtiqueta();
                        temp+=eti2+"=p+0;\n";
                        var eti3=generarEtiqueta();
                        temp+=eti3+"=stack["+eti2+"];\n";
                        temp+="p=p-5;\n";
                        temp+="p=p-"+sim_correr.tamanio+";\n";
                        result.u_etiqueta=eti3;
                        this.primitivetipe="INTEGER";
                    }else if(result_tipo=="CHAR"){
                        temp+="p=p+"+sim_correr.tamanio+";\n";
                        temp+=result_temp.cadena;
                        temp+="p=p-"+sim_correr.tamanio+";\n";
                        result.u_etiqueta=result_temp.u_etiqueta;
                        alert("Entro aqui");
                        this.primitivetipe="INTEGER";
                    }else if(result_tipo=="INTEGER"){
                        temp+="p=p+"+sim_correr.tamanio+";\n";
                        temp+=result_temp.cadena;
                        temp+="p=p-"+sim_correr.tamanio+";\n";
                        result.u_etiqueta=result_temp.u_etiqueta;
                        this.primitivetipe="INTEGER";
                    }else if(result_tipo=="STRING"){
                        alert("Error Semantico, no se puede realizar la conversison de string a integer");
                        var errores_1=new Errores("Semantico","no se puede realizar la conversion de string a integer",0,0);
                            lista_errores.push(errores_1);
                        this.primitivetipe="STRING";
                    }else{
                        alert("Error Semantico, el casteo explicito solo puede operar INTEGER, DOUBLE,CHAR Y STRING, EL TIPO QUE SE QUIERE CASTEAR ES "+result_tipo);
                        var errores_1=new Errores("Semantico","el casteo explicito solo puede operar INTEGER, DOUBLE CHAR Y STRING, EL TIPO QUE SE QUIERE CASTEAR ES "+result_tipo,0,0);
                            lista_errores.push(errores_1);
                    }
                }else{
                    alert("Error Semantico, No existe el entorno en la tabla de simbolos casteos");
                    var errores_1=new Errores("Semantico","no exist el entorno en la tabla de simbolos casteos",0,0);
                            lista_errores.push(errores_1);
                }
            }else{
                alert("Error Semantico, el casteo explicito toint solo puede contener un parametro");
                var errores_1=new Errores("Semantico","el casteo explicito toint solo puede contener un parametro",0,0);
                            lista_errores.push(errores_1);

            }
        }else if(this.id=="toChar"){
            result=new Result();
            if(this.parametros.length==1){
                this.parametros[0].ambitos=temp_ambi;
                this.parametros[0].normal=this.normal;
                this.parametros[0].padre=this.padre;
                var result_temp=this.parametros[0].getValue(entorno);
                var result_tipo=this.parametros[0].getTipe(entorno);
                var sim_correr=entorno.obtener(this.padre);
                if(sim_correr!=null){
                    if(result_tipo=="DOUBLE"){
                        temp+="p=p+"+sim_correr.tamanio+";\n";
                        temp+=result_temp.cadena;
                        var eti1=generarEtiqueta();
                        temp+=eti1+"=p+5;\n";
                        temp+=eti1+"="+eti1+"+1;\n";
                        temp+="stack["+eti1+"]="+result_temp.u_etiqueta+";\n";
                        temp+="p=p+5;\n";
                        temp+="call obtenerInt;\n";
                        var eti2=generarEtiqueta();
                        temp+=eti2+"=p+0;\n";
                        var eti3=generarEtiqueta();
                        temp+=eti3+"=stack["+eti2+"];\n";
                        temp+="p=p-5;\n";
                        temp+="p=p-"+sim_correr.tamanio+";\n";
                        result.u_etiqueta=eti3;
                        this.primitivetipe="CHAR";
                    }else if(result_tipo=="CHAR"){
                        temp+="p=p+"+sim_correr.tamanio+";\n";
                        temp+=result_temp.cadena;
                        temp+="p=p-"+sim_correr.tamanio+";\n";
                        result.u_etiqueta=result_temp.u_etiqueta;
                        this.primitivetipe="CHAR";
                    }else if(result_tipo=="INTEGER"){
                        temp+="p=p+"+sim_correr.tamanio+";\n";
                        temp+=result_temp.cadena;
                        temp+="p=p-"+sim_correr.tamanio+";\n";
                        result.u_etiqueta=result_temp.u_etiqueta;
                        this.primitivetipe="CHAR";
                    }else if(result_tipo=="STRING"){
                        temp+="p=p+"+sim_correr.tamanio+";\n";
                        temp+=result_temp.cadena;
                        var eti1=generarEtiqueta();
                        temp+=eti1+"=heap["+result_temp.u_etiqueta+"];\n";
                        temp+="p=p-"+sim_correr.tamanio+";\n";
                        result.u_etiqueta=eti1;
                        this.primitivetipe="CHAR";
                    }else{
                        alert("Error Semantico, el casteo explicito solo puede operar INTEGER, DOUBLE,CHAR Y STRING, EL TIPO QUE SE QUIERE CASTEAR ES "+result_tipo);
                        var errores_1=new Errores("Semantico","el casteo explicito solo puede operar INTEGER DOUBLE CHAR Y STRING, EL TIPO QUE SE QUIERE CASTEAS ES "+result_tipo,0,0);
                            lista_errores.push(errores_1);
                    }
                }else{
                    alert("Error Semantico, No existe el entorno en la tabla de simbolos casteos");
                    var errores_1=new Errores("Semantico","no existe el entorno en la tabla de simbolos casteos",0,0);
                            lista_errores.push(errores_1);
                }
            }else{
                alert("Error Semantico, el casteo explicito tochar solo puede contener un parametro");
                var errores_1=new Errores("Semantico","el casteo explicto tochar",0,0);
                            lista_errores.push(errores_1);

            }
        }else{
            for(var i=0;i<param_temp.length;i++){
                if(this.parametros[i].getTipe(entorno)=="ID"){
                    indices.unshift(i);
                }
                param_temp[i].ambitos=temp_ambi;
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
                result=new Result();    
                if(sim.visibilidad=="PRIVATE"||sim.visibilidad=="private"){
                    result.visibilidad="PRIVATE";
                }    
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
                            temp+="heap["+temp_h+"]="+result_temp.u_etiqueta+";\n";
                            temp+="h=h+1;\n";
                            temp+="stack["+eti2+"]="+temp_h+";\n";
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
                        result.u_etiqueta=eti12;
                    }else{
                        result.u_etiqueta=null;
                    }
                    temp+="p=p-"+sim_temp.tamanio+";\n";
                }else{
                    alert("Ocurrio un error en el indice padre llamada a metodo");
                    var errores_1=new Errores("Semantico","error en el indice padre llamada a metodo",0,0);
                            lista_errores.push(errores_1);
                }
            }else{
                alert("Error Semantico, No existe el metodo que se esta llamando "+nombre_completo);
                var errores_1=new Errores("Semantico","no existe el metodo que se esta llamando",0,0);
                            lista_errores.push(errores_1);
                result=new Result();
                temp="";
            }
            temp+="\n\n\n";
            temp+="\n";
        }
        result.cadena+=temp;
        return result;
    }
    getTipe(entorno){
        return this.primitivetipe;
    }
}