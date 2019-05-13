class DeclaracionArreglos{
    constructor(id,tipo,modificadores,dimensiones,linea,columna){
        this.id=id;
        this.tipo=tipo;
        this.dimensiones=dimensiones;
        //es una lista de los modificadores, aqui van incluidos los modificadores public, protected
        this.modificadores=modificadores;
        this.inicializado=false;
        this.linea=linea;
        this.columna=columna;
        this.ambitos="";
        this.lista_dimensiones=[];
        this.tipo_asignacion;
        this.objeto=false;
        this.padre="";
        this.normal="";
        this.iniValue;
        this.codigo=codigo;
        codigo++;
    }
    execute(entorno){
        var bandera=false;
        var result=null;
        var temp_ambi="";
        if(this.padre=="main"){
            temp_ambi=this.ambitos+"/"+this.padre;
        }else{
            temp_ambi=this.ambitos;
        }
        if(!numerico(this.tipo)){
            if(this.inicializado==true){
                result=new Result();
                //array de objetos
                if(this.tipo==this.tipo_asignacion){
                    if(this.dimensiones==this.lista_dimensiones.length){
                        var temp="";
                        var eti2=generarEtiqueta();
                        temp+="//INICIO DE LAS DIMENSIONES ARREGLO OBJETOS\n";
                        for(var i=0;i<this.lista_dimensiones.length;i++){
                            this.lista_dimensiones[i].ambitos=temp_ambi;
                            this.lista_dimensiones[i].padre=this.padre;
                            this.lista_dimensiones[i].normal=this.normal;
                            var result_indice=this.lista_dimensiones[i].getValue(entorno);
                            var result_tipo=this.lista_dimensiones[i].getTipe(entorno);   
                            if(result_indice!=null&&result_tipo=="INTEGER"){
                                temp+=result_indice.cadena;
                                var eti_salto=generarSalto();
                                var eti3=generarEtiqueta();
                                if(i==0){
                                    temp+="if("+result_indice.u_etiqueta+">=0) goto "+eti_salto+";\n";
                                    temp+=eti3+"=-1;\n";
                                    temp+=result_indice.u_etiqueta+"="+result_indice.u_etiqueta+"*"+eti3+";\n";
                                    temp+=eti_salto+":\n";
                                    temp+=eti2+"="+result_indice.u_etiqueta+";\n";
                                }else{
                                    temp+="if("+result_indice.u_etiqueta+">=0) goto "+eti_salto+";\n";
                                    temp+=eti3+"=-1;\n";
                                    temp+=result_indice.u_etiqueta+"="+result_indice.u_etiqueta+"*"+eti3+";\n";
                                    temp+=eti_salto+":\n";
                                    temp+=eti2+"="+eti2+"*"+result_indice.u_etiqueta+";\n";
                                }
                            }else{
                                bandera=true;
                            }
                        }
                        if(bandera){
                            alert("Error Semantico, El tamanio de la dimension no existe o no es de tipo integer, declaracion arreglo sera null");
                            this.inicializado=false;
                        }else{
                            var eti5=generarEtiqueta();
                            temp+=eti5+"=-1;\n";
                            var eti4=generarEtiqueta();
                            var eti_salto2=generarSalto();
                            var eti_salto3=generarSalto();
                            temp+=eti4+"=h;\n";
                            temp+=eti_salto2+":\n";
                            temp+="if("+eti2+"<1) goto "+eti_salto3+";\n";
                            temp+="heap[h]="+eti5+";\n";
                            temp+="h=h+1;\n";
                            temp+=eti2+"="+eti2+"-1;\n";
                            temp+="goto "+eti_salto2+";\n";
                            temp+=eti_salto3+":\n";
                            temp+="//FIN DE LAS DIMENSIONES ARREGLO OBJETOS\n";
                            result.cadena+=temp;
                            result.u_etiqueta=eti4;
                        }
                    }else{
                        alert("Error Semantico, no coinciden los tama;os de dimensiones en la declaracion de arreglos");
                        bandera=true;
                    }
                }else{
                    alert("Error Semantico, La declaracion del array de objetos tiene tipos diferentes");
                    bandera=true;
                }
            }else{
                var temp="";
                result=new Result();
                var eti1=generarEtiqueta();
                temp+=eti1+"=-1;\n";
                result.cadena+=temp;
                result.u_etiqueta=eti1;
            }
        }else{
            //objetos
            if(this.inicializado==true){
                result=new Result();
                if(this.iniValue==null){
                    if(this.tipo==this.tipo_asignacion){
                        if(this.dimensiones==this.lista_dimensiones.length){
                            var temp="";
                            var eti2=generarEtiqueta();
                            temp+="//INICIO DE LAS DIMENSIONES ARREGLO\n";
                            for(var i=0;i<this.lista_dimensiones.length;i++){
                                this.lista_dimensiones[i].ambitos=temp_ambi;
                                this.lista_dimensiones[i].padre=this.padre;
                                this.lista_dimensiones[i].normal=this.normal;
                                var result_indice=this.lista_dimensiones[i].getValue(entorno);
                                var result_tipo=this.lista_dimensiones[i].getTipe(entorno);   
                                if(result_indice!=null&&result_tipo=="INTEGER"){
                                    temp+=result_indice.cadena;
                                    var eti_salto=generarSalto();
                                    var eti3=generarEtiqueta();
                                    if(i==0){
                                        temp+="if("+result_indice.u_etiqueta+">=0) goto "+eti_salto+";\n";
                                        temp+=eti3+"=-1;\n";
                                        temp+=result_indice.u_etiqueta+"="+result_indice.u_etiqueta+"*"+eti3+";\n";
                                        temp+=eti_salto+":\n";
                                        temp+=eti2+"="+result_indice.u_etiqueta+";\n";
                                    }else{
                                        temp+="if("+result_indice.u_etiqueta+">=0) goto "+eti_salto+";\n";
                                        temp+=eti3+"=-1;\n";
                                        temp+=result_indice.u_etiqueta+"="+result_indice.u_etiqueta+"*"+eti3+";\n";
                                        temp+=eti_salto+":\n";
                                        temp+=eti2+"="+eti2+"*"+result_indice.u_etiqueta+";\n";
                                    }
                                }else{
                                    bandera=true;
                                }
                            }
                            if(bandera){
                                alert("Error Semantico, El tamanio de la dimension no existe o no es de tipo integer, declaracion arreglo sera null");
                                this.inicializado=false;
                            }else{
                                var eti5=generarEtiqueta();
                                if(this.tipo=="INTEGER"||this.tipo=="DOUBLE"||this.tipo=="BOOLEAN"){
                                    temp+=eti5+"=0;\n";
                                }else{
                                    temp+=eti5+"=-1;\n";
                                }
                                var eti4=generarEtiqueta();
                                var eti_salto2=generarSalto();
                                var eti_salto3=generarSalto();
                                temp+=eti4+"=h;\n";
                                temp+=eti_salto2+":\n";
                                temp+="if("+eti2+"<1) goto "+eti_salto3+";\n";
                                temp+="heap[h]="+eti5+";\n";
                                temp+="h=h+1;\n";
                                temp+=eti2+"="+eti2+"-1;\n";
                                temp+="goto "+eti_salto2+";\n";
                                temp+=eti_salto3+":\n";
                                temp+="//FIN DE LAS DIMENSIONES ARREGLO\n";
                                result.cadena+=temp;
                                result.u_etiqueta=eti4;
                            }
                        }else{
                            alert("Error Semantico, no coinciden los tama;os de dimensiones en la declaracion de arreglos");
                            bandera=true;
                        }
                    }else{
                        alert("Error Semantico, La declaracion del array tiene tipos diferentes");
                        bandera=true;
                    }
                }else{
                    var temp="";
                    //acceso a objeto
                    this.iniValue.ambitos=temp_ambi;
                    this.iniValue.padre=this.padre;
                    this.iniValue.normal=this.normal;
                    var sim_temp=entorno.obtener(this.iniValue.valor+"_"+temp_ambi);
                    if(sim_temp!=null){
                        this.iniValue.lista_dimensiones=sim_temp.lista_dimensiones;
                        var temp_result=this.iniValue.getValue(entorno);
                        if(temp_result!=null){
                            if(this.tipo==sim_temp.tipo){
                                temp+=temp_result.cadena;
                                result.cadena+=temp;
                                result.u_etiqueta=temp_result.u_etiqueta;
                                this.lista_dimensiones=sim_temp.lista_dimensiones;
                            }else{
                                alert("Error semantico, los tipos son diferentes en la declaracion arreglo");
                                bandera=true;
                            }
                        }else{
                            alert("Error Semantico, no existe el id que se quiere asignar al arreglo");
                            bandera=true;
                        }
                    }else{
                        alert("Error Semantico, no existe el id que se quiere asignar al arreglo");
                        bandera=true;
                    }
                }
            }else{
                var temp="";
                result=new Result();
                var eti1=generarEtiqueta();
                temp+=eti1+"=-1;\n";
                result.cadena+=temp;
                result.u_etiqueta=eti1;
            }   
        }
        if(bandera){
            var temp="";
            result=new Result();
            var eti1=generarEtiqueta();
            temp+=eti1+"=-1;\n";
            result.cadena+=temp;
            result.u_etiqueta=eti1;
        }
        //se tiene que retornar el valor que se va a almacenar en el
        return result;
    }
    getTipe(entorno){
        return this.tipo;
    }
    getVisibilidad(){
        var indice="";
        for(var i=0;i<this.modificadores.length;i++){
            if(this.modificadores[i]=="PUBLIC"||this.modificadores[i]=="PRIVATE"||this.modificadores[i]=="PROTECTED"){
                if(indice==""){
                    indice=this.modificadores[i];
                    this.modificadores.splice(i,1);
                }else{
                    this.modificadores.splice(i,1);
                    alert("Solo puede existir un elemento de visibilidad");
                }
            }
        }
        return indice;
    }
}