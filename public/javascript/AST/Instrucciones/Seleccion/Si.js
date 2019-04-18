class Si{
    constructor(condicion,nodos,subifs,defecto){
        this.condicion=condicion;
        this.nodos=nodos;
        this.subifs=subifs;
        this.defecto=defecto;
        this.ambito="";
    }
    execute(entorno){
        var local=new Entorno(entorno);
        //vamos a evaluar la condicion del if principal
        var result_condi=this.condicion.getValue(entorno);
        var tipo_condi=this.condicion.getTipe(entorno);
        if(result_condi!=null){
            if(tipo_condi=="BOOLEAN"){
                //aqui tengo que evaluar el camino por el cual se va a tomar la decision
                
            }else{
                alert("Error Semantico, la condicion del if debe de ser booleana");
            }
        }
        if(this.subifs.length>0){
            //aqui vamos a verificar los nodos que tiene los else if
            console.log("Evaluando else if");
        }
        if(this.defecto!=null){
            //aqui vamos a verificar el nodo del else
            console.log("Evaluando else");    
        }
    }
}