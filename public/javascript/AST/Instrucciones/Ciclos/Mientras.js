class Mientras{
    constructor(condicion,nodos,tipo){
        this.condicion=condicion;
        this.nodos=nodos;
        this.tipo=tipo;//true es while,false es dowhile
    }
    execute(entorno){
        var result=new Result();
        var local=new Entorno(entorno);
        var temp="";
        result.cadena+=temp;
        return result;
    }
}