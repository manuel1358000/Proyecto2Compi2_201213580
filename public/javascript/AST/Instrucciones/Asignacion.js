class Asignacion{
    constructor(id,iniValue,dimensiones){
        this.id=id;
        this.iniValue=iniValue;
        this.dimensiones=dimensiones;
        this.ambitos="";
    }
    execute(entorno){
        var respuesta=null;
        if(this.id instanceof Este){
            respuesta=new Result();
            respuesta.tipo="this";
            var ambito_separado=this.ambitos.split('/');
            this.id.ambitos=ambito_separado[0];
            var result_this=this.id.execute(entorno);
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
            }else if(this.iniValue instanceof Ternario) {
                alert("Asignacion ternaria");
            }   
            if(tipo==respuesta.tipo||tipo=="DOUBLE"&&respuesta.tipo=="INTEGER"){
            }else{
                alert("Error semantico, asignacion erronea por tipos");
                respuesta=null;
            }
        }
        return respuesta;
    }
    getTipe(entorno){
        var temp_sim=entorno.obtener(this.id+"_"+this.ambitos);
        if(temp_sim!=null){
            return temp_sim.tipo;
        }else{
            return null;
        }
    }
}