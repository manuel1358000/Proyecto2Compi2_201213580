class Para{
    //inicializado,condicion,aumento,nodos
    constructor(inicializado,condicion,aumento,nodos,tipo){
        this.inicializado=inicializado;
        this.condicion=condicion;
        this.aumento=aumento;
        this.nodos=nodos;
        this.ambitos="";
        this.tipo=tipo;//true es para un for normal, false es para un foreach
    }
    execute(entorno){
        var local=new Entorno(entorno);
        var result=new Result();
        var temp="";
        if(tipo){
            
        }else{
            alert("soy un for each");
        }








        result.cadena+=temp;
        return result;
    }
}