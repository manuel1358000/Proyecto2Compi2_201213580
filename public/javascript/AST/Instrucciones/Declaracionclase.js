class Declaracionclase{
    constructor(id,modificadores,id_extends,nodos){
        this.id=id;
        this.modificadores=modificadores;
        this.id_extends=id_extends;
        this.nodos=nodos;
    }
    execute(entorno){
        var respuesta="";
        var variables_globales="void globales_"+this.id+"(){\n";
        for(var i=0;i<this.nodos.length;i++){
            var nodo=this.nodos[i];
            if(nodo instanceof Declaracion){
                var result=nodo.execute(entorno);
                if(result.tipo==nodo.tipo){
                    var temp="";
                    if(result.cadena!=null){
                        temp+=result.cadena;
                    }
                    //respuesta+=nodo.execute(entorno);
                    temp+="//EMPIEZA LA INICIALIZACION\n";
                    var eti_this=generarEtiqueta();
                    temp+=eti_this+"=p+1;//se mueve una posicion por el this\n";
                    var eti_aux=generarEtiqueta();
                    temp+=eti_aux+"=stack["+eti_this+"]; //puntero del objeto\n";
                    var eti_aux2=generarEtiqueta();
                    var sim_aux=entorno.obtener(nodo.id+"_"+this.id);
                    temp+=eti_aux2+"="+eti_aux+"+"+sim_aux.posRel+";//direccion de "+nodo.id+"\n";
                    if(result.u_etiqueta==null){
                        temp+="heap["+eti_aux2+"]=0;//asignacion del valor al heap\n";
                    }else{
                        temp+="heap["+eti_aux2+"]="+result.u_etiqueta+";//asignacion del valor al heap\n";
                    }
                    temp+="//Finalizo la signacion \n";
                    //finalizado
                    variables_globales+=temp;
                    }else{
                        var c_error="No se puede generar el codigo 3d de la variable "+nodo.id+" Se le quiere asignar un valor "+result.tipo;
                        var error=new Errores("SEMANTICO",c_error,0,0);
                        agregarErrores(error);
                    }
            }else if(nodo instanceof Metodo){
                //metodos
                nodo.ambitos=this.id;
                var result=nodo.execute(entorno);
                var temp="";
                temp+="\n//INICIA LA CREACION DEL METODO\n";
                temp+=nodo.tipo +" " + nodo.id + "(){\n";
                temp+=result.cadena;
                temp+="\n}\n";
                respuesta+=temp;
            }else if(nodo instanceof Imprimir){
                var result_imprimir=nodo.execute(entorno);
                console.log("-----------------------imprimir ------------------------");
                console.log(result_imprimir.cadena);
                console.log("----------------------- fin imprimir -------------------");
            }else{
                
            }

        }
        variables_globales+="}\n";
        respuesta=variables_globales+respuesta;

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
                    var c_error="Solo puede existir un elemento de visibilidad";
                    agregarErrores(new Errores("SEMANTICO",c_error,0,0));
                }
            }
        }
        return indice;
    }
    gettamClase(){
        var tam=0;
        for(var i=0;i<this.nodos.length;i++){
            if(this.nodos[i] instanceof Declaracion){
                tam++;
            }
        }
        return tam;
    }
}