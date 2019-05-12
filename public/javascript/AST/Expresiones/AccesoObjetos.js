class AccesoObjetos{
    constructor(id,iniValue){
        this.id=id;
        this.iniValue=iniValue;//es el metodo y la expresion
        this.ambitos="";
        this.padre="";
        this.normal="";
        this.codigo=codigo;
        codigo++;
        this.primitivetipe;
    }
    //esta seccion se centra en las llamadas a metodos que puedan tener ya que solo se hara referencia a la llamada del metodo y lo que corresponda
    getValue(entorno){
        if(this.iniValue.id=="length"||this.iniValue.id=="getClass"||this.iniValue.id=="toString"||this.iniValue.id=="equals"||this.iniValue.id=="toCharArray"||this.iniValue.id=="toUpperCase"||this.iniValue.id=="toLowerCase"){
            var result=new Result();
            var temp="";
            var temp_ambi="";
            if(this.padre=="main"){
                temp_ambi=this.ambitos;
            }else{
                temp_ambi=this.ambitos;
            }
            switch(this.iniValue.id){
                case "getClass":{
                    var sim=entorno.obtener(this.id+"_"+temp_ambi);
                    if(sim!=null){
                        var eti1=generarEtiqueta();
                        temp+=eti1+"=h;";
                        temp+=generarString2(sim.tipo);
                        result.u_etiqueta=eti1;
                        this.primitivetipe="STRING";
                        result.cadena+=temp;
                    }else{
                        alert("Error Semantico, no existe el id que se quiere buscar");
                    }
                    break;
                }
                case "toString":{
                    var sim=entorno.obtener(this.id+"_"+temp_ambi);
                    if(sim!=null){
                        if(sim.tipo=="BOOLEAN"||sim.tipo=="CHAR"||sim.tipo=="DOUBLE"||sim.tipo=="INTEGER"){
                            var eti1=generarEtiqueta();
                            temp+=eti1+"=p+"+sim.posRel+";\n";
                            var eti2=generarEtiqueta();
                            temp+=eti2+"=stack["+eti1+"];\n";
                            var eti3=generarEtiqueta();
                            temp+=eti3+"=heap["+eti2+"];\n";//aqui ya tengo el valor puntual del char
                            var result_temp=generarString(eti3,true,sim.tipo);
                            temp+=result_temp.cadena;
                            result.u_etiqueta=result_temp.u_etiqueta;
                            result.cadena+=temp;
                            this.primitivetipe="STRING";
                        }else if(sim.tipo=="STRING"){
                            //se queda normal
                            var eti1=generarEtiqueta();
                            temp+=eti1+"=p+"+sim.posRel+";\n";
                            var eti2=generarEtiqueta();
                            temp+=eti2+"=stack["+eti1+"];\n";
                            var eti3=generarEtiqueta();
                            temp+=eti3+"=heap["+eti2+"];\n";
                            result.cadena+=temp;
                            result.u_etiqueta=eti3;
                            this.primitivetipe=sim.tipo;
                        }else{
                            var eti1=generarEtiqueta();
                            temp+=eti1+"=p+"+sim.posRel+";\n";
                            var eti2=generarEtiqueta();
                            temp+=eti2+"=stack["+eti1+"];\n";
                            var eti3=generarEtiqueta();
                            temp+=eti3+"=heap["+eti2+"];\n";//aqui ya tengo el valor puntual del char
                            temp+=eti3+"="+eti3+"+48;\n";
                            var result_temp=generarString(eti3,true,"INTEGER");
                            temp+=result_temp.cadena;
                            result.u_etiqueta=result_temp.u_etiqueta;
                            result.cadena+=temp;
                            this.primitivetipe="STRING";
                        }
                    }else{
                        alert("Error Semantico, no existe el id que se quiere buscar");
                    }
                    break;
                }
                case "equals":{
                    var eti1=generarEtiqueta();
                    temp+=eti1+"=0;\n";
                    result.u_etiqueta=eti1;
                    result.cadena+=temp;
                    this.primitivetipe="BOOLEAN";
                    break;
                }
                case "toCharArray":{
                    alert("toCharArray");
                    break;
                }
                case "toUpperCase":{
                    var sim=entorno.obtener(this.id+"_"+temp_ambi);
                    if(sim.tipo=="STRING"){
                        var eti_salida=generarSalto();
                        var eti_salida2=generarSalto();
                        var eti1=generarEtiqueta();
                        temp+=eti1+"=p+"+sim.posRel+";\n";
                        var eti2=generarEtiqueta();
                        temp+=eti2+"=stack["+eti1+"];\n";
                        var eti3=generarEtiqueta();
                        var eti_s=generarSalto();
                        temp+=eti3+"=heap["+eti2+"];\n";
                        var eti_h=generarEtiqueta();
                        temp+=eti_h+"=h;\n";
                        temp+=eti_s+":\n";
                        var eti6=generarEtiqueta();
                        temp+=eti6+"=heap["+eti3+"];\n";
                        temp+="if("+eti6+"==0) goto "+eti_salida+";\n";
                        temp+="if("+eti6+"<97) goto "+eti_salida2+";\n";
                        temp+="if("+eti6+">122) goto "+eti_salida2+";\n";
                        temp+=eti6+"="+eti6+"-32;\n";
                        temp+=eti_salida2+":\n";
                        temp+="heap[h]="+eti6+";\n";
                        temp+="h=h+1;\n";
                        temp+=eti3+"="+eti3+"+1;\n";
                        temp+="goto "+eti_s+";\n";
                        temp+=eti_salida+":\n";
                        temp+="heap[h]=0;\n";
                        temp+="h=h+1;\n";
                        //en eti3 empiezan los valores del string
                        result.cadena+=temp;
                        result.u_etiqueta=eti_h;
                        this.primitivetipe="STRING";
                    }else{
                        alert("Error Semantico, el metodo touppercase solo se puede aplicar a valores de tipo STRING");
                    }
                    break;
                }
                case "toLowerCase":{
                    var sim=entorno.obtener(this.id+"_"+temp_ambi);
                    if(sim.tipo=="STRING"){
                        var eti_salida=generarSalto();
                        var eti_salida2=generarSalto();
                        var eti1=generarEtiqueta();
                        temp+=eti1+"=p+"+sim.posRel+";\n";
                        var eti2=generarEtiqueta();
                        temp+=eti2+"=stack["+eti1+"];\n";
                        var eti3=generarEtiqueta();
                        var eti_s=generarSalto();
                        temp+=eti3+"=heap["+eti2+"];\n";
                        var eti_h=generarEtiqueta();
                        temp+=eti_h+"=h;\n";
                        temp+=eti_s+":\n";
                        var eti6=generarEtiqueta();
                        temp+=eti6+"=heap["+eti3+"];\n";
                        temp+="if("+eti6+"==0) goto "+eti_salida+";\n";
                        temp+="if("+eti6+"<65) goto "+eti_salida2+";\n";
                        temp+="if("+eti6+">90) goto "+eti_salida2+";\n";
                        temp+=eti6+"="+eti6+"+32;\n";
                        temp+=eti_salida2+":\n";
                        temp+="heap[h]="+eti6+";\n";
                        temp+="h=h+1;\n";
                        temp+=eti3+"="+eti3+"+1;\n";
                        temp+="goto "+eti_s+";\n";
                        temp+=eti_salida+":\n";
                        temp+="heap[h]=0;\n";
                        temp+="h=h+1;\n";
                        //en eti3 empiezan los valores del string
                        result.cadena+=temp;
                        result.u_etiqueta=eti_h;
                        this.primitivetipe="STRING";
                    }else{
                        alert("Error Semantico, el metodo touppercase solo se puede aplicar a valores de tipo STRING");
                    }
                    break;   
                }
                case "length":{
                    var sim=entorno.obtener(this.id+"_"+temp_ambi);
                    if(sim!=null){
                        if(sim.lista_dimensiones.length>0){
                            sim.lista_dimensiones[0].ambitos=this.ambitos;
                            sim.lista_dimensiones[0].padre=this.padre;
                            sim.lista_dimensiones[0].normal=this.normal;
                            var result_dimen=sim.lista_dimensiones[0].getValue(entorno);
                            temp+=result_dimen.cadena;
                            var eti1=generarEtiqueta();
                            temp+=eti1+"="+result_dimen.u_etiqueta+";\n";
                            result.cadena+=temp;
                            result.u_etiqueta=eti1;
                            this.primitivetipe="INTEGER";
                        }else{
                            var eti1=generarEtiqueta();
                            temp+=eti1+"="+sim.lista_dimensiones.length+";\n";
                            result.cadena+=temp;
                            result.u_etiqueta=eti1;
                            this.primitivetipe="INTEGER";
                        }
                    }else{
                        alert("Error Semantico, No existe el id que se esta buscando para obtener el length");
                    }
                    break;
                }
                default:{
                    alert("Metodo Extra");
                    break;
                }
            }
        }else{
            var result=new Result();
            var temp="";
            var temp_ambi="";
            if(this.padre=="main"){
                temp_ambi=this.ambitos;
            }else{
                temp_ambi=this.ambitos;
            }
            var sim=entorno.obtener(this.id+"_"+temp_ambi);
            if(sim!=null&&this.iniValue!=null){  
                if(sim.inicializado){
                    this.iniValue.normal=sim.tipo;
                    this.iniValue.ambitos=this.ambitos;
                    this.iniValue.padre=this.padre;
                    var result_temp=this.iniValue.getValue(entorno);
                    var result_tipo=this.iniValue.getTipe(entorno);
                    if(result_temp!=null){
                        if(result_temp.visibilidad=="PRIVATE"||result_temp.visibilidad=="private"){
                            alert("Error Semantico, la visibilidad del metodo es private no se puede acceder a ella");
                        }else{
                            temp+="//aqui------------------------------------";
                            temp+=result_temp.cadena;
                            temp+="//finaliza-----------------------------";
                            result.u_etiqueta=result_temp.u_etiqueta;
                            this.primitivetipe=result_tipo;
                        }
                    }else{
                        alert("Error Semantico, No se pudo realizar la llamada al metodo del objeto");
                    }
                }else{
                    alert("Error Semantico, El objeto al que quiere acceder no esta inicializado");
                }
            }else{
                alert("Error Semantico, El objeto al que quiere acceder no existe en el entorno o no esta instanciado");
            }
            result.cadena+=temp;
        }
        return result;
    }
    getTipe(entorno){
        return this.primitivetipe;
    }
}