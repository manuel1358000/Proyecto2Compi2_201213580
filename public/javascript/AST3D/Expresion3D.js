

class Expresion3D{
    //exp1,exp2,operador,unario,acceso,tipo
    constructor(exp1,exp2,operador,unario,acceso,tipo){
        this.exp1=exp1;
        this.exp2=exp2;
        this.operador=operador;
        this.unario=unario;
        this.acceso=acceso;
        this.tipo=tipo;
    }
    getValue(entorno3d){
        if(this.unario){
            //si es un unario, esto aplica para cuando se realizan las negativas
            if(this.operador=="-"){
                var temp_val1;
                if(this.tipo=="NUMERO"){
                    temp_val1=this.exp1;
                }else if(this.tipo=="ETIQUETA"){
                    temp_val1=entorno3d.obtener(this.exp1);
                }
                if(temp_val1!=null){
                    return parseFloat(temp_val1)*(-1);
                }
            }else if(this.operador=="!"){
                var temp_val1=obtenerValor(this.exp1,entorno3d);
                if(temp_val1!=null){
                    if(temp_val1==0){
                        return 1;
                    }else if(temp_val1==1){
                        return 0;
                    }
                }
            }else{
                console.log("Error Semantico: Operador unario invalido "+this.operador);
            }
        }else{
            //expresiones normales
            if(this.exp1!=null&&this.exp2!=null){
                if(this.operador=="+"){
                    var temp_val1=obtenerValor(this.exp1,entorno3d);
                    var temp_val2=obtenerValor(this.exp2,entorno3d);
                    if(temp_val1!=null&&temp_val2!=null){
                        return parseFloat(temp_val1)+parseFloat(temp_val2);
                    }
                }else if(this.operador=="-"){
                    var temp_val1=obtenerValor(this.exp1,entorno3d);
                    var temp_val2=obtenerValor(this.exp2,entorno3d);
                    if(temp_val1!=null&&temp_val2!=null){
                        return parseFloat(temp_val1)-parseFloat(temp_val2);
                    }
                }else if(this.operador=="*"){
                    var temp_val1=obtenerValor(this.exp1,entorno3d);
                    var temp_val2=obtenerValor(this.exp2,entorno3d);
                    if(temp_val1!=null&&temp_val2!=null){
                        return parseFloat(temp_val1)*parseFloat(temp_val2);
                    }
                }else if(this.operador=="/"){
                    var temp_val1=obtenerValor(this.exp1,entorno3d);
                    var temp_val2=obtenerValor(this.exp2,entorno3d);
                    if(temp_val1!=null&&temp_val2!=null){
                        var temp=parseFloat(temp_val1)/parseFloat(temp_val2);
                        return temp;
                    }
                }else if(this.operador=="^"){
                    var temp_val1=obtenerValor(this.exp1,entorno3d);
                    var temp_val2=obtenerValor(this.exp2,entorno3d);
                    if(temp_val1!=null&&temp_val2!=null){
                        return Math.pow(parseFloat(temp_val1),parseFloat(temp_val2));
                    }
                }else if(this.operador=="%"){
                    var temp_val1=obtenerValor(this.exp1,entorno3d);
                    var temp_val2=obtenerValor(this.exp2,entorno3d);
                    if(temp_val1!=null&&temp_val2!=null){
                        return parseFloat(temp_val1)%parseFloat(temp_val2);
                    }
                }else if(this.operador=="=="){
                    var temp_val1=obtenerValor(this.exp1,entorno3d);
                    var temp_val2=obtenerValor(this.exp2,entorno3d);
                    if(temp_val1!=null&&temp_val2!=null){
                        return parseFloat(temp_val1)==parseFloat(temp_val2);
                    }
                }else if(this.operador=="!="){
                    var temp_val1=obtenerValor(this.exp1,entorno3d);
                    var temp_val2=obtenerValor(this.exp2,entorno3d);
                    if(temp_val1!=null&&temp_val2!=null){
                        return parseFloat(temp_val1)!=parseFloat(temp_val2);
                    }
                }else if(this.operador==">"){
                    var temp_val1=obtenerValor(this.exp1,entorno3d);
                    var temp_val2=obtenerValor(this.exp2,entorno3d);
                    if(temp_val1!=null&&temp_val2!=null){
                        return parseFloat(temp_val1)>parseFloat(temp_val2);
                    }
                }else if(this.operador=="<"){
                    var temp_val1=obtenerValor(this.exp1,entorno3d);
                    var temp_val2=obtenerValor(this.exp2,entorno3d);
                    if(temp_val1!=null&&temp_val2!=null){
                        return parseFloat(temp_val1)<parseFloat(temp_val2);
                    }
                }else if(this.operador==">="){
                    var temp_val1=obtenerValor(this.exp1,entorno3d);
                    var temp_val2=obtenerValor(this.exp2,entorno3d);
                    if(temp_val1!=null&&temp_val2!=null){
                        return parseFloat(temp_val1)>=parseFloat(temp_val2);
                    }
                }else if(this.operador=="<="){
                    var temp_val1=obtenerValor(this.exp1,entorno3d);
                    var temp_val2=obtenerValor(this.exp2,entorno3d);
                    if(temp_val1!=null&&temp_val2!=null){
                        return parseFloat(temp_val1)<=parseFloat(temp_val2);
                    }
                }else{
                    console.log("Operacion no valida, expresiones3d");
                    return null;
                }
            }else{
                //es un valor puntual
                return this.exp1;
            }

        }
    }
}
function obtenerValor(exp,entorno3d){
    if(exp.tipo=="NUMERO"){
        return exp.getValue(entorno3d);
    }else if(exp.tipo=="ETIQUETA"){
        var temp_eti=exp.getValue(entorno3d);
        var temp_sim=entorno3d.obtener(temp_eti);
        if(temp_sim!=null){
            return temp_sim.valor;
        }else{
            console.log("Error Semantico, no tiene valor la etiqueta en operandos,etiqueta "+temp_eti);
        }
    }else if(exp.tipo=="HEAP"){
        var temp_indice=obtenerIndice(t_nodo,entorno3d);
        if(temp_indice!=null){
                return heap[temp_indice];
        }else{
            console.log("Error Semantico, no tiene valor la etiqueta en operandos,heap");
        }
    }else if(exp.tipo=="STACK"){
        var temp_indice=obtenerIndice(t_nodo,entorno3d);
        if(temp_indice!=null){
                return stack[temp_indice];
        }else{
            console.log("Error Semantico, no tiene valor la etiqueta en operandos,stack");
        }
    }else if(exp.tipo=="H"){
        return ptr_h;
    }else if(exp.tipo=="P"){
        return ptr_p;
    }else{
        console.log("Error Semantico, Operador no soportado");
        return null;
    }
}