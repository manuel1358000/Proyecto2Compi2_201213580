class Metodo{
    constructor(id,tipo,nodos,parametros){
        this.id=id;
        this.tipo=tipo;
        this.nodos=nodos;
        this.parametros=parametros;
        this.parametros_entrada=[];
        this.retorno=null;
        this.modificadores=[];
        this.constructor=false;
        this.ambitos="";
    }
    execute(entorno){
        //aqui queda pendiente
        var result=new Result();
        //tengo que crear el nuevo nodo
        for(var i=0;i<this.nodos.length;i++){
            if(this.nodos[i] instanceof Declaracion){
                var ambi=this.ambitos+"/"+this.id;
                this.nodos[i].ambitos=ambi;
                var result_temp=this.nodos[i].execute(entorno);
                if(result_temp!=null){
                    result.cadena+=result_temp.cadena;
                    var temp="//declaracion variable local\n";
                    var temph=generarEtiqueta();
                    temp+=temph+"=h;\n";
                    temp+="heap[h]="+result_temp.u_etiqueta+";\n";
                    temp+="h=h+1;\n";
                    var simulado=generarEtiqueta();
                    var sim=entorno.obtener(this.nodos[i].id+"_"+ambi);
                    temp+=simulado+"=p+"+sim.posRel+";\n";
                    temp+="stack["+simulado+"]="+temph+";\n";
                    temp+="//fin declaracion variable local\n";
                }else{
                    var temp="//declaracion variable local\n";
                    var temph=generarEtiqueta();
                    temp+=temph+"=h;\n";
                    temp+="heap[h]=0;\n";
                    temp+="h=h+1;\n";
                    var simulado=generarEtiqueta();
                    var sim=entorno.obtener(this.nodos[i].id+"_"+ambi);
                    temp+=simulado+"=p+"+sim.posRel+";\n";
                    temp+="stack["+simulado+"]="+temph+";\n";
                    temp+="//fin declaracion variable local\n";
                }
                result.cadena+=temp;
            }else if(this.nodos[i] instanceof Imprimir){
                this.nodos[i].ambitos=this.ambitos+"/"+this.id;
                var result_temp=this.nodos[i].execute(entorno);
                result.cadena+=result_temp.cadena;
            }else{
                //es cualquier otra instancia como una asignacion,llamada a metodo
            }
        }
        return result;
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
    generarNombre(id){
        var respuesta="";
        var indices="";
        respuesta+=id;
        for(var i=0;i<this.parametros.length;i++){
            if(this.parametros[i] instanceof Declaracion){
                indices+="_"+this.parametros[i].tipo;
            }
        }

        respuesta+=indices;
        return respuesta;
    }
    gettamMetodo(){
        var tam=0;
        for(var i=0;i<this.nodos.length;i++){
            if(this.nodos[i] instanceof Declaracion){
                tam++;
            }
        }
        return tam;
    }

}