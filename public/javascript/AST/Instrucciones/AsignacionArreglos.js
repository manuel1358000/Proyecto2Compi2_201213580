class AsignacionArreglos{
    constructor(id,iniValue,dimensiones){
        this.id=id;
        this.iniValue=iniValue;
        this.dimensiones=dimensiones;
        this.ambitos="";
        this.padre="";
        this.normal="";
        this.codigo=codigo;
        codigo++;
        this.lista_valores=[];
        this.constructor_objeto=false;
    }
    execute(entorno){
        var respuesta=null;
        var temp_ambi="";
        if(this.padre=="main"){
            temp_ambi=this.ambitos+"/"+this.padre;
        }else{
            temp_ambi=this.ambitos;
        }
        var tipo=this.getTipe(entorno);
        if(this.iniValue instanceof Aritmetica){
            this.iniValue.ambitos=temp_ambi;
            this.iniValue.padre=this.padre;
            this.iniValue.normal=this.normal;
            respuesta=this.iniValue.getValue(entorno);
            respuesta.tipo=this.iniValue.getTipe(entorno);
        }else if(this.iniValue instanceof Relacional){
            this.iniValue.ambitos=temp_ambi;
            this.iniValue.padre=this.padre;
            this.iniValue.normal=this.normal;
            respuesta=this.iniValue.getValue(entorno);
            respuesta.tipo=this.iniValue.getTipe(entorno);
        }else if(this.iniValue instanceof Logica){
            this.iniValue.ambitos=temp_ambi;
            this.iniValue.padre=this.padre;
            this.iniValue.normal=this.normal;
            respuesta=this.iniValue.getValue(entorno);
            respuesta.tipo=this.iniValue.getTipe(entorno);
        }else if(this.iniValue instanceof Ternario) {
            this.iniValue.ambitos=temp_ambi;
            this.iniValue.padre=this.padre;
            this.iniValue.normal=this.normal;
            respuesta=this.iniValue.getValue(entorno);
            respuesta.tipo=this.iniValue.getTipe(entorno);
        }else if(this.iniValue instanceof Llamada_Metodo){
            if(this.padre=="main"){
                this.iniValue.ambitos="main";
            }else{
                this.iniValue.ambitos=temp_ambi;
            }
            this.iniValue.padre=this.padre;
            this.iniValue.normal=this.normal;
            respuesta=this.iniValue.getValue(entorno);
            respuesta.tipo=this.iniValue.getTipe(entorno);
        }else{
            //aca se declaran objetos para los arreglos
            var temp="";
            respuesta=new Result();
            var eti_h=generarEtiqueta();
            temp+=eti_h+"=h;\n";
            respuesta.u_etiqueta=eti_h;
            var sim=entorno.obtener(tipo+"_GLOBAL");
            temp+="h=h+"+sim.tamanio+";\n";
            var ran;
            if(this.padre=="main"){
                ran=this.padre;
            }else{
                ran=temp_ambi;    
            }
            var sim_temp1=entorno.obtener(ran.replace("/","_"));
            var eti2=generarEtiqueta();
            temp+=eti2+"=p+"+sim_temp1.tamanio+";//simulacion de ambito para poder pasarle los valores del this al objeto\n";
            var eti3=generarEtiqueta();
            temp+=eti3+"="+eti2+"+1;//esta es la direccion del this de las globales\n";
            temp+="stack["+eti3+"]="+eti_h+";\n";
            temp+="//INICIALIZA LAS GLOBALES DEL OBJETO\n";
            temp+="p=p+"+sim_temp1.tamanio+";\n";
            temp+="call globales_"+tipo+";\n";
            temp+="p=p-"+sim_temp1.tamanio+";\n";
            temp+="//FINALIZA LAS GLOBALES DEL OBJETO\n";
            temp+=eti2+"=p+"+sim_temp1.tamanio+";//simulacion de ambito para poder pasarle los valores del this al objeto\n";
            var eti3=generarEtiqueta();
            temp+=eti3+"="+eti2+"+1;//esta es la direccion del this de las globales\n";
            temp+="stack["+eti3+"]="+eti_h+";\n";
            temp+="//INICIA LLAMADA AL CONSTRUCTOR DEL OBJETO\n";
            var nombre_constructor=tipo+"_"+tipo;
            if(this.lista_valores.length==0){
            }else{
                temp+="\n\n\n\n//INICIA EL SETEO DE PARAMETROS PARA EL CONSTRUCTOR\n";//aqui se empiezan a pasar los parametros que se tienen
                var temp_indice=2;
                var eti4=generarEtiqueta();  
                temp+=eti4+"=p+"+sim_temp1.tamanio+";\n";
                for(var i=0;i<this.lista_valores.length;i++){
                    this.lista_valores[i].ambitos=temp_ambi;
                    this.lista_valores[i].padre=this.padre;
                    this.lista_valores[i].normal=this.normal;
                    var result_valor=this.lista_valores[i].getValue(entorno);
                    var tipo_lista=this.lista_valores[i].getTipe(entorno);
                    nombre_constructor+="_"+tipo_lista;  
                    var eti5=generarEtiqueta();
                    temp+=eti5+"="+eti4+"+"+temp_indice+";\n";
                    temp+="//valores\n";
                    temp+=result_valor.cadena;
                    var eti6=generarEtiqueta();
                    temp+=eti6+"=h;\n";
                    temp+="heap[h]="+result_valor.u_etiqueta+";\n";
                    temp+="h=h+1;\n";
                    temp+="stack["+eti5+"]="+eti6+";\n";
                    temp_indice++;
                }
                temp+="//FINALIZA EL SETEO DE PARAMETROS PARA EL CONSTRUCTOR DEL OBJETO\n\n\n\n\n";
            }   
            temp+="p=p+"+sim_temp1.tamanio+";\n";
            temp+="call "+nombre_constructor+";\n";
            temp+="p=p-"+sim_temp1.tamanio+";\n";
            respuesta.cadena+=temp;
            respuesta.tipo=this.iniValue;
        }
        if(tipo==respuesta.tipo||tipo=="DOUBLE"&&respuesta.tipo=="INTEGER"){
        }else{
            alert("Error semantico, asignacion erronea por tipos");
            respuesta=null;
        }
        return respuesta;
    }
    getTipe(entorno){
        var temp_ambi;
        if(this.padre=="main"){
            temp_ambi=this.ambitos+"/"+this.padre;
        }else{
            temp_ambi=this.ambitos;
        }
        var temp_sim=entorno.obtener(this.id+"_"+temp_ambi);
        if(temp_sim!=null){
            return temp_sim.tipo;
        }else{
            return null;
        }
    }
}