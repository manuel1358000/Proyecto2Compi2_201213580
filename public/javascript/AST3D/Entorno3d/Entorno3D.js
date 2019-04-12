class Simbolo3D{
    constructor(id,tipo,valor,indice){
        this.id=id;
        this.tipo=tipo;
        this.valor=valor;
        this.indice=indice;
    }
}
class HashTable3D{
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

class Entorno3D{
    constructor(padre){
        this.padre=padre;
        this.tabla=new HashTable3D();
    }
    getEntorno(padre){
        this.padre=padre;
        this.tabla=new HashTable3D();
    }
    agregar(clave,sim){
        var com=this.obtener(clave);
        if(com==null){
            this.tabla.put(clave,sim);
        }else{
            alert("Ya existe una declaracion con esos valores simbolos 3d");
        }
    }
    getTam(){
        return this.tabla.getTam();
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
