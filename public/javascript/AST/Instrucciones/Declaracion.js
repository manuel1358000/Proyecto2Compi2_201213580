
class Declaracion{
    constructor(id,tipo,iniValue,modificadores,dimensiones,linea,columna){
        this.id=id;
        this.tipo=tipo;
        this.iniValue=iniValue;
        this.dimensiones=dimensiones;
        //es una lista de los modificadores, aqui van incluidos los modificadores public, protected
        this.modificadores=modificadores;
        this.inicializado=false;
        this.linea=linea;
        this.columna=columna;
        this.ambitos="";
        this.lista_valores=[];
        this.objeto=false;
        this.implicito="";
        this.padre="";
        this.normal="";
    }
    execute(entorno){
        var respuesta=null;
        if(this.inicializado==true){
            var temp="";
            respuesta=new Result();
            var eti_h=generarEtiqueta();
            temp+=eti_h+"=h;\n";
            var sim=entorno.obtener(this.tipo+"_GLOBAL");
            temp+="h=h+"+sim.tamanio+";\n";
            var sim_temp1=entorno.obtener(this.implicito);
            var eti2=generarEtiqueta();
            temp+=eti2+"=p+"+sim_temp1.tamanio+";//simulacion de ambito para poder pasarle los valores del this al objeto\n";
            var eti3=generarEtiqueta();
            temp+=eti3+"="+eti2+"+1;//esta es la direccion del this de las globales\n";
            temp+="stack["+eti3+"]="+eti_h+";\n";
            temp+="//INICIALIZA LAS GLOBALES DEL OBJETO\n";
            temp+="p=p+"+sim_temp1.tamanio+";\n";
            temp+="call globales_"+this.tipo+";\n";
            temp+="p=p-"+sim_temp1.tamanio+";\n";
            temp+="//FINALIZA LAS GLOBALES DEL OBJETO\n";
            temp+=eti2+"=p+"+sim_temp1.tamanio+";//simulacion de ambito para poder pasarle los valores del this al objeto\n";
            var eti3=generarEtiqueta();
            temp+=eti3+"="+eti2+"+1;//esta es la direccion del this de las globales\n";
            temp+="stack["+eti3+"]="+eti_h+";\n";
            temp+="//INICIA LLAMADA AL CONSTRUCTOR DEL OBJETO\n";
            var nombre_constructor=this.tipo+"_"+this.tipo;
            if(this.lista_valores.length==0){
            }else{
                temp+="\n\n\n\n//INICIA EL SETEO DE PARAMETROS PARA EL CONSTRUCTOR\n";//aqui se empiezan a pasar los parametros que se tienen
                var temp_indice=2;
                var eti4=generarEtiqueta();  
                temp+=eti4+"=p+"+sim_temp1.tamanio+";\n";
                for(var i=0;i<this.lista_valores.length;i++){
                    this.lista_valores[i].ambitos=this.ambitos;
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
            temp+="//FINALIZA LLAMADA AL CONSTRUCTOR DEL OBJETO\n";
            respuesta.cadena+=temp;
        }else{
            var tipo=this.getTipe(entorno);
            if(this.iniValue instanceof Aritmetica){
                this.iniValue.ambitos=this.ambitos;
                respuesta=this.iniValue.getValue(entorno);
                respuesta.tipo=this.iniValue.getTipe(entorno);
            }else if(this.iniValue instanceof Relacional){
                this.iniValue.ambitos=this.ambitos;
                respuesta=this.iniValue.getValue(entorno);
                respuesta.tipo=this.iniValue.getTipe(entorno);
            }else if(this.iniValue instanceof Logica){
                this.iniValue.ambitos=this.ambitos;
                respuesta=this.iniValue.getValue(entorno);
                respuesta.tipo=this.iniValue.getTipe(entorno);
            }else if(this.iniValue instanceof Ternario){
                this.iniValue.ambitos=this.ambitos;
                respuesta=this.iniValue.getValue(entorno);
                respuesta.tipo=this.iniValue.getTipe(entorno);
            }else{
            }
            if(respuesta==null){
                respuesta=new Result();
                var eti1=generarEtiqueta();
                //la declaracion no tiene un valor asociado entonces se le va a mandar un valor por defecto
                if(this.tipo=="INTEGER"){
                    respuesta.cadena+=eti1+"=0;\n";
                    respuesta.u_etiqueta=eti1;
                }else if(this.tipo=="CHAR"){
                    respuesta.cadena+=eti1+"=0;\n";
                    respuesta.u_etiqueta=eti1;
                }else if(this.tipo=="DOUBLE"){
                    respuesta.cadena+=eti1+"=0.0;\n";
                    respuesta.u_etiqueta=eti1;
                }else if(this.tipo=="BOOLEAN"){
                    respuesta.cadena+=eti1+"=0;\n";
                    respuesta.u_etiqueta=eti1;
                }else{
                    //se le va a asignar un valor nulo
                    respuesta.cadena+=eti1+"=0;\n";
                    respuesta.u_etiqueta=eti1;
                }
            }else{
                if(tipo==respuesta.tipo||tipo=="DOUBLE"&&respuesta.tipo=="INTEGER"){
                }else{
                    alert("Error semantico, Declaracion erronea por tipos");
                    respuesta=null;
                }
            }
        }
        return respuesta;
    }
    getTipe(){
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
