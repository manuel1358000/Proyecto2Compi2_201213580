class Errores{
    constructor(tipo,descripcion,linea,columna){
        this.indice_errores=indice_errores;
        indice_errores++;
        this.tipo=tipo;
        this.descripcion=descripcion;
        this.linea=linea;
        this.columna=columna;
    }
}
var indice_errores=0;
function agregarErrores(errores){
    lista_errores.push(errores);
}