class Declaracionclase{
    constructor(id,modificadores,id_extends,nodos){
        this.id=id;
        this.modificadores=modificadores;
        this.id_extends=id_extends;
        this.nodos=nodos;
    }
    execute(entorno){
        var pos=0;
        for(var i=0;i<this.nodos.length;i++){
            if(this.nodos[i] instanceof Declaracion){
                 //nombre,tipo,ambito,rol,apuntador,tamanio,tamdimensiones,visibilidad,modificadores
                var sim=new Simbolo(this.nodos[i].id,this.nodos[i].tipo,this.id,"ATRIBUTO",pos,1,this.nodos[i].dimensiones,this.nodos[i].getVisibilidad(),this.nodos[i].modificadores);
                pos++;
                entorno.agregar(sim.nombre,sim);
            }else{
                //metodos
            }

        }
    }
    getVisibilidad(){
        var indice="";
        for(var i=0;i<this.modificadores.length;i++){
            if(this.modificadores[i]=="PUBLIC"||this.modificadores[i]=="PRIVATE"||this.modificadores[i]=="PROTECTED"){
                if(indice==""){
                    indice=this.modificadores[i];
                    this.modificadores.pop(i);
                }else{
                    this.modificadores.pop(i);
                    alert("Solo puede existir un elemento de visibilidad");
                }
            }
        }
        return indice;
    }
    gettamClase(){
        var tam=1;
        for(var i=0;i<this.nodos.length;i++){
            if(this.nodos[i] instanceof Declaracion){
                tam++;
            }
        }
        return tam;
    }
}