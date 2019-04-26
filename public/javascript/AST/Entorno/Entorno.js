class Simbolo{
    constructor(nombre,tipo,ambito,rol,posRel,tamanio,dim,visibilidad,modificadores){
        this.nombre=nombre;
        this.tipo=tipo;
        this.ambito=ambito;
        this.rol=rol;
        this.posRel=posRel;
        this.tamanio=tamanio;
        this.dim=dim;
        if(visibilidad==null||visibilidad==""){
            this.visibilidad=Visibilidad.PUBLIC;
        }else{
            this.visibilidad=visibilidad;
        }
        this.extiende="";
        //los modificadores son una lista de valores separadas por _
        this.modificadores=modificadores;
        this.inicializado=false;
    }
}

class HashTable{
    constructor(){
        this.valores={};
    }
    put(clave,sim){
        this.valores[clave]=sim;
    }
    get(clave){
        return this.valores[clave];
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
            if(sim.ambito==com.ambito){
                alert("Error semantico: ya existe una declaracion con la clave "+clave);
            }else{
                this.tabla.put(clave,sim);
            }
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
    CHAR:"CHAR",
    VOID:"VOID"
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






