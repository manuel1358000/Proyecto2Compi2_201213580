class Imprimir{
    constructor(expresion,salto){
        this.expresion=expresion;
        this.salto=salto;
        this.ambitos="";
        this.tam=0;
    }

    execute(entorno){
        var result=new Result();
        this.expresion.ambitos=this.ambitos;
        var result_aux=this.expresion.getValue(entorno);
        result_aux.tipo=this.expresion.getTipe(entorno);
        result.tipo=result_aux.tipo;
        result.cadena+=result_aux.cadena;
        if(result.tipo=="ID"){
            alert(this.expresion.valor+"_"+this.ambitos);
            var temp_sim=entorno.obtener(this.expresion.valor+"_"+this.ambitos);
        }
        if(result.tipo=="STRING"){
            var armar="";
            armar+="//----------------------inicia impresion numero\n";
            armar+="p=p+"+this.tam+";\n";
            armar+="p=p+2;//cambio de ambito real\n";
            var direc_para1=generarEtiqueta();
            armar+=direc_para1+"=p+1;//posicion del parametro\n";
            armar+="stack["+direc_para1+"]="+result_aux.u_etiqueta+";//se le asigna el puntero h que tiene que imprimir\n";
            if(this.salto){
                armar+="call impresion_cadenas2;\n";
            }else{
                armar+="call impresion_cadenas;\n";
            }
            armar+="p=p-2;//se regresa al ambito actual\n";
            armar+="p=p-"+this.tam+";\n"; 
            armar+="//----------------------finaliza impresion numero\n";
            result.cadena+=armar;
        }else if(result.tipo=="INTEGER"){
            var armar="//--------------------inicia casteo entero a cadena\n";
            var puntero_simulado=generarEtiqueta();
            //se le setea el valor en el stack para cuando realize la llamada a la metodo
            armar+=puntero_simulado+"=p+"+this.tam+";\n";
            armar+=puntero_simulado+"="+puntero_simulado+"+2;//se simula el cambio de ambito para pasar el parametro\n";
            armar+=puntero_simulado+"="+puntero_simulado+"+1;//tam del parametro\n";
            armar+="stack["+puntero_simulado+"]="+result_aux.u_etiqueta+";\n";
            armar+="p=p+"+this.tam+";\n";
            armar+="p=p+2;//cambio de ambito real\n";
            //se manda a llamar al metodo que convierte el entero en cadena
            armar+="call enteroString;\n";
            //finaliza y se manda a traer el resultado en la posicion 0 del stack
            var temp=generarEtiqueta();
            armar+=temp+"=p+0;\n";
            var temp2=generarEtiqueta();
            armar+=temp2+"=stack["+temp+"];//en esta posicion se encuentra el puntero h del numero que se convirtio\n";
            armar+="p=p-2;//se regresa al ambito actual, se mueven dos posiciones por el this y el return\n";
            armar+="p=p-"+this.tam+";\n";
            armar+="//-------------------------finaliza casteo entero a cadena\n";
            armar+="//-------------------------inicia impresion numero\n";
            armar+="p=p+"+this.tam+";\n";
            armar+="p=p+2;//cambio de ambito real\n";
            var direc_para1=generarEtiqueta();
            armar+=direc_para1+"=p+1;//posicion del parametro\n";
            armar+="stack["+direc_para1+"]="+temp2+";//se le asigna el puntero h que tiene que imprimir\n";
            if(this.salto){
                armar+="call impresion_cadenas2;\n";
            }else{
                armar+="call impresion_cadenas;\n";
            }
            armar+="p=p-2;//se regresa al ambito actual\n";
            armar+="p=p-"+this.tam+";\n";
            armar+="//-------------------------finaliza impresion numero\n";
            result.cadena+=armar;
        }else if(result.tipo=="DOUBLE"){
            var armar="//inicia el casteo de double a cadena\n";
            var puntero_simulado=generarEtiqueta();
            //se le setea el valor en el stack para cuando realize la llamada a la metodo
            armar+=puntero_simulado+"=p+2;//se simula el cambio de ambito para pasar el parametro\n";
            armar+=puntero_simulado+"="+puntero_simulado+"+1;//tam del parametro\n";
            armar+="stack["+puntero_simulado+"]="+result_aux.u_etiqueta+";\n";
            armar+="p=p+2;//cambio de ambito real\n";
            //se manda a llamar al metodo que convierte el entero en cadena
            armar+="call doubleString;\n";
            //finaliza y se manda a traer el resultado en la posicion 0 del stack
            var temp=generarEtiqueta();
            armar+=temp+"=p+0;\n";
            var temp2=generarEtiqueta();
            armar+=temp2+"=stack["+temp+"];//en esta posicion se encuentra el puntero h del numero que se convirtio\n";
            armar+="p=p-2;//se regresa al ambito actual, se mueven dos posiciones por el this y el return\n";
            armar+="//-------------------------finaliza casteo double a cadena\n";
            armar+="//-------------------------inicia impresion double\n";
            armar+="p=p+2;//cambio de ambito real\n";
            var direc_para1=generarEtiqueta();
            armar+=direc_para1+"=p+1;//posicion del parametro\n";
            armar+="stack["+direc_para1+"]="+temp2+";//se le asigna el puntero h que tiene que imprimir\n";
            if(this.salto){
                armar+="call impresion_cadenas2;\n";
            }else{
                armar+="call impresion_cadenas;\n";
            }
            armar+="p=p-2;//se regresa al ambito actual\n";
            armar+="//-------------------------finaliza impresion double\n";
            result.cadena+=armar;
        }else if(result.tipo=="CHAR"){
            var armar="";
            var temp_result=generarString(result_aux.u_etiqueta,true,"CHAR");            
            armar+=temp_result.cadena;
            armar+="//-------------------------inicia impresion char\n";
            armar+="p=p+2;//cambio de ambito real\n";
            var direc_para1=generarEtiqueta();
            armar+=direc_para1+"=p+1;//posicion del parametro\n";
            armar+="stack["+direc_para1+"]="+temp_result.u_etiqueta+";//se le asigna el puntero h que tiene que imprimir\n";
            if(this.salto){
                armar+="call impresion_cadenas2;\n";
            }else{
                armar+="call impresion_cadenas;\n";
            }
            armar+="p=p-2;//se regresa al ambito actual\n";
            armar+="//-------------------------finaliza impresion char\n";
            result.cadena+=armar;
        }else if(result.tipo=="BOOLEAN"){
            var armar="";
            var temp_result=generarString(result_aux.u_etiqueta,true,"BOOLEAN");
            armar+=temp_result.cadena;
            armar+="//-------------------------inicia impresion boolean\n";
            armar+="p=p+2;//cambio de ambito real\n";
            var direc_para1=generarEtiqueta();
            armar+=direc_para1+"=p+1;//posicion del parametro\n";
            armar+="stack["+direc_para1+"]="+temp_result.u_etiqueta+";//se le asigna el puntero h que tiene que imprimir\n";
            if(this.salto){
                armar+="call impresion_cadenas2;\n";
            }else{
                armar+="call impresion_cadenas;\n";
            }
            armar+="p=p-2;//se regresa al ambito actual\n";
            armar+="//-------------------------finaliza impresion boolean\n";
            result.cadena+=armar;
        }else{
            alert("Error semantico, no esta inicializada la variable que se debe de imprimir o es un objeto");
        }
        return result;
    }
}


