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
    }
    execute(entorno){
        var respuesta="";
        console.log(this.iniValue);
        if(this.iniValue instanceof Aritmetica){
            respuesta=this.iniValue.getValue(entorno);
            console.log(respuesta.cadena);
            console.log("El temporal del heap es "+respuesta.u_etiqueta);
        }else if(this.iniValue instanceof Relacional){
            respuesta=this.iniValue.getValue(entorno);
            console.log(respuesta.cadena);
            console.log("El temporal del heap es "+respuesta.u_etiqueta);
        }else if(this.iniValue instanceof Logica){
            respuesta=this.iniValue.getValue(entorno);
            console.log(respuesta.cadena);
            console.log("El temporal del heap es "+respuesta.u_etiqueta);
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
