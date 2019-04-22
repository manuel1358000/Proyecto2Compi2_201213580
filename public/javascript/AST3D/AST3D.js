

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
                                console.log("Error semantico, la posicion que quiere acceder al stack es nulo o no existe,STACK");
                            }
                        }else if(t_nodo.exp1.tipo=="HEAP"){
                            var temp_indice=obtenerIndice(t_nodo.exp1,entorno3d);
                            if(temp_indice!=null){
                                sim.valor=heap[temp_indice];
                            }else{
                                console.log("Error semantico, la posicion que quiere acceder al stack es nulo o no existe,HEAP");
                            }
                        }else if(t_nodo.exp1.tipo=="ETIQUETA"){
                            var temp_eti=t_nodo.exp1.getValue(entorno3d);
                            var temp_sim=entorno3d.obtener(temp_eti);
                            if(temp_sim.valor!=null){
                                sim.valor=temp_sim.valor;
                            }else{
                                console.log("1Error semantico, el valor a asignar no existe o es nulo, ETIQUETA: "+t_nodo.exp1.getValue(entorno3d));
                            }
                        }else if(t_nodo.exp1.tipo=="NUMERO"){
                            var temp_valor=t_nodo.exp1.getValue(entorno3d);
                            if(temp_valor!=null){
                                sim.valor=temp_valor;
                            }else{
                                console.log("Error semantico, el valor a asignar no existe o es nulo,NUMERO");
                            }
                        }else if(t_nodo.exp1.tipo=="EXPRESION"){
                            var temp_valor=t_nodo.exp1.getValue(entorno3d);
                            if(temp_valor!=null){
                                var temp_exp=t_nodo.exp1.getValue(entorno3d);
                                if(temp_exp!=null){
                                    sim.valor=temp_exp;
                                }else{
                                    console.log("Error Semantico, No se puede realizar la operacion,ETIQUETA->EXPRESION");
                                }
                            }else{
                                
                                console.log("Error semantico, el valor a asignar no existe o es nulo");
                            }
                        }else{
                            console.log("Error semantico, operacion incorrecta para etiqueta,tipo:"+t_nodo.exp1.tipo);
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
                                console.log("Error semantico, la posicion que quiere acceder al stack es nulo o no existe,STACK");
                            }
                        }else if(t_nodo.exp1.tipo=="HEAP"){
                            var temp_indice=obtenerIndice(t_nodo.exp1,entorno3d);
                            if(temp_indice!=null){
                                ptr_h=heap[temp_indice];
                            }else{
                                console.log("Error semantico, la posicion que quiere acceder al stack es nulo o no existe,HEAP");
                            }
                        }else if(t_nodo.exp1.tipo=="ETIQUETA"){
                            var temp_eti=t_nodo.exp1.getValue(entorno3d);
                            var temp_sim=entorno3d.obtener(temp_eti);
                            if(temp_sim.valor!=null){
                                ptr_h=temp_sim.valor;
                            }else{
                                console.log("2Error semantico, el valor a asignar no existe o es nulo, ETIQUETA: "+t_nodo.exp1.getValue(entorno3d));
                            }
                        }else if(t_nodo.exp1.tipo=="NUMERO"){
                            var temp_valor=t_nodo.exp1.getValue(entorno3d);
                            if(temp_valor!=null){
                                ptr_h=temp_valor;
                            }else{
                                console.log("Error semantico, el valor a asignar no existe o es nulo,NUMERO");
                            }
                        }else if(t_nodo.exp1.tipo=="EXPRESION"){
                            var temp_valor=t_nodo.exp1.getValue(entorno3d);
                            if(temp_valor!=null){
                                ptr_h=temp_valor;
                            }else{
                                console.log("aqui "+tmep_valor);
                                console.log("Error Semantico, No se puede realizar la operacion,H->EXPRESION");
                            }
                        }else{
                            console.log("Error semantico, operacion incorrecta para h");
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
                                console.log("Error semantico, la posicion que quiere acceder al stack es nulo o no existe,STACK");
                            }
                        }else if(t_nodo.exp1.tipo=="HEAP"){
                            var temp_indice=obtenerIndice(t_nodo.exp1,entorno3d);
                            if(temp_indice!=null){
                                ptr_p=heap[temp_indice];
                            }else{
                                console.log("Error semantico, la posicion que quiere acceder al stack es nulo o no existe,HEAP");
                            }
                        }else if(t_nodo.exp1.tipo=="ETIQUETA"){
                            var temp_eti=t_nodo.exp1.getValue(entorno3d);
                            var temp_sim=entorno3d.obtener(temp_eti);
                            if(temp_sim.valor!=null){
                                ptr_p=temp_sim.valor;
                            }else{
                                console.log("3Error semantico, el valor a asignar no existe o es nulo, ETIQUETA: "+t_nodo.exp1.getValue(entorno3d));
                            }
                        }else if(t_nodo.exp1.tipo=="NUMERO"){
                            var temp_valor=t_nodo.exp1.getValue(entorno3d);
                            if(temp_valor!=null){
                                ptr_p=temp_valor;
                            }else{
                                console.log("Error semantico, el valor a asignar no existe o es nulo,NUMERO");
                            }
                        }else if(t_nodo.exp1.tipo=="EXPRESION"){
                            var temp_valor=t_nodo.exp1.getValue(entorno3d);
                            if(temp_valor!=null){
                                ptr_p=temp_valor;
                            }else{
                                console.log("Error Semantico, No se puede realizar la operacion,P->EXPRESION");
                            }
                        }else{
                            console.log("Error semantico, operacion incorrecta para p");
                        }
                    }else if(sim.tipo=="STACK"){
                        if(t_nodo.exp1.tipo=="H"){
                            var temp_indice=obtenerIndice(t_nodo,entorno3d);
                            if(temp_indice!=null){
                                stack[temp_indice]=ptr_h;
                            }else{
                                console.log("Error semantico, la posicion que quiere acceder al stack es nulo o no existe, H");
                            }
                        }else if(t_nodo.exp1.tipo=="P"){
                            var temp_indice=obtenerIndice(t_nodo,entorno3d);
                            if(temp_indice!=null){
                                stack[temp_indice]=ptr_p;
                            }else{
                                console.log("Error semantico, la posicion que quiere acceder al stack es nulo o no existe, P");
                            }
                        }else if(t_nodo.exp1.tipo=="STACK"){
                            var temp_indice=obtenerIndice(t_nodo,entorno3d);
                            if(temp_indice!=null){
                                var temp_indice2=obtenerIndice(t_nodo.exp1,entorno3d);
                                if(temp_indice2!=null){
                                    stack[temp_indice]=stack[temp_indice2];
                                }else{
                                    console.log("Error semantico, la posicion que quiere acceder al stack es nulo o no existe,STACK");
                                }
                            }else{
                                console.log("Error semantico, la posicion que quiere acceder al stack es nulo o no existe,STACK");
                            }
                        }else if(t_nodo.exp1.tipo=="HEAP"){
                            var temp_indice=obtenerIndice(t_nodo,entorno3d);
                            if(temp_indice!=null){
                                var temp_indice2=obtenerIndice(t_nodo.exp1,entorno3d);
                                if(temp_indice2!=null){
                                    stack[temp_indice]=heap[temp_indice2];
                                }else{
                                    console.log("Error semantico, la posicion que quiere acceder al stack es nulo o no existe,HEAP");
                                }
                                
                            }else{
                                console.log("Error semantico, la posicion que quiere acceder al stack es nulo o no existe,HEAP");
                            }
                        }else if(t_nodo.exp1.tipo=="ETIQUETA"){
                            var temp_indice=obtenerIndice(t_nodo,entorno3d);
                            if(temp_indice!=null){
                                var temp_eti=t_nodo.exp1.getValue(entorno3d);
                                var temp_sim=entorno3d.obtener(temp_eti);
                                if(temp_sim.valor!=null){
                                    stack[temp_indice]=temp_sim.valor;
                                }else{
                                    console.log("4Error semantico, el valor a asignar no existe o es nulo, ETIQUETA: "+t_nodo.exp1.getValue(entorno3d));
                                }
                            }else{
                                console.log("5Error semantico, el valor a asignar no existe o es nulo, ETIQUETA: "+t_nodo.exp1.getValue(entorno3d));
                            }
                        }else if(t_nodo.exp1.tipo=="NUMERO"){
                            var temp_indice=obtenerIndice(t_nodo,entorno3d);
                            if(temp_indice!=null){
                                var temp_valor=t_nodo.exp1.getValue(entorno3d);
                                if(temp_valor!=null){
                                    stack[temp_indice]=temp_valor;
                                }else{
                                    console.log("Error semantico, el valor a asignar no existe o es nulo, NUMERO");
                                }
                            }else{
                                console.log("Error semantico, la posicion que quiere acceder al stack es nulo o no existe,NUMERO");
                            }
                        }else if(t_nodo.exp1.tipo=="EXPRESION"){
                            var temp_indice=obtenerIndice(t_nodo,entorno3d);
                            if(temp_indice!=null){
                                var temp_valor=t_nodo.exp1.getValue(entorno3d);
                                if(temp_valor!=null){
                                    stack[temp_indice]=temp_valor;
                                }else{
                                    console.log("Error Semantico, No se puede realizar la operacion,STACK->EXPRESION");
                                }
                            }else{
                                console.log("Error semantico, la posicion que quiere acceder al stack es nulo o no existe, EXPRESION");
                            }
                        }else{
                            console.log("Error semantico, operacion incorrecta para stack");
                        }
                    }else if(sim.tipo=="HEAP"){
                        if(t_nodo.exp1.tipo=="H"){
                            var temp_indice=obtenerIndice(t_nodo,entorno3d);
                            if(temp_indice!=null){
                                heap[temp_indice]=ptr_h;
                            }else{
                                console.log("Error semantico, la posicion que quiere acceder al heap es nulo o no existe,H");
                            }
                        }else if(t_nodo.exp1.tipo=="P"){
                            var temp_indice=obtenerIndice(t_nodo,entorno3d);
                            if(temp_indice!=null){
                                heap[temp_indice]=ptr_p;
                            }else{
                                console.log("Error semantico, la posicion que quiere acceder al heap es nulo o no existe,P");
                            }
                        }else if(t_nodo.exp1.tipo=="STACK"){
                            var temp_indice=obtenerIndice(t_nodo,entorno3d);
                            if(temp_indice!=null){
                                var temp_indice2=obtenerIndice(t_nodo.exp1,entorno3d);
                                if(temp_indice2!=null){
                                    heap[temp_indice]=stack[temp_indice2];
                                }else{
                                    console.log("Error semantico, la posicion que quiere acceder al stack es nulo o no existe, STACK");
                                }
                            }else{
                                console.log("Error semantico, la posicion que quiere acceder al stack es nulo o no existe, STACK");
                            }
                        }else if(t_nodo.exp1.tipo=="HEAP"){
                            var temp_indice=obtenerIndice(t_nodo,entorno3d);
                            if(temp_indice!=null){
                                var temp_indice2=obtenerIndice(t_nodo.exp1,entorno3d);
                                if(temp_indice2!=null){
                                    heap[temp_indice]=heap[temp_indice2];
                                }else{
                                    console.log("Error semantico, la posicion que quiere acceder al stack es nulo o no existe,HEAP");
                                }
                            }else{
                                console.log("Error semantico, la posicion que quiere acceder al stack es nulo o no existe,HEAP");
                            }
                        }else if(t_nodo.exp1.tipo=="ETIQUETA"){
                            var temp_indice=obtenerIndice(t_nodo,entorno3d);
                            if(temp_indice!=null){
                                var temp_eti=t_nodo.exp1.getValue(entorno3d);
                                var temp_sim=entorno3d.obtener(temp_eti);
                                if(temp_sim.valor!=null){
                                    heap[temp_indice]=temp_sim.valor;
                                }else{
                                    console.log("6Error semantico, el valor a asignar no existe o es nulo, ETIQUETA: "+t_nodo.exp1.getValue(entorno3d));
                                }
                            }else{
                                console.log("7Error semantico, el valor a asignar no existe o es nulo, ETIQUETA: "+t_nodo.exp1.getValue(entorno3d));
                            }
                        }else if(t_nodo.exp1.tipo=="NUMERO"){
                            var temp_indice=obtenerIndice(t_nodo,entorno3d);
                            if(temp_indice!=null){
                                var temp_valor=t_nodo.exp1.getValue(entorno3d);
                                if(temp_valor!=null){
                                    heap[temp_indice]=temp_valor;
                                }else{
                                    console.log("Error semantico, el valor a asignar no existe o es nulo,NUMERO");
                                }
                            }else{
                                console.log("Error semantico, la posicion que quiere acceder al heap es nulo o no existe,NUMERO");
                            }
                        }else if(t_nodo.exp1.tipo=="EXPRESION"){
                            var temp_indice=obtenerIndice(t_nodo,entorno3d);
                            if(temp_indice!=null){
                                var temp_valor=t_nodo.exp1.getValue(entorno3d);
                                if(temp_valor!=null){
                                    heap[temp_indice]=temp_valor;
                                }else{
                                    console.log(temp_valor+"Verificar aqui");
                                    console.log("Error Semantico, No se puede realizar la operacion,HEAP->EXPRESION");
                                }
                            }else{
                                console.log("Error semantico, la posicion que quiere acceder al heap es nulo o no existe,EXPRESION");
                            }
                        }else{
                            console.log("Error semantico, operacion incorrecta para heap");
                        }
                    }
                }else{
                    console.log("El valor "+t_nodo.id+", No existe en la tabla de simbolos3D");
                }
            }else if(t_nodo instanceof Imprimir3D){
                var sim=entorno3d.obtener(t_nodo.exp1);
                if(sim!=null){
                    if(t_nodo.tipo=="\"%c\""){
                        if(sim.valor!=null){
                            var res = String.fromCharCode(sim.valor);
                            escribirConsola(res);
                        }else{
                            console.log("Error Semantico, La etiqueta tiene un valor nulo");
                        }
                        
                    }else if(t_nodo.tipo=="\"%d\""){
                        var res = sim.valor;
                        console.log(res);
                        escribirConsola(res);
                    }else if(t_nodo.tipo=="\"%e\""){
                        var res = sim.valor;
                        escribirConsola(res);
                    }   
                }else{
                    console.log("Error semantico la etiqueta "+t_nodo.exp1+" no existe.");
                }
            }else if(t_nodo instanceof Goto3D){
                var temp_sim=entorno3d.obtener(t_nodo.id);
                if(temp_sim!=null){
                    f=temp_sim.indice;
                }else{
                    console.log("Error Semantico, la etiqueta "+t_nodo.id+" No existe,goto");
                }
            }else if(t_nodo instanceof If3D){
                //tenemos que evaluar la operacion y si es verdadera vamos a mandar a llamar a la etiqueta que tenga,
                //si es falsa no se realiza nada
                var temp_condicion=t_nodo.condicion.getValue(entorno3d);
                if(temp_condicion==true){
                    var temp_sim=entorno3d.obtener(t_nodo.salto);
                    if(temp_sim!=null){
                        f=temp_sim.indice;
                    }else{
                        console.log("Error Semantico, la etiqueta "+t_nodo.salto+" No existe,if");
                    }
                }//si no cumple con la condicion no pasa nada y sigue con la ejecucion de las instrucciones
            }else if(t_nodo instanceof Iffalse3D){
                //tenemos que evaluar la operacion y si es falsa vamos a mandar a llamar a la etiqueta que tenga.
                //si es verdadera no se realiza nada
                var temp_condicion=t_nodo.condicion.getValue(entorno3d);
                if(temp_condicion==true){
                    var temp_sim=entorno3d.obtener(t_nodo.salto);
                    if(temp_sim!=null){
                        f=temp_sim.indice;
                    }else{
                        console.log("Error Semantico, la etiqueta "+t_nodo.salto+" No existe, iffalse");
                    }
                }//si cumple con la condicion no pasa nada y sigue con la ejecucion de las instrucciones
            }else if(t_nodo instanceof Llamada_Metodo3D){
                pila.push((f));
                var temp_sim=entorno3d.obtener(t_nodo.id);
                if(temp_sim!=null){
                    f=temp_sim.indice;
                }else{
                    console.log("Error Semantico, No existe el metodo "+t_nodo.id+", Llamada Metodo");
                }
            }else if(t_nodo instanceof Salto3D){
                //aqui no realiza ninguna accion, ya que se consulta la informacion en la tabla de simbolos
            }else if(t_nodo instanceof Metodo3D){
                //aqui vamos a analizar cuando llegue al nodo final
                if(t_nodo.tipo=="FIN"){
                    if(pila.length>0){
                        var temp_indice=pila.pop();
                        f=temp_indice;
                    }else{
                        f=nodo.length+10;
                    }
                }
            }else{
                console.log("Error semantico, es alguna instancia no permitida");
            }
        }
    }else{
        console.log("No existe el metodo main para empezar la ejecucion");
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