function enteroString(){
    var temp="proc enteroString begin\n";
    var t0=generarEtiqueta();
    temp+=t0+"=p+1;\n";
    var t1=generarEtiqueta();
    temp+=t1+"=stack["+t0+"];\n";
    var t2=generarEtiqueta();
    temp+=t2+"="+t1+";\n";
    var L1=generarSalto();
    var L2=generarSalto();
    temp+="if("+t1+"<0) goto "+L1+";\n";
    temp+="goto "+L2+";\n";
    temp+=L1+":\n";
    var t3=generarEtiqueta();
    temp+=t3+"=-1;\n";
    temp+=t1+"="+t1+"*"+t3+";\n";
    temp+=L2+":\n";
    var t4=generarEtiqueta();
    temp+=t4+"="+t1+"%10;\n";
    var t5=generarEtiqueta();
    temp+=t5+"=p+1;\n";
    var t6=generarEtiqueta();
    temp+=t6+"="+t5+";\n";
    temp+=t4+"="+t4+"+48;\n";
    temp+="stack["+t6+"]="+t4+";\n";
    temp+=t6+"="+t6+"+1;\n";
    var L3=generarSalto();
    temp+=L3+":\n";
    temp+=t1+"="+t1+"/10;\n";
    var t7=generarEtiqueta();
    temp+=t7+"="+t1+"%10;\n";
    var L4=generarSalto();
    var L5=generarSalto();
    temp+="if("+t1+"<1) goto "+L4+";\n";
    temp+="goto "+L5+";\n";
    temp+=L4+":\n";
    var L6=generarSalto();
    temp+="if("+t7+"<1) goto "+L6+";\n";
    temp+="goto "+L5+";\n";
    temp+=L5+":\n";
    temp+=t7+"="+t7+"+48;\n";
    temp+="stack["+t6+"]="+t7+";\n";
    temp+=t6+"="+t6+"+1;\n";
    temp+="goto "+L3+";\n";
    temp+=L6+":\n";
    temp+=t6+"="+t6+"-1;\n";
    var t8=generarEtiqueta();
    temp+=t8+"=h;\n";  
    var L7=generarSalto();
    var L8=generarSalto();
    temp+="if("+t2+"<0) goto "+L7+";\n";
    temp+="goto "+L8+";\n";
    temp+=L7+":\n";
    temp+="heap[h]=45;\n";
    temp+="h=h+1;\n";
    temp+=L8+":\n";
    temp+="heap[h]=stack["+t6+"];\n";
    temp+=t6+"="+t6+"-1;\n";
    temp+="h=h+1;\n";
    var L9=generarSalto();
    temp+="if("+t6+"<"+t5+") goto "+L9+";\n";
    temp+="goto "+L8+";\n";
    temp+=L9+":\n";
    temp+="heap[h]=0;\n";
    temp+="h=h+1;\n";
    var t9=generarEtiqueta();
    temp+=t9+"=p+0;\n";
    temp+="stack["+t9+"]="+t8+";\n";
    temp+="end\n";
    return temp;
}   






