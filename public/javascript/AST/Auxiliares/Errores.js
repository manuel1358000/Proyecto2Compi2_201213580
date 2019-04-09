class Errores{
    constructor(tipo,descripcion,linea,columna){
        this.tipo=tipo;
        this.descripcion=descripcion;
        this.linea=linea;
        this.columna=columna;
    }
    
}

function agregarErrores(errores){
    lista_errores.push(errores);
}