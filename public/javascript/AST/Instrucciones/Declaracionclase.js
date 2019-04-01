class Declaracionclase{
    constructor(id,modificadores,id_extends,nodos){
        this.id=id;
        this.modificadores=modificadores;
        this.id_extends=id_extends;
        this.nodos=nodos;
    }
    execute(entorno){
        var respuesta="";
        var pos=0;
        console.log(this.nodos.length);
        for(var i=0;i<this.nodos.length;i++){
            if(this.nodos[i] instanceof Declaracion){
                 //nombre,tipo,ambito,rol,apuntador,tamanio,tamdimensiones,visibilidad,modificadores
                var sim=new Simbolo(this.nodos[i].id,this.nodos[i].tipo,this.id,"ATRIBUTO",pos,1,this.nodos[i].dimensiones,this.nodos[i].getVisibilidad(),this.nodos[i].modificadores);
                pos++;
                entorno.agregar(sim.nombre,sim);
                console.log(this.nodos[i].iniValue.valor);
                respuesta+=this.nodos[i].execute(entorno);
            }else{
                //metodos
                console.log("Es otra instancia");
            }
        }
        return respuesta;
    }
    getTipe(){
        return this.tipo;
    }
    getVisibilidad(){
        var indice="";
        for(var i=0;i<this.modificadores.length;i++){
            if(this.modificadores[i]=="PUBLIC"||this.modificadores[i]=="PRIVATE"||this.modificadores[i]=="PROTECTED"){
                if(indice==""){
                    indice=this.modificadores[i];
                    this.modificadores.splice(i,1);
                }else{
                    this.modificadores.splice(i,1);
                    alert("Solo puede existir un elemento de visibilidad");
                }
            }
        }
        return indice;
    }
    gettamClase(){
        var tam=0;
        for(var i=0;i<this.nodos.length;i++){
            if(this.nodos[i] instanceof Declaracion){
                tam++;
            }
        }
        return tam;
    }
}