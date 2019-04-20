class Para{
    //inicializado,condicion,aumento,nodos
    constructor(inicializado,condicion,aumento,nodos){
        this.inicializado=inicializado;
        this.condicion=condicion;
        this.aumento=aumento;
        this.nodos=nodos;
        this.ambitos="";
    }
    execute(entorno){
        var local=new Entorno(entorno);
        var result=new Result();
        var temp="";
        result.cadena+=temp;
        return result;
    }
}