function generaImpresion(){
    var temp="proc impresion_cadenas begin\n";
    var etip=generarSalto();
    var puntero_h=generarEtiqueta();
    var etiv=generarSalto();//finaliza la impresion de la cadena
    var etif=generarSalto();
    var eti_contenido=generarEtiqueta();
    temp+=puntero_h+"=p+1;//se tiene la posicion del puntero h de la cadena\n";
    temp+=puntero_h+"=stack["+puntero_h+"];\n";
    temp+=etip+"://etiqueta del ciclo\n";
    temp+=eti_contenido+"=heap["+puntero_h+"];\n//accedo a la posicion del caracter que forma la letra\n";;
    temp+="if("+eti_contenido+"==0) goto "+etiv+";\n";
    temp+="goto "+etif+";\n";
    temp+=etif+":\n";
    temp+="print(\"%c\","+eti_contenido+");\n";
    temp+=puntero_h+"="+puntero_h+"+1;\n";
    temp+="goto "+etip+";\n";
    temp+=etiv+":\n//finaliza la impresion\n"
    temp+="end\n";
    return temp;
}
function generaImpresion2(){
    var temp="proc impresion_cadenas2 begin\n";
    var etip=generarSalto();
    var puntero_h=generarEtiqueta();
    var etiv=generarSalto();//finaliza la impresion de la cadena
    var etif=generarSalto();
    var eti_contenido=generarEtiqueta();
    temp+=puntero_h+"=p+1;//se tiene la posicion del puntero h de la cadena\n";
    temp+=puntero_h+"=stack["+puntero_h+"];\n";
    temp+=etip+"://etiqueta del ciclo\n";
    temp+=eti_contenido+"=heap["+puntero_h+"];\n//accedo a la posicion del caracter que forma la letra\n";;
    temp+="if("+eti_contenido+"==0) goto "+etiv+";\n";
    temp+="goto "+etif+";\n";
    temp+=etif+":\n";
    temp+="print(\"%c\","+eti_contenido+");\n";
    temp+=puntero_h+"="+puntero_h+"+1;\n";
    temp+="goto "+etip+";\n";
    temp+=etiv+":\n//finaliza la impresion\n"
    var salto_linea=generarEtiqueta();
    temp+=salto_linea+"=10;\n";
    temp+="print(\"%c\","+salto_linea+");\n";
    temp+="end\n";
    return temp;
}



