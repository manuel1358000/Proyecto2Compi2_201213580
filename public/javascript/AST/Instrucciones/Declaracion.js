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
    }
    execute(entorno){
        var respuesta=null;
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
        if(tipo==respuesta.tipo||tipo=="DOUBLE"&&respuesta.tipo=="INTEGER"){
        }else{
            alert("Error semantico, Declaracion erronea por tipos");
            respuesta=null;
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
