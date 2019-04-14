

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
                        return parseFloat(temp_val1)/parseFloat(temp_val2);
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
                }else{
                    alert("Operacion no valida, expresiones3d");
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
        if(temp_sim.valor!=null){
            return temp_sim.valor;
        }else{
            alert("Error Semantico, no tiene valor la etiqueta en operandos");
        }
    }else if(exp.tipo=="HEAP"){
        var temp_indice=obtenerIndice(t_nodo,entorno3d);
        if(temp_indice!=null){
                return heap[temp_indice];
        }else{
            alert("Error Semantico, no tiene valor la etiqueta en operandos");
        }
    }else if(exp.tipo=="STACK"){
        var temp_indice=obtenerIndice(t_nodo,entorno3d);
        if(temp_indice!=null){
                return stack[temp_indice];
        }else{
            alert("Error Semantico, no tiene valor la etiqueta en operandos");
        }
    }else if(exp.tipo=="H"){
        return ptr_h;
    }else if(exp.tipo=="P"){
        return ptr_p;
    }else{
        alert("Error Semantico, Operador no soportado");
        return null;
    }
}