function doubleString(){
    var temp="proc doubleString begin\n";
    var t0=generarEtiqueta();
    temp+=t0+"=p+1;\n";
    var t1=generarEtiqueta();
    temp+=t1+"=stack["+t0+"];\n";
    var t2=generarEtiqueta();//esta etiqueta tiene el valor original
    temp+=t2+"="+t1+";\n";//aqui se le esta asignando el valor original
    var temp_1=generarEtiqueta();
    temp+=temp_1+"=p+2;//simulacion de cambio de ambito\n";
    temp+=temp_1+"="+temp_1+"+1;//se suma la posicion del parametro\n";
    temp+="stack["+temp_1+"]="+t2+";\n";
    temp+="p=p+2;//se hace el cambio de ambito real\n";
    temp+="call obtenerInt;\n";
    var temp_2=generarEtiqueta();
    temp+=temp_2+"=p+0;\n";//posicion del retorno
    temp+=t1+"=stack["+temp_2+"];//aqui esta guardado el valor entero del decimal\n";//aqui esta almacenado el valor entero del numero decimal
    var entero=generarEtiqueta();
    temp+=entero+"="+t1+";\n";
    temp+="p=p-2;\n";
    var L1=generarSalto();
    var L2=generarSalto();
    temp+="if("+t1+"<0) goto "+L1+";\n";
    temp+="goto "+L2+";\n";
    temp+=L1+":\n";
    var t3=generarEtiqueta();
    temp+=t3+"=-1;\n";
    temp+=t1+"="+t1+"*"+t3+";\n";
    //desde aqui
    temp+=L2+":\n";
    var t4=generarEtiqueta();
    temp+=t4+"="+t1+"%10;\n";
    var t5=generarEtiqueta();
    temp+=t5+"=p+1;\n";
    var t6=generarEtiqueta();
    temp+=t6+"="+t5+";\n";
    temp+=t4+"="+t4+"+48;\n";
    temp+="stack["+t6+"]="+t4+";\n";
    temp+=t6+"="+t6+"+1;\n";
    var L3=generarSalto();
    temp+=L3+":\n";
    temp+=t1+"="+t1+"/10;\n";
    var t7=generarEtiqueta();
    temp+=t7+"="+t1+"%10;\n";
    var L4=generarSalto();
    var L5=generarSalto();
    temp+="if("+t1+"<1) goto "+L4+";\n";
    temp+="goto "+L5+";\n";
    temp+=L4+":\n";
    var L6=generarSalto();
    temp+="if("+t7+"<1) goto "+L6+";\n";
    temp+="goto "+L5+";\n";
    temp+=L5+":\n";
    temp+=t7+"="+t7+"+48;\n";
    temp+="stack["+t6+"]="+t7+";\n";
    temp+=t6+"="+t6+"+1;\n";
    temp+="goto "+L3+";\n";
    temp+=L6+":\n";
    
    temp+=t6+"="+t6+"-1;\n";
    var t8=generarEtiqueta();
    temp+=t8+"=h;\n";  
    var L7=generarSalto();
    var L8=generarSalto();
    temp+="if("+t2+"<0) goto "+L7+";\n";
    temp+="goto "+L8+";\n";
    temp+=L7+":\n";
    temp+="heap[h]=45;\n";
    temp+="h=h+1;\n";
    temp+=L8+":\n";
    temp+="heap[h]=stack["+t6+"];\n";
    temp+=t6+"="+t6+"-1;\n";
    temp+="h=h+1;\n";
    var L9=generarSalto();
    temp+="if("+t6+"<"+t5+") goto "+L9+";\n";
    temp+="goto "+L8+";\n";
    temp+=L9+":\n";
    //aqui empezamos a verificar el valor del numero
    temp+="//aqui tenemos que obtener el valor entero del numero decimal\n";
    var decimal=generarEtiqueta();
    temp+=decimal+"="+t2+"-"+entero+";\n";
    var saltov=generarSalto();
    temp+="if("+decimal+"==0) goto "+saltov+";\n";
    temp+="heap[h]=46;\n";
    temp+="h=h+1;\n";
    temp+=decimal+"="+decimal+"*1000000;\n";
//aqui
    temp+="//empieza la conversion de la parte decimal\n";
    var L2=generarSalto();
    temp+=L2+":\n";
    var t4=generarEtiqueta();
    temp+=t4+"="+decimal+"%10;\n";
    var t5=generarEtiqueta();
    temp+=t5+"=p+1;\n";
    var t6=generarEtiqueta();
    temp+=t6+"="+t5+";\n";
    temp+=t4+"="+t4+"+48;\n";
    temp+="stack["+t6+"]="+t4+";\n";
    temp+=t6+"="+t6+"+1;\n";
    var L3=generarSalto();
    temp+=L3+":\n";
    temp+=decimal+"="+decimal+"/10;\n";
    var t7=generarEtiqueta();
    temp+=t7+"="+decimal+"%10;\n";
    var L4=generarSalto();
    var L5=generarSalto();
    temp+="if("+decimal+"<1) goto "+L4+";\n";
    temp+="goto "+L5+";\n";
    temp+=L4+":\n";
    var L6=generarSalto();
    temp+="if("+t7+"<1) goto "+L6+";\n";
    temp+="goto "+L5+";\n";
    temp+=L5+":\n";
    temp+=t7+"="+t7+"+48;\n";
    temp+="stack["+t6+"]="+t7+";\n";
    temp+=t6+"="+t6+"+1;\n";
    temp+="goto "+L3+";\n";
    temp+=L6+":\n";
    temp+=t6+"="+t6+"-1;\n";
    var tdecimal=generarEtiqueta();
    temp+=tdecimal+"=h;\n";  
    var L7=generarSalto();
    var L8=generarSalto();
    temp+="if("+t2+"<0) goto "+L7+";\n";
    temp+="goto "+L8+";\n";
    temp+=L7+":\n";
    temp+="heap[h]=45;\n";
    temp+="h=h+1;\n";
    temp+=L8+":\n";
    temp+="heap[h]=stack["+t6+"];\n";
    temp+=t6+"="+t6+"-1;\n";
    temp+="h=h+1;\n";
    var L9=generarSalto();
    temp+="if("+t6+"<"+t5+") goto "+L9+";\n";
    temp+="goto "+L8+";\n";
    temp+=L9+":\n";
//hasta aqui
    temp+="//finaliza la operacion del valor decimal\n";
    temp+=saltov+":\n";
    temp+="heap[h]=0;\n";
    temp+="h=h+1;\n";
    var t9=generarEtiqueta();
    var saltofin=generarSalto();
    temp+=t9+"=p+0;\n";
    temp+="stack["+t9+"]="+t8+";\n";
    temp+="goto "+saltofin+";\n";
    temp+=saltofin+":\n";
    temp+="end\n";
    return temp;
}
function obtenerInt(){
    var temp="proc obtenerInt begin\n";
    var temp1=generarEtiqueta();
    temp+=temp1+"=p+1;\n";
    var temp2=generarEtiqueta();
    temp+=temp2+"=stack["+temp1+"];\n";//temp2 tiene el valor del numero en decimal
    var temp3=generarEtiqueta();//este es el valor que se va a enviar como respuesta
    temp+=temp3+"=0;\n";
    var sal1=generarSalto();
    temp+=sal1+":\n";
    var salv=generarSalto();
    var salf=generarSalto();
    temp+="if("+temp3+">"+temp2+") goto "+salv+";\n";
    temp+=temp3+"="+temp3+"+1;\n";
    temp+="goto "+sal1+";\n";
    temp+=salv+":\n";
    temp+=temp3+"="+temp3+"-1;\n";
    var temp4=generarEtiqueta();
    temp+=temp4+"=p+0;\n";
    temp+="stack["+temp4+"]="+temp3+";\n";
    temp+="end\n";
    return temp;
}