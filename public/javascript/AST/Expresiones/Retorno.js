class Retorno{
    constructor(exp1){
        this.exp1=exp1;
        this.primitivetipe;
        this.ambitos="";
        this.padre="";
        this.normal="";
        this.codigo=codigo;
        codigo++;
    }
    getValue(entorno){
        var result=new Result();
        var temp="";
        if(this.exp1!=null){
            var temp_ambi="";
            if(this.padre=="main"){
                temp_ambi=this.ambitos+"/"+this.padre;
            }else{
                temp_ambi=this.ambitos;
            }
            var sim;
            if(this.padre=="main"){
                sim=entorno.obtener("main");
            }else{
                sim=entorno.obtener(temp_ambi.replace("/","_"));
            }
            if(sim!=null){
                if(sim.tipo=="VOID"){
                    alert("Error Semantico, la sentencia retorno no puede existir en un metodo de tipo VOID");
                }else{
                    this.exp1.ambitos=temp_ambi;
                    this.exp1.padre=this.padre;
                    this.exp1.normal=this.normal;
                    var temp_result=this.exp1.getValue(entorno);
                    var temp_tipo=this.exp1.getTipe(entorno);
                    if(temp_result!=null){
                        if(temp_tipo==sim.tipo){
                            temp+=temp_result.cadena;
                            var eti1=generarEtiqueta();
                            temp+=eti1+"=p+0;//posicion del return en el objeto\n";
                            var eti2=generarEtiqueta();
                            temp+=eti2+"=h;\n";
                            temp+="heap[h]="+temp_result.u_etiqueta+";\n";
                            temp+="h=h+1;\n";
                            temp+="stack["+eti1+"]="+eti2+";\n";
                        }else{
                            alert("Error Semantico, el tipo del retorno y la funcion no son iguales");
                        }
                    }else{
                        alert("Error Semantico, No se pudo realizar la operacion");
                    }
                }
            }else{
                alert("Error Semantico, no existe el metodo donde esta el return");
            }
            
        }else{
            //se tiene que retornar el null
            alert("Tenemos que retornar el null");
        }
        result.cadena+=temp;
        return result;
    }
    getTipe(entorno){
        return this.primitivetipe;
    }
}