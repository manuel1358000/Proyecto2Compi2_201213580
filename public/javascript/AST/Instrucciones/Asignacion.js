class Asignacion{
    constructor(id,iniValue,dimensiones){
        this.id=id;
        this.iniValue=iniValue;
        this.dimensiones=dimensiones;
        this.ambitos="";
        this.padre="";
        this.normal="";
    }
    execute(entorno){
        var respuesta=null;
        if(this.id instanceof Este){
            respuesta=new Result();
            respuesta.tipo="this";
            this.id.ambitos=this.ambitos;
            this.id.iniValue=this.iniValue;
            this.id.padre=this.padre;
            this.id.normal=this.normal;
            var result_this=this.id.getValue(entorno);
            if(result_this!=null){
                respuesta.cadena=result_this.cadena;
                respuesta.u_etiqueta=result_this.u_etiqueta;
            }
        }else{
            var tipo=this.getTipe(entorno);
            if(this.iniValue instanceof Aritmetica){
                this.iniValue.ambitos=this.ambitos;
                this.iniValue.padre=this.padre;
                this.iniValue.normal=this.normal;
                respuesta=this.iniValue.getValue(entorno);
                respuesta.tipo=this.iniValue.getTipe(entorno);
            }else if(this.iniValue instanceof Relacional){
                this.iniValue.ambitos=this.ambitos;
                this.iniValue.padre=this.padre;
                this.iniValue.normal=this.normal;
                respuesta=this.iniValue.getValue(entorno);
                respuesta.tipo=this.iniValue.getTipe(entorno);
            }else if(this.iniValue instanceof Logica){
                this.iniValue.ambitos=this.ambitos;
                this.iniValue.padre=this.padre;
                this.iniValue.normal=this.normal;
                respuesta=this.iniValue.getValue(entorno);
                respuesta.tipo=this.iniValue.getTipe(entorno);
            }else if(this.iniValue instanceof Ternario) {
                this.iniValue.ambitos=this.ambitos;
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
                alert(otro);
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