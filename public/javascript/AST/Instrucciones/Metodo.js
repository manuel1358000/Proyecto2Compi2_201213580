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
    }



    execute(entorno){
        //aqui queda pendiente



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