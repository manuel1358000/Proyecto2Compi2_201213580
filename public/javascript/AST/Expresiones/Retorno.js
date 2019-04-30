class Retorno{
    constructor(exp1){
        this.exp1=exp1;
        this.primitivetipe;
        this.ambitos="";
        this.padre="";
        this.normal="";
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

        }else{
            //se tiene que retornar el null
            alert("Tenemos que retornar el null");
        }




        var eti1=generarEtiqueta();
        temp+=eti1+"=p+0;\n";
        var eti2=generarEtiqueta();
        temp+=eti2+"=h;\n";
        temp+="heap[h]=10;\n";
        temp+="h=h+1;\n";
        temp+="stack["+eti1+"]="+eti2+";\n";
        result.cadena+=temp;
        return result;
    }
    getTipe(entorno){
        return this.primitivetipe;
    }
}