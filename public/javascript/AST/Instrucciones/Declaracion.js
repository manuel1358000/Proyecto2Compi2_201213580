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
}
