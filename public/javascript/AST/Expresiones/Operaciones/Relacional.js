class Relacional{
    constructor(exp1,exp2,unario,valor,operador,tipoprimitivo,linea,columna){
        this.exp1=exp1;
        this.exp2=exp2;
        this.unario=unario;
        this.valor=valor;
        this.operador=operador;
        this.tipoprimitivo=tipoprimitivo;
        this.linea=linea;
        this.columna=columna;
        this.ambitos="";
        this.padre;
        this.normal;
        this.codigo=codigo;
        codigo++;
    }
    getValue(entorno){
        if(this.exp1!=null&&this.exp2!=null){
            this.exp1.ambitos=this.ambitos;
            this.exp1.padre=this.padre;
            this.exp1.normal=this.normal;
            var result1=this.exp1.getValue(entorno);
            var tipo1=this.exp1.getTipe(entorno);
            this.exp2.ambitos=this.ambitos;
            this.exp2.padre=this.padre;
            this.exp2.normal=this.normal;
            var result2=this.exp2.getValue(entorno);
            var tipo2=this.exp2.getTipe(entorno);
            var tipo;
            if(tipo1=="NULO"||tipo2=="NULO"){
                tipo="BOOLEAN";
            }else{
                tipo=generarTipoRelacional(tipo1,tipo2);
            }
            if(tipo!=null){
                if(this.operador==">"){
                    var salto_v=generarSalto();
                    var salto_f=generarSalto();
                    var salto_s=generarSalto();
                    var eti_aux=generarEtiqueta();
                    var result=new Result();
                    result.cadena+=result1.cadena+result2.cadena;
                    if(tipo=="INTEGER"){
                        result.cadena+="if("+result1.u_etiqueta+">"+result2.u_etiqueta+") goto "+salto_v+";\n"; 
                    }else if(tipo=="DOUBLE"){
                        result.cadena+="if("+result1.u_etiqueta+">"+result2.u_etiqueta+") goto "+salto_v+";\n";
                    }else if(tipo=="CHAR"){
                        result.cadena+="if("+result1.u_etiqueta+">"+result2.u_etiqueta+") goto "+salto_v+";\n";
                    }else if(tipo=="BOOLEAN"){
                        result.cadena+="if("+result1.u_etiqueta+">"+result2.u_etiqueta+") goto "+salto_v+";\n";
                    }else{
                        console.log("Error semantico: Operacion no soportada");
                        var errores_1=new Errores("Semantico","Operacion no soportada para >",0,0);
                            lista_errores.push(errores_1);
                    }
                    result.cadena+="goto "+salto_f+";\n";
                    result.cadena+=salto_v+": \n"+eti_aux+"=1;\n goto "+salto_s+";\n";
                    result.cadena+=salto_f+": \n"+eti_aux+"=0;\n";
                    result.cadena+=salto_s+":\n";
                    result.u_etiqueta=eti_aux;
                    this.tipoprimitivo=PrimitiveType.BOOLEAN;
                    return result;
                }else if(this.operador=="<"){
                        var salto_v=generarSalto();
                        var salto_f=generarSalto();
                        var salto_s=generarSalto();
                        var eti_aux=generarEtiqueta();
                        var result=new Result();
                        result.cadena+=result1.cadena+result2.cadena;
                    if(tipo=="INTEGER"){
                        result.cadena+="if("+result1.u_etiqueta+"<"+result2.u_etiqueta+") goto "+salto_v+";\n";
                    }else if(tipo=="DOUBLE"){
                        result.cadena+="if("+result1.u_etiqueta+"<"+result2.u_etiqueta+") goto "+salto_v+";\n";
                    }else if(tipo=="CHAR"){
                        result.cadena+="if("+result1.u_etiqueta+"<"+result2.u_etiqueta+") goto "+salto_v+";\n";
                    }else{
                        console.log("Error semantico: Operacion no soportada");
                        var errores_1=new Errores("Semantico","Operacion no soportada para <",0,0);
                            lista_errores.push(errores_1);
                    }
                    result.cadena+="goto "+salto_f+";\n";
                    result.cadena+=salto_v+": \n"+eti_aux+"=1;\n goto "+salto_s+";\n";
                    result.cadena+=salto_f+": \n"+eti_aux+"=0;\n";
                    result.cadena+=salto_s+":\n";
                    result.u_etiqueta=eti_aux;
                    this.tipoprimitivo=PrimitiveType.BOOLEAN;
                    return result;
                }else if(this.operador==">="){
                    var salto_v=generarSalto();
                    var salto_f=generarSalto();
                    var salto_s=generarSalto();
                    var eti_aux=generarEtiqueta();
                    var result=new Result();
                    result.cadena+=result1.cadena+result2.cadena;
                    if(tipo=="INTEGER"){    
                        result.cadena+="if("+result1.u_etiqueta+">="+result2.u_etiqueta+") goto "+salto_v+";\n";
                    }else if(tipo=="DOUBLE"){
                        result.cadena+="if("+result1.u_etiqueta+">="+result2.u_etiqueta+") goto "+salto_v+";\n";
                    }else if(tipo=="CHAR"){
                        result.cadena+="if("+result1.u_etiqueta+">="+result2.u_etiqueta+") goto "+salto_v+";\n";
                    }else{
                        alert("Error Semantico: Operacion no soportada para >=");
                        var errores_1=new Errores("Semantico","Operacion no soportada para >=",0,0);
                            lista_errores.push(errores_1);
                    }
                    result.cadena+="goto "+salto_f+";\n";
                    result.cadena+=salto_v+": \n"+eti_aux+"=1;\n goto "+salto_s+";\n";
                    result.cadena+=salto_f+": \n"+eti_aux+"=0;\n";
                    result.cadena+=salto_s+":\n";
                    result.u_etiqueta=eti_aux;
                    this.tipoprimitivo=PrimitiveType.BOOLEAN;
                    return result;
                }else if(this.operador=="<="){
                    var salto_v=generarSalto();
                    var salto_f=generarSalto();
                    var salto_s=generarSalto();
                    var eti_aux=generarEtiqueta();
                    var result=new Result();
                    result.cadena+=result1.cadena+result2.cadena;
                    if(tipo=="INTEGER"){
                        result.cadena+="if("+result1.u_etiqueta+"<="+result2.u_etiqueta+") goto "+salto_v+";\n";
                    }else if(tipo=="DOUBLE"){
                        result.cadena+="if("+result1.u_etiqueta+"<="+result2.u_etiqueta+") goto "+salto_v+";\n";
                    }else if(tipo=="CHAR"){
                        result.cadena+="if("+result1.u_etiqueta+"<="+result2.u_etiqueta+") goto "+salto_v+";\n";
                    }else{
                        console.log("Error semantico: Operacion no soportada");
                        var errores_1=new Errores("Semantico","Operacion no soportada para <=",0,0);
                            lista_errores.push(errores_1);
                    }
                    result.cadena+="goto "+salto_f+";\n";
                    result.cadena+=salto_v+": \n"+eti_aux+"=1;\n goto "+salto_s+";\n";
                    result.cadena+=salto_f+": \n"+eti_aux+"=0;\n";
                    result.cadena+=salto_s+":\n";
                    result.u_etiqueta=eti_aux;
                    this.tipoprimitivo=PrimitiveType.BOOLEAN;
                    return result;
                }else if(this.operador=="=="){
                    var salto_v=generarSalto();
                    var salto_f=generarSalto();
                    var salto_s=generarSalto();
                    var eti_aux=generarEtiqueta();
                    var result=new Result();
                    result.cadena+=result1.cadena+result2.cadena;
                    if(tipo=="STRING"){
                        result1.valor=result1.valor.replace(/['"]+/g, '');
                        result2.valor=result2.valor.replace(/['"]+/g, '');
                        if(result1.valor.length==result2.valor.length){
                            //si son iguales las longitudes por lo que se tiene que hacer el recorrido de todo
                            var etiv=generarSalto();
                            var etif=generarSalto();
                            var etis=generarSalto();
                            var temp1=generarEtiqueta();
                            var temp2=generarEtiqueta();
                            result.cadena+=temp1+"=heap["+result1.u_etiqueta+"];\n";
                            result.cadena+=temp2+"=heap["+result2.u_etiqueta+"];\n";
                            result.cadena+="if("+temp1+"=="+temp2+") goto "+etiv+";\n";
                            result.cadena+="goto "+etif+";\n"
                            result.cadena+=etiv+":\n";
                            for(var i=0;i<(result1.valor.length-1);i++){
                                result.cadena+=result1.u_etiqueta+"="+result1.u_etiqueta+"+1;\n";
                                result.cadena+=result2.u_etiqueta+"="+result2.u_etiqueta+"+1;\n";
                                result.cadena+=temp1+"=heap["+result1.u_etiqueta+"];\n";
                                result.cadena+=temp2+"=heap["+result2.u_etiqueta+"];\n";
                                etiv=generarSalto();
                                result.cadena+="if("+temp1+"=="+temp2+") goto "+etiv+";\n";
                                result.cadena+="goto "+etif+";\n";
                                result.cadena+=etiv+": \n";
                            }
                            result.cadena+=temp1+"=1;\n";
                            result.cadena+="goto "+etis+";\n";
                            result.cadena+=etif+":\n";
                            result.cadena+=temp1+"=0;\n";
                            result.cadena+=etis+":\n";
                            result.u_etiqueta=temp1;
                            this.tipoprimitivo=PrimitiveType.BOOLEAN;
                            return result;
                        }else{
                            result.u_etiqueta=eti_aux;
                            result.cadena=result.u_etiqueta+"=0;\n";
                            this.tipoprimitivo=PrimitiveType.BOOLEAN;
                            return result;
                        }
                    }else if(tipo=="INTEGER"){
                        result.cadena+="if("+result1.u_etiqueta+"=="+result2.u_etiqueta+") goto "+salto_v+";\n";
                        result.cadena+="goto "+salto_f+";\n";
                        result.cadena+=salto_v+": \n"+eti_aux+"=1;\n goto "+salto_s+";\n";
                        result.cadena+=salto_f+": \n"+eti_aux+"=0;\n";
                        result.cadena+=salto_s+":\n";
                        result.u_etiqueta=eti_aux;
                        this.tipoprimitivo=PrimitiveType.BOOLEAN;
                        return result;
                    }else if(tipo=="DOUBLE"){
                        result.cadena+="if("+result1.u_etiqueta+"=="+result2.u_etiqueta+") goto "+salto_v+";\n";
                        result.cadena+="goto "+salto_f+";\n";
                        result.cadena+=salto_v+": \n"+eti_aux+"=1;\n goto "+salto_s+";\n";
                        result.cadena+=salto_f+": \n"+eti_aux+"=0;\n";
                        result.cadena+=salto_s+":\n";
                        result.u_etiqueta=eti_aux;
                        this.tipoprimitivo=PrimitiveType.BOOLEAN;
                        return result;
                    }else if(tipo=="BOOLEAN"){
                        result.cadena+="if("+result1.u_etiqueta+"=="+result2.u_etiqueta+") goto "+salto_v+";\n";
                        result.cadena+="goto "+salto_f+";\n";
                        result.cadena+=salto_v+": \n"+eti_aux+"=1;\n goto "+salto_s+";\n";
                        result.cadena+=salto_f+": \n"+eti_aux+"=0;\n";
                        result.cadena+=salto_s+":\n";
                        result.u_etiqueta=eti_aux;
                        this.tipoprimitivo=PrimitiveType.BOOLEAN;
                        return result;
                    }else if(tipo=="CHAR"){
                        result.cadena+="if("+result1.u_etiqueta+"=="+result2.u_etiqueta+") goto "+salto_v+";\n";
                        result.cadena+="goto "+salto_f+";\n";
                        result.cadena+=salto_v+": \n"+eti_aux+"=1;\n goto "+salto_s+";\n";
                        result.cadena+=salto_f+": \n"+eti_aux+"=0;\n";
                        result.cadena+=salto_s+":\n";
                        result.u_etiqueta=eti_aux;
                        this.tipoprimitivo=PrimitiveType.BOOLEAN;
                        return result;
                    }else{
                        console.log("Error semantico: Operacion no soportada");
                        var errores_1=new Errores("Semantico","Operacion no soportada ==",0,0);
                            lista_errores.push(errores_1);
                    }
                    
                }else if(this.operador=="!="){
                    var salto_v=generarSalto();
                    var salto_f=generarSalto();
                    var salto_s=generarSalto();
                    var eti_aux=generarEtiqueta();
                    var result=new Result();
                    result.cadena+=result1.cadena+result2.cadena;
                    if(tipo=="STRING"){
                        result1.valor=result1.valor.replace(/['"]+/g, '');
                        result2.valor=result2.valor.replace(/['"]+/g, '');
                        if(result1.valor.length==result2.valor.length){
                            //si son iguales las longitudes por lo que se tiene que hacer el recorrido de todo
                            var etiv=generarSalto();
                            var etif=generarSalto();
                            var etis=generarSalto();
                            var temp1=generarEtiqueta();
                            var temp2=generarEtiqueta();
                            result.cadena+=temp1+"=heap["+result1.u_etiqueta+"];\n";
                            result.cadena+=temp2+"=heap["+result2.u_etiqueta+"];\n";
                            result.cadena+="if("+temp1+"=="+temp2+") goto "+etiv+";\n";
                            result.cadena+="goto "+etif+";\n"
                            result.cadena+=etiv+":\n";
                            for(var i=0;i<(result1.valor.length-1);i++){
                                result.cadena+=result1.u_etiqueta+"="+result1.u_etiqueta+"+1;\n";
                                result.cadena+=result2.u_etiqueta+"="+result2.u_etiqueta+"+1;\n";
                                result.cadena+=temp1+"=heap["+result1.u_etiqueta+"];\n";
                                result.cadena+=temp2+"=heap["+result2.u_etiqueta+"];\n";
                                etiv=generarSalto();
                                result.cadena+="if("+temp1+"=="+temp2+") goto "+etiv+";\n";
                                result.cadena+="goto "+etif+";\n";
                                result.cadena+=etiv+": \n";
                            }
                            result.cadena+=temp1+"=0;\n";
                            result.cadena+="goto "+etis+";\n";
                            result.cadena+=etif+":\n";
                            result.cadena+=temp1+"=1;\n";
                            result.cadena+=etis+":\n";
                            result.u_etiqueta=temp1;
                            this.tipoprimitivo=PrimitiveType.BOOLEAN;
                            return result;
                        }else{
                            result.u_etiqueta=eti_aux;
                            result.cadena=result.u_etiqueta+"=1;\n";
                            this.tipoprimitivo=PrimitiveType.BOOLEAN;
                            return result;
                        }
                    }else if(tipo=="INTEGER"){
                        result.cadena+="if("+result1.u_etiqueta+"!="+result2.u_etiqueta+") goto "+salto_v+";\n";
                        result.cadena+="goto "+salto_f+";\n";
                        result.cadena+=salto_v+": \n"+eti_aux+"=1;\n goto "+salto_s+";\n";
                        result.cadena+=salto_f+": \n"+eti_aux+"=0;\n";
                        result.cadena+=salto_s+":\n";
                        result.u_etiqueta=eti_aux;
                        this.tipoprimitivo=PrimitiveType.BOOLEAN;
                        return result;
                    }else if(tipo=="DOUBLE"){
                        result.cadena+="if("+result1.u_etiqueta+"!="+result2.u_etiqueta+") goto "+salto_v+";\n";
                        result.cadena+="goto "+salto_f+";\n";
                        result.cadena+=salto_v+": \n"+eti_aux+"=1;\n goto "+salto_s+";\n";
                        result.cadena+=salto_f+": \n"+eti_aux+"=0;\n";
                        result.cadena+=salto_s+":\n";
                        result.u_etiqueta=eti_aux;
                        this.tipoprimitivo=PrimitiveType.BOOLEAN;
                        return result;
                    }else if(tipo=="BOOLEAN"){
                        result.cadena+="if("+result1.u_etiqueta+"!="+result2.u_etiqueta+") goto "+salto_v+";\n";
                        result.cadena+="goto "+salto_f+";\n";
                        result.cadena+=salto_v+": \n"+eti_aux+"=1;\n goto "+salto_s+";\n";
                        result.cadena+=salto_f+": \n"+eti_aux+"=0;\n";
                        result.cadena+=salto_s+":\n";
                        result.u_etiqueta=eti_aux;
                        this.tipoprimitivo=PrimitiveType.BOOLEAN;
                        return result;
                    }else if(tipo=="CHAR"){
                        result.cadena+="if("+result1.u_etiqueta+"!="+result2.u_etiqueta+") goto "+salto_v+";\n";
                        result.cadena+="goto "+salto_f+";\n";
                        result.cadena+=salto_v+": \n"+eti_aux+"=1;\n goto "+salto_s+";\n";
                        result.cadena+=salto_f+": \n"+eti_aux+"=0;\n";
                        result.cadena+=salto_s+":\n";
                        result.u_etiqueta=eti_aux;
                        this.tipoprimitivo=PrimitiveType.BOOLEAN;
                        return result;
                    }else{
                        console.log("Error semantico: Operacion no soportada");
                        var errores_1=new Errores("Semantico","Operacion no soportada para !=",0,0);
                            lista_errores.push(errores_1);
                    }
                }else{
                    console.log("Error semantico: Operador no soportado op: "+this.operador);
                    var errores_1=new Errores("Semantico","Operador no soportado "+this.operador,0,0);
                            lista_errores.push(errores_1);
                }
            }else{
                console.log("Error semantico: no se pueden operar los tipos t1:"+tipo1+" t2: "+tipo2);
                var errores_1=new Errores("Semantico","no se pueden operar los tipos t1:"+tipo1+" t2:"+tipo2,0,0);
                            lista_errores.push(errores_1);
            }   
        }else{  
            return this.valor;
        }
    }
    getTipe(entorno){
        return this.tipoprimitivo;
    }
}
function numerico(tipo){
    if(tipo==PrimitiveType.STRING||tipo==PrimitiveType.INTEGER||tipo==PrimitiveType.DOUBLE||tipo==PrimitiveType.BOOLEAN||tipo==PrimitiveType.CHAR||tipo==PrimitiveType.NULO){
        return true;
    }else{
        return false;
    }
}
function generarTipoRelacional(tipo1,tipo2){
    if(!numerico(tipo1)||!numerico(tipo2)){
        return null;
    }else if(tipo1==PrimitiveType.NULO||tipo2==PrimitiveType.NULO){
        return PrimitiveType.BOOLEAN;
    }else if(tipo1==PrimitiveType.STRING||tipo2==PrimitiveType.STRING){
        if(tipo1==PrimitiveType.STRING&&tipo2==PrimitiveType.STRING){
            return PrimitiveType.STRING;
        }else{
            return null;
        }
    }else if(tipo1==PrimitiveType.DOUBLE||tipo2==PrimitiveType.DOUBLE){
        if(tipo1==PrimitiveType.BOOLEAN||tipo2==PrimitiveType.BOOLEAN){
            return null;
        }else{
            return PrimitiveType.DOUBLE;   
        }
    }else if(tipo1==PrimitiveType.INTEGER||tipo2==PrimitiveType.INTEGER){
        if(tipo1==PrimitiveType.BOOLEAN||tipo2==PrimitiveType.BOOLEAN){
            return null;
        }else{
            return PrimitiveType.INTEGER;   
        }
    }else if(tipo1==PrimitiveType.CHAR||tipo2==PrimitiveType.CHAR){
        if(tipo1==PrimitiveType.BOOLEAN||tipo2==PrimitiveType.BOOLEAN){
            return null;
        }else{
            return PrimitiveType.CHAR;   
        }
    }else{
        //ACA DEBE DE IR EL TIPO BOOLEAN
        return PrimitiveType.BOOLEAN;   
    }


}