class Metodo{
    constructor(id,tipo,nodos,parametros){
        this.id=id;
        this.tipo=tipo;
        this.nodos=nodos;
        this.parametros=parametros;
        this.parametros_entrada=[];
        this.retorno=null;
        this.modificadores=[];
        this.constructor=false;
        this.ambitos="";
    }
    execute(entorno){
        //vamos a cargar los parametros a la tabla de simbolos
        //aqui queda pendiente
        var result=new Result();
        //tengo que crear el nuevo nodo
        for(var i=0;i<this.nodos.length;i++){
            if(this.nodos[i] instanceof Declaracion){
                var ambi=this.ambitos;
                var temp="";
                var nombre="";
                var ambi2;
                if(this.id=="main"){
                    nombre="main";
                    ambi2=this.ambitos+"/"+this.id;
                    this.nodos[i].ambitos=ambi;
                }else{
                    var complemento="";
                    for(var f=0;f<this.parametros.length;f++){
                        complemento+="_"+this.parametros[f].tipo;
                    }
                    nombre=this.ambitos+"_"+this.id+complemento;
                    this.nodos[i].ambitos=ambi+"/"+this.id+complemento;
                    ambi2=this.nodos[i].ambitos;
                }
                this.nodos[i].padre=nombre;
                this.nodos[i].normal=ambi;
                var result_temp=this.nodos[i].execute(entorno);
                var tipo_result=this.nodos[i].getTipe(entorno);
                var temp="";
                if(!numerico(tipo_result)){
                    temp+=result_temp.cadena;
                    temp+=result_temp.cadena;
                    temp+="//declaracion OBJETO local\n";
                    var temph=generarEtiqueta();
                    temp+=temph+"=h;\n";
                    temp+="heap[h]="+result_temp.u_etiqueta+";\n";
                    temp+="h=h+1;\n";
                    var simulado=generarEtiqueta();
                    var sim=entorno.obtener(this.nodos[i].id+"_"+ambi2);
                    temp+=simulado+"=p+"+sim.posRel+";\n";
                    temp+="stack["+simulado+"]="+temph+";\n";
                    temp+="//fin declaracion variable local\n";
                    sim.inicializado=true; 
                    entorno.actualizar(this.nodos[i].id+"_"+ambi,sim);
                }else{
                    if(result_temp!=null){
                        temp+=result_temp.cadena;
                        temp+="//declaracion variable local\n";
                        var temph=generarEtiqueta();
                        temp+=temph+"=h;\n";
                        temp+="heap[h]="+result_temp.u_etiqueta+";\n";
                        temp+="h=h+1;\n";
                        var simulado=generarEtiqueta();
                        var sim=entorno.obtener(this.nodos[i].id+"_"+ambi2);
                        temp+=simulado+"=p+"+sim.posRel+";\n";
                        temp+="stack["+simulado+"]="+temph+";\n";
                        temp+="//fin declaracion variable local\n";
                        sim.inicializado=true;
                        entorno.actualizar(this.nodos[i].id+"_"+ambi,sim);
                    }else{
                        temp="//declaracion variable local\n";
                        var temph=generarEtiqueta();
                        temp+=temph+"=h;\n";
                        temp+="heap[h]=0;\n";
                        temp+="h=h+1;\n";
                        var simulado=generarEtiqueta();
                        var sim=entorno.obtener(this.nodos[i].id+"_"+ambi);
                        temp+=simulado+"=p+"+sim.posRel+";\n";
                        temp+="stack["+simulado+"]="+temph+";\n";
                        temp+="//fin declaracion variable local\n";
                        sim.inicializado=true;
                        entorno.actualizar(this.nodos[i].id+"_"+ambi,sim);
                    }
                }
                result.cadena+=temp;
            }else if(this.nodos[i] instanceof Imprimir){
                var ambi=this.ambitos;
                var temp="";
                var nombre="";
                var result_tamanio_salto;
                if(this.id=="main"){
                    nombre="main";
                    result_tamanio_salto=entorno.obtener(nombre);
                    this.nodos[i].ambitos=ambi;
                }else{
                    var complemento="";
                    for(var f=0;f<this.parametros.length;f++){
                        complemento+="_"+this.parametros[f].tipo;
                    }
                    nombre=this.ambitos+"_"+this.id+complemento;
                    this.nodos[i].ambitos=ambi+"/"+this.id+complemento;
                    result_tamanio_salto=entorno.obtener(ambi+"_"+this.id+complemento);
                }
                this.nodos[i].padre=nombre;
                this.nodos[i].normal=ambi;
                this.nodos[i].tam=result_tamanio_salto.tamanio; 
                var result_temp=this.nodos[i].execute(entorno);
                result.cadena+=result_temp.cadena;
            }else if(this.nodos[i] instanceof Asignacion){
                var ambi=this.ambitos;
                var temp="";
                var nombre="";
                if(this.id=="main"){
                    nombre="main";
                    this.nodos[i].ambitos=ambi;
                }else{
                    var complemento="";
                    for(var f=0;f<this.parametros.length;f++){
                        complemento+="_"+this.parametros[f].tipo;
                    }
                    nombre=this.ambitos+"_"+this.id+complemento;
                    this.nodos[i].ambitos=ambi+"/"+this.id+complemento;
                }
                this.nodos[i].padre=nombre;
                this.nodos[i].normal=ambi;
                var result_temp=this.nodos[i].execute(entorno);
                var temp="";
                if(result_temp!=null){
                    if(result_temp.tipo=="this"){
                        temp+="//ACCESO A UN ELEMENTO DEL THIS\n";
                        temp+=result_temp.cadena;
                        temp+="//FINALIZA ACCESO A UN ELEMENTO DEL THIS\n";
                    }else{
                        temp=result_temp.cadena;
                        temp+="//empieza la asignacion variable local\n";
                        var temph=generarEtiqueta();
                        temp+=temph+"=h;\n";
                        temp+="heap[h]="+result_temp.u_etiqueta+";\n";
                        temp+="h=h+1;\n";
                        var simulado=generarEtiqueta();
                        var sim=entorno.obtener(this.nodos[i].id+"_"+ambi);
                        temp+=simulado+"=p+"+sim.posRel+";\n";
                        temp+="stack["+simulado+"]="+temph+";\n";
                        temp+="//fin asignacion variable local\n";
                    }
                }else{
                   
                }
                result.cadena+=temp;
            }else if(this.nodos[i] instanceof Selecciona){
                var ambi=this.ambitos;
                var temp="";
                var nombre="";
                if(this.id=="main"){
                    nombre="main";
                    this.nodos[i].ambitos=ambi;
                }else{
                    var complemento="";
                    for(var f=0;f<this.parametros.length;f++){
                        complemento+="_"+this.parametros[f].tipo;
                    }
                    nombre=this.ambitos+"_"+this.id+complemento;
                    this.nodos[i].ambitos=ambi+"/"+this.id+complemento;
                }
                this.nodos[i].padre=nombre;
                this.nodos[i].normal=ambi;
                var result_temp=this.nodos[i].execute(entorno);
                //aca no vamos a recibir ninguna etiqueta ya que solo se ejecuta el if
                if(result_temp!=null){  
                    result.cadena+=result_temp.cadena;
                }
            }else if(this.nodos[i] instanceof Mientras){
                var ambi=this.ambitos;
                var temp="";
                var nombre="";
                if(this.id=="main"){
                    nombre="main";
                    this.nodos[i].ambitos=ambi;
                }else{
                    var complemento="";
                    for(var f=0;f<this.parametros.length;f++){
                        complemento+="_"+this.parametros[f].tipo;
                    }
                    nombre=this.ambitos+"_"+this.id+complemento;
                    this.nodos[i].ambitos=ambi+"/"+this.id+complemento;
                }
                this.nodos[i].padre=nombre;
                this.nodos[i].normal=ambi;
                var result_temp=this.nodos[i].execute(entorno);
                if(result_temp!=null){  
                    result.cadena+=result_temp.cadena;
                }
            }else if(this.nodos[i] instanceof Aritmetica){
                if(this.nodos[i].unario){
                    var ambi=this.ambitos;
                    var temp="";
                    var nombre="";
                    if(this.id=="main"){
                        nombre="main";
                        this.nodos[i].ambitos=ambi;
                    }else{
                        var complemento="";
                        for(var f=0;f<this.parametros.length;f++){
                            complemento+="_"+this.parametros[f].tipo;
                        }
                        nombre=this.ambitos+"_"+this.id+complemento;
                        this.nodos[i].ambitos=ambi+"/"+this.id+complemento;
                    }
                    this.nodos[i].padre=nombre;
                    this.nodos[i].normal=ambi;
                    var result_temp=this.nodos[i].getValue(entorno);
                    if(result_temp!=null){  
                        result.cadena+=result_temp.cadena;
                    }   
                }else{
                    alert("Error Semantico, Operacion no Permitida, unicamente incremento y decremento");
                }
            }else if(this.nodos[i] instanceof Para){
                var ambi=this.ambitos;
                var temp="";
                var nombre="";
                if(this.id=="main"){
                    nombre="main";
                    this.nodos[i].ambitos=ambi;
                }else{
                    var complemento="";
                    for(var f=0;f<this.parametros.length;f++){
                        complemento+="_"+this.parametros[f].tipo;
                    }
                    nombre=this.ambitos+"_"+this.id+complemento;
                    this.nodos[i].ambitos=ambi+"/"+this.id+complemento;
                }
                this.nodos[i].padre=nombre;
                this.nodos[i].normal=ambi;
                var result_temp=this.nodos[i].execute(entorno);
                if(result_temp!=null){  
                    result.cadena+=result_temp.cadena;
                }
            }else if(this.nodos[i] instanceof Si){
                var ambi=this.ambitos;
                var temp="";
                var nombre="";
                if(this.id=="main"){
                    nombre="main";
                    this.nodos[i].ambitos=ambi;
                }else{
                    var complemento="";
                    for(var f=0;f<this.parametros.length;f++){
                        complemento+="_"+this.parametros[f].tipo;
                    }
                    nombre=this.ambitos+"_"+this.id+complemento;
                    this.nodos[i].ambitos=ambi+"/"+this.id+complemento;
                }
                this.nodos[i].padre=nombre;
                this.nodos[i].normal=ambi;
                var result_temp=this.nodos[i].execute(entorno);
                //aca no vamos a recibir ninguna etiqueta ya que solo se ejecuta el if
                if(result_temp!=null){  
                    result.cadena+=result_temp.cadena;
                }
            }else if(this.nodos[i] instanceof Llamada_Metodo){
                var ambi=this.ambitos;
                var temp="";
                var nombre="";
                if(this.id=="main"){
                    nombre="main";
                    this.nodos[i].ambitos=ambi;
                }else{
                    var complemento="";
                    for(var f=0;f<this.parametros.length;f++){
                        complemento+="_"+this.parametros[f].tipo;
                    }
                    nombre=this.ambitos+"_"+this.id+complemento;
                    this.nodos[i].ambitos=ambi+"/"+this.id+complemento;
                }
                this.nodos[i].padre=nombre;
                this.nodos[i].normal=ambi;
                var result_temp=this.nodos[i].getValue(entorno);
                temp+="//INICIA LLAMADA A METODO\n"
                if(result_temp!=null){
                    temp+=result_temp.cadena;
                }
                temp+="//FINALIZA LLAMADA A METODO\n";
                result.cadena+=temp;
            }else if(this.nodos[i] instanceof Retorno){
                var ambi=this.ambitos;
                var temp="";
                var nombre="";
                if(this.id=="main"){
                    nombre="main";
                    this.nodos[i].ambitos=ambi;
                }else{
                    var complemento="";
                    for(var f=0;f<this.parametros.length;f++){
                        complemento+="_"+this.parametros[f].tipo;
                    }
                    nombre=this.ambitos+"_"+this.id+complemento;
                    this.nodos[i].ambitos=ambi+"/"+this.id+complemento;
                }
                this.nodos[i].padre=nombre;
                this.nodos[i].normal=ambi;
                var result_temp=this.nodos[i].getValue(entorno);
                //aca no vamos a recibir ninguna etiqueta ya que solo se ejecuta el if
                if(result_temp!=null){  
                    result.cadena+=result_temp.cadena;
                }
            }else{
                //es cualquier otra instancia como una asignacion,llamada a metodo
                console.log("Es otra instancia");
            }
        }
        result.cadena+="//AQUI TENEMOS QUE VERIFICAR LA ASIGNACION\n";
        return result;
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
    generarNombre(id){
        var respuesta="";
        var indices="";
        respuesta+=id;
        for(var i=0;i<this.parametros.length;i++){
            if(this.parametros[i] instanceof Declaracion){
                indices+="_"+this.parametros[i].tipo;
            }
        }

        respuesta+=indices;
        return respuesta;
    }
    gettamMetodo(){
        var tam=2+this.parametros.length;
        for(var i=0;i<this.nodos.length;i++){
            if(this.nodos[i] instanceof Declaracion){
                tam++;
            }
        }
        return tam;
    }

}