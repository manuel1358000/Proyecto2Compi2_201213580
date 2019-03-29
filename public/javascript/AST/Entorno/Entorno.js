class Simbolo{
    constructor(nombre,tipo,ambito,rol,posRel,tamanio,tamdimensiones,visibilidad,modificadores){
        this.nombre=nombre;
        this.tipo=tipo;
        this.ambito=ambito;
        this.rol=rol;
        this.posRel=posRel;
        this.tamanio=tamanio;
        this.dim=tamdimensiones;
        this.visibilidad=visibilidad;
        //los modificadores son una lista de valores separadas por _
        this.modificadores=modificadores;
        this.inicializado=false;
    }
}

class HashTable{
    constructor(){
        this.valores=new Array();
    }
    put(clave,sim){
        var numerohash=this.obtenerHash(clave);
        this.valores[numerohash]=sim;
        //alert("El numero hash es "+numerohash);
    }
    get(clave){
        var numerohash=this.obtenerHash(clave);
        return this.valores[numerohash];
    }
    obtenerHash(clave){
        var hash = 0;
        if (clave.length == 0) {
            return hash;
        }
        for (var i = 0; i < clave.length; i++) {
            var char = clave.charCodeAt(i);
            hash = ((hash<<5)-hash)+char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    }
    getTam(){
        return this.valores.length;

    }
}


class Entorno{
    constructor(padre){
        this.padre=padre;
        this.tabla=new HashTable();
    }
    getEntorno(padre){
        this.padre=padre;
        this.tabla=new HashTable();
    }
    agregar(clave,sim){
        var com=this.obtener(clave);
        if(com==null){
            this.tabla.put(clave,sim);
        }else{
            alert("Error semantico: ya existe una declaracion con la clave "+clave);
        }
    }
    agregarparametro(clave,sim){
        this.tabla.put(clave,sim);
    }
    actualizar(clave,sim){
        this.tabla.put(clave,sim);
    }
    crear(padre){
        this.padre=padre;
    }
    obtener(clave){
        for(var e=this;e!=null;e=e.padre){
            var encontro=e.tabla.get(clave);
            if(encontro!=null)return encontro;
        }
    }
    obtenerultimo(){
        var respuesta=null;
        for(e=this;e!=null;e=e.padre){
            respuesta=e;
        }
        return respuesta;
    }
    getPadre(){
        return this.padre;
    }
}

var PrimitiveType={
    NULO:"NULO",
    INTEGER:"INTEGER",
    STRING:"STRING",
    DOUBLE:"DOUBLE",
    BOOLEAN:"BOOLEAN",
    CHAR:"CHAR"
}

var Type={
    OBJECTO:"OBJECTO",
    ARREGLO:"ARREGLO",
    CLASE:"CLASE",
    METODO:"METODO",
    ID:"ID"
}

var Visibilidad={
    VOID:"VOID",
    PUBLIC:"PUBLIC",
    ABSTRACT:"ABSTRACT",
    STATIC:"STATIC",
    PRIVATE:"PRIVATE",
    PROTECTED:"PROTECTED",
    FINAL:"FINAL",
}






