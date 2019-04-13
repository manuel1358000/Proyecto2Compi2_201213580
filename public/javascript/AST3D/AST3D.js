

function ejecutar3D(nodos){
    //primera pasada vamos a crear los simbolos de las declaraciones y vamos a recorrer todos los saltos
    //vamos a cargar los simbolos a la tabla de simbolos
    var entorno3d=new Entorno3D(null);
    var i_main=-1;
    var pila=[];//esta pila es la que controla las llamadas que se hacen a metodos para saber a donde regresar
    for(var i=0;i<nodos.length;i++){
        var nodo=nodos[i];
        if(nodo instanceof Declaracion3D){
            if(nodo.tipo=="P"){
                //id,tipo,valor,indice
                ptr_p=nodo.valor;
                var sim=new Simbolo3D(nodo.id,nodo.tipo,ptr_p,i);
                entorno3d.agregar(nodo.id,sim);
            }else if(nodo.tipo=="H"){
                ptr_h=nodo.valor;
                var sim=new Simbolo3D(nodo.id,nodo.tipo,ptr_h,i);
                entorno3d.agregar(nodo.id,sim);
            }else if(nodo.tipo=="STACK"){
                stack=[];
                var sim=new Simbolo3D(nodo.id,nodo.tipo,stack,i);
                entorno3d.agregar(nodo.id,sim);
            }else if(nodo.tipo=="HEAP"){
                heap=[];
                var sim=new Simbolo3D(nodo.id,nodo.tipo,heap,i);
                entorno3d.agregar(nodo.id,sim);
            }else if(nodo.tipo=="ETIQUETA"){
                var sim=new Simbolo3D(nodo.id,nodo.tipo,null,i);
                entorno3d.agregar(nodo.id,sim);
            }
        }else if(nodo instanceof Salto3D){
            var sim=new Simbolo3D(nodo.id,nodo.tipo,nodo.valor,i);
            entorno3d.agregar(nodo.id,sim);
        }else if(nodo instanceof Metodo3D){
            if(nodo.tipo=="INICIO"){
                if(nodo.id=="main"){
                    i_main=i;
                }
                var sim=new Simbolo3D(nodo.id,"METODO",nodo.valor,i);
                entorno3d.agregar(nodo.id,sim);
            }
        }
    }
    //segunda pasada, vamos a buscar el metodo main y lo empieza a ejecutar
    //i_main es el indice que nos va a llevar el control de la ejecucion del codigo
    if(i_main>=0){
        for(var f=i_main;f<nodos.length;f++){
            var t_nodo=nodos[f];
            if(t_nodo instanceof Asignacion3D){
                var sim=entorno3d.obtener(t_nodo.id);
                if(sim!=null){
                    if(sim.tipo=="ETIQUETA"){
                        //numero,etiqueta,h,p,heap,stack
                        if(t_nodo.exp1.tipo=="H"){
                            sim.valor=ptr_h;
                        }else if(t_nodo.exp1.tipo=="P"){
                            sim.valor=ptr_p;
                        }else if(t_nodo.exp1.tipo=="STACK"){
                            var temp_indice=obtenerIndice(t_nodo.exp1,entorno3d);
                            if(temp_indice!=null){
                                sim.valor=stack[temp_indice];
                            }else{
                                alert("Error semantico, la posicion que quiere acceder al stack es nulo o no existe.");
                            }
                        }else if(t_nodo.exp1.tipo=="HEAP"){
                            var temp_indice=obtenerIndice(t_nodo.exp1,entorno3d);
                            if(temp_indice!=null){
                                sim.valor=heap[temp_indice];
                            }else{
                                alert("Error semantico, la posicion que quiere acceder al stack es nulo o no existe.");
                            }
                        }else if(t_nodo.exp1.tipo=="ETIQUETA"){
                            var temp_eti=t_nodo.exp1.getValue(entorno3d);
                            var temp_sim=entorno3d.obtener(temp_eti);
                            if(temp_sim.valor!=null){
                                sim.valor=temp_sim.valor;
                            }else{
                                alert("Error semantico, el valor a asignar no existe o es nulo");
                            }
                        }else if(t_nodo.exp1.tipo=="NUMERO"){
                            var temp_valor=t_nodo.exp1.getValue(entorno3d);
                            if(temp_valor!=null){
                                sim.valor=temp_valor;
                            }else{
                                alert("Error semantico, el valor a asignar no existe o es nulo");
                            }
                        }else if(t_nodo.exp1.tipo=="EXPRESION"){
                            console.log("etiqueta expresion");
                        }else{
                            alert("Error semantico, operacion incorrecta para etiqueta");
                        }
                        entorno3d.actualizar(sim.id,sim);
                    }else if(sim.tipo=="H"){
                        if(t_nodo.exp1.tipo=="H"){
                            ptr_h=ptr_h;
                        }else if(t_nodo.exp1.tipo=="P"){
                            ptr_h=ptr_p;
                        }else if(t_nodo.exp1.tipo=="STACK"){
                            var temp_indice=obtenerIndice(t_nodo.exp1,entorno3d);
                            if(temp_indice!=null){
                                ptr_h=stack[temp_indice];
                            }else{
                                alert("Error semantico, la posicion que quiere acceder al stack es nulo o no existe.");
                            }
                        }else if(t_nodo.exp1.tipo=="HEAP"){
                            var temp_indice=obtenerIndice(t_nodo.exp1,entorno3d);
                            if(temp_indice!=null){
                                ptr_h=heap[temp_indice];
                            }else{
                                alert("Error semantico, la posicion que quiere acceder al stack es nulo o no existe.");
                            }
                        }else if(t_nodo.exp1.tipo=="ETIQUETA"){
                            var temp_eti=t_nodo.exp1.getValue(entorno3d);
                            var temp_sim=entorno3d.obtener(temp_eti);
                            if(temp_sim.valor!=null){
                                ptr_h=temp_sim.valor;
                            }else{
                                alert("Error semantico, el valor a asignar no existe o es nulo");
                            }
                        }else if(t_nodo.exp1.tipo=="NUMERO"){
                            var temp_valor=t_nodo.exp1.getValue(entorno3d);
                            if(temp_valor!=null){
                                ptr_h=temp_valor;
                            }else{
                                alert("Error semantico, el valor a asignar no existe o es nulo");
                            }
                        }else if(t_nodo.exp1.tipo=="EXPRESION"){
                            console.log("etiqueta expresion");
                        }else{
                            alert("Error semantico, operacion incorrecta para h");
                        }
                    }else if(sim.tipo=="P"){
                        if(t_nodo.exp1.tipo=="H"){
                            ptr_p=ptr_h;
                        }else if(t_nodo.exp1.tipo=="P"){
                            ptr_p=ptr_p;
                        }else if(t_nodo.exp1.tipo=="STACK"){
                            var temp_indice=obtenerIndice(t_nodo.exp1,entorno3d);
                            if(temp_indice!=null){
                                ptr_p=stack[temp_indice];
                            }else{
                                alert("Error semantico, la posicion que quiere acceder al stack es nulo o no existe.");
                            }
                        }else if(t_nodo.exp1.tipo=="HEAP"){
                            var temp_indice=obtenerIndice(t_nodo.exp1,entorno3d);
                            if(temp_indice!=null){
                                ptr_p=heap[temp_indice];
                            }else{
                                alert("Error semantico, la posicion que quiere acceder al stack es nulo o no existe.");
                            }
                        }else if(t_nodo.exp1.tipo=="ETIQUETA"){
                            var temp_eti=t_nodo.exp1.getValue(entorno3d);
                            var temp_sim=entorno3d.obtener(temp_eti);
                            if(temp_sim.valor!=null){
                                ptr_p=temp_sim.valor;
                            }else{
                                alert("Error semantico, el valor a asignar no existe o es nulo");
                            }
                        }else if(t_nodo.exp1.tipo=="NUMERO"){
                            var temp_valor=t_nodo.exp1.getValue(entorno3d);
                            if(temp_valor!=null){
                                ptr_p=temp_valor;
                            }else{
                                alert("Error semantico, el valor a asignar no existe o es nulo");
                            }
                        }else if(t_nodo.exp1.tipo=="EXPRESION"){
                            console.log("etiqueta expresion");
                        }else{
                            alert("Error semantico, operacion incorrecta para p");
                        }
                    }else if(sim.tipo=="STACK"){
                        if(t_nodo.exp1.tipo=="H"){
                            var temp_indice=obtenerIndice(t_nodo,entorno3d);
                            if(temp_indice!=null){
                                stack[temp_indice]=ptr_h;
                            }else{
                                alert("Error semantico, la posicion que quiere acceder al stack es nulo o no existe, H");
                            }
                        }else if(t_nodo.exp1.tipo=="P"){
                            var temp_indice=obtenerIndice(t_nodo,entorno3d);
                            if(temp_indice!=null){
                                stack[temp_indice]=ptr_p;
                            }else{
                                alert("Error semantico, la posicion que quiere acceder al stack es nulo o no existe, P");
                            }
                        }else if(t_nodo.exp1.tipo=="STACK"){
                            var temp_indice=obtenerIndice(t_nodo,entorno3d);
                            if(temp_indice!=null){
                                var temp_indice2=obtenerIndice(t_nodo.exp1,entorno3d);
                                if(temp_indice2!=null){
                                    stack[temp_indice]=stack[temp_indice2];
                                }else{
                                    alert("Error semantico, la posicion que quiere acceder al stack es nulo o no existe.");
                                }
                            }else{
                                alert("Error semantico, la posicion que quiere acceder al stack es nulo o no existe,ETIQUETA");
                            }
                        }else if(t_nodo.exp1.tipo=="HEAP"){
                            var temp_indice=obtenerIndice(t_nodo,entorno3d);
                            if(temp_indice!=null){
                                var temp_indice2=obtenerIndice(t_nodo.exp1,entorno3d);
                                if(temp_indice2!=null){
                                    stack[temp_indice]=heap[temp_indice2];
                                }else{
                                    alert("Error semantico, la posicion que quiere acceder al stack es nulo o no existe.");
                                }
                                
                            }else{
                                alert("Error semantico, la posicion que quiere acceder al stack es nulo o no existe,ETIQUETA");
                            }
                        }else if(t_nodo.exp1.tipo=="ETIQUETA"){
                            var temp_indice=obtenerIndice(t_nodo,entorno3d);
                            if(temp_indice!=null){
                                var temp_eti=t_nodo.exp1.getValue(entorno3d);
                                var temp_sim=entorno3d.obtener(temp_eti);
                                if(temp_sim.valor!=null){
                                    stack[temp_indice]=temp_sim.valor;
                                }else{
                                    alert("Error semantico, el valor a asignar no existe o es nulo,ETIQUETA");
                                }
                            }else{
                                alert("Error semantico, la posicion que quiere acceder al stack es nulo o no existe,ETIQUETA");
                            }
                        }else if(t_nodo.exp1.tipo=="NUMERO"){
                            var temp_indice=obtenerIndice(t_nodo,entorno3d);
                            if(temp_indice!=null){
                                var temp_valor=t_nodo.exp1.getValue(entorno3d);
                                if(temp_valor!=null){
                                    stack[temp_indice]=temp_valor;
                                }else{
                                    alert("Error semantico, el valor a asignar no existe o es nulo, NUMERO");
                                }
                            }else{
                                alert("Error semantico, la posicion que quiere acceder al stack es nulo o no existe,NUMERO");
                            }
                        }else if(t_nodo.exp1.tipo=="EXPRESION"){
                            console.log("etiqueta expresion");
                        }else{
                            alert("Error semantico, operacion incorrecta para stack");
                        }
                    }else if(sim.tipo=="HEAP"){
                        if(t_nodo.exp1.tipo=="H"){
                            var temp_indice=obtenerIndice(t_nodo,entorno3d);
                            if(temp_indice!=null){
                                heap[temp_indice]=ptr_h;
                            }else{
                                alert("Error semantico, la posicion que quiere acceder al heap es nulo o no existe.");
                            }
                        }else if(t_nodo.exp1.tipo=="P"){
                            var temp_indice=obtenerIndice(t_nodo,entorno3d);
                            if(temp_indice!=null){
                                heap[temp_indice]=ptr_p;
                            }else{
                                alert("Error semantico, la posicion que quiere acceder al heap es nulo o no existe.");
                            }
                        }else if(t_nodo.exp1.tipo=="STACK"){
                            var temp_indice=obtenerIndice(t_nodo,entorno3d);
                            if(temp_indice!=null){
                                var temp_indice2=obtenerIndice(t_nodo.exp1,entorno3d);
                                if(temp_indice2!=null){
                                    heap[temp_indice]=stack[temp_indice2];
                                }else{
                                    alert("Error semantico, la posicion que quiere acceder al stack es nulo o no existe.");
                                }
                            }else{
                                alert("Error semantico, la posicion que quiere acceder al stack es nulo o no existe,ETIQUETA");
                            }
                        }else if(t_nodo.exp1.tipo=="HEAP"){
                            var temp_indice=obtenerIndice(t_nodo,entorno3d);
                            if(temp_indice!=null){
                                var temp_indice2=obtenerIndice(t_nodo.exp1,entorno3d);
                                if(temp_indice2!=null){
                                    heap[temp_indice]=heap[temp_indice2];
                                }else{
                                    alert("Error semantico, la posicion que quiere acceder al stack es nulo o no existe.");
                                }
                            }else{
                                alert("Error semantico, la posicion que quiere acceder al stack es nulo o no existe,ETIQUETA");
                            }
                        }else if(t_nodo.exp1.tipo=="ETIQUETA"){
                            var temp_indice=obtenerIndice(t_nodo,entorno3d);
                            if(temp_indice!=null){
                                var temp_eti=t_nodo.exp1.getValue(entorno3d);
                                var temp_sim=entorno3d.obtener(temp_eti);
                                if(temp_sim.valor!=null){
                                    heap[temp_indice]=temp_sim.valor;
                                }else{
                                    alert("Error semantico, el valor a asignar no existe o es nulo");
                                }
                            }else{
                                alert("Error semantico, la posicion que quiere acceder al heap es nulo o no existe.");
                            }
                        }else if(t_nodo.exp1.tipo=="NUMERO"){
                            var temp_indice=obtenerIndice(t_nodo,entorno3d);
                            if(temp_indice!=null){
                                var temp_valor=t_nodo.exp1.getValue(entorno3d);
                                if(temp_valor!=null){
                                    heap[temp_indice]=temp_valor;
                                }else{
                                    alert("Error semantico, el valor a asignar no existe o es nulo");
                                }
                            }else{
                                alert("Error semantico, la posicion que quiere acceder al heap es nulo o no existe.");
                            }
                        }else if(t_nodo.exp1.tipo=="EXPRESION"){
                            console.log("etiqueta expresion");
                        }else{
                            alert("Error semantico, operacion incorrecta para heap");
                        }
                    }
                    
                }else{
                    alert("El valor "+t_nodo.id+", No existe en la tabla de simbolos3D");
                }
            }else if(t_nodo instanceof Imprimir3D){

                var sim=entorno3d.obtener(t_nodo.exp1);
                if(sim!=null){
                    if(t_nodo.tipo=="\"%c\""){
                        if(sim.valor!=null){
                            var res = String.fromCharCode(sim.valor);
                            escribirConsola(res);
                        }else{
                            alert("Error Semantico, La etiqueta tiene un valor nulo");
                        }
                        
                    }else if(t_nodo.tipo=="\"%d\""){
                        var res = sim.valor;
                        escribirConsola(res);
                    }else if(t_nodo.tipo=="\"%e\""){
                        var res = sim.valor;
                        escribirConsola(res);
                    }   
                }else{
                    alert("Error semantico la etiqueta "+t_nodo.exp1+" no existe.");
                }
            }else{
                //console.log("Es otro nodo");
                //console.log(f);
            }
        }


    }else{
        alert("No existe el metodo main para empezar la ejecucion");
    }

}

function obtenerIndice(t_nodo,entorno3d){
    var temp_indice;
    if(t_nodo.acceso.tipo=="H"){
        temp_indice=ptr_h;
    }else if(t_nodo.acceso.tipo=="P"){
        temp_indice=ptr_p;
    }else if(t_nodo.acceso.tipo=="ETIQUETA"){
        var temp_eti=t_nodo.acceso.getValue(entorno3d);
        var temp_sim=entorno3d.obtener(temp_eti);
        temp_indice=temp_sim.valor;
    }else if(t_nodo.acceso.tipo=="NUMERO"){
        var temp_val=t_nodo.acceso.getValue(entorno3d);
        temp_indice=temp_val;
    }
    return temp_indice;
}

//realizar la tabla de simbolos
//los simbolos
