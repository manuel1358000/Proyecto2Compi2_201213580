class AccesoObjetos{
    constructor(id,iniValue){
        this.id=id;
        this.iniValue=iniValue;
        this.ambitos="";
        this.padre="";
        this.normal="";
        this.codigo=codigo;
        codigo++;
        this.primitivetipe;
    }
    //esta seccion se centra en las llamadas a metodos que puedan tener ya que solo se hara referencia a la llamada del metodo y lo que corresponda
    getValue(entorno){
        var result=new Result();
        var temp="";
        var temp_ambi="";
        if(this.padre=="main"){
            temp_ambi=this.ambitos+"/"+this.padre;
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
                if(result_temp!=null){
                    temp+=result_temp.cadena;
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
        return result;
    }
    getTipe(entorno){
        return this.primitivetipe;
    }
}