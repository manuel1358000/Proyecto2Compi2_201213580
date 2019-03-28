class Aritmetica{
    constructor(exp1,exp2,unario,valor,operador,tipoprimitivo,linea,columna){
        this.exp1=exp1;
        this.exp2=exp2;
        this.unario=unario;
        this.valor=valor;
        this.operador=operador;
        this.tipoprimitivo=tipoprimitivo;
        this.linea=linea;
        this.columna=columna;
    }
    getValue(entorno){
        if(this.unario){
            var result1=this.exp1.getValue(entorno);
            var tipo1=this.exp1.getTipe(entorno);
            if(tipo1==PrimitiveType.INTEGER){
                result1.cadena=result1.u_etiqueta+"=-"+result1.valor+";\n";
                this.tipoprimitivo=tipo1;
                return result1;
            }else if(tipo1==PrimitiveType.DOUBLE){
                result1.cadena=result1.u_etiqueta+"=-"+result1.valor+";\n";
                this.tipoprimitivo=tipo1;
                return result1;
            }else{
                console.log("Error semantico, en el tipo unario -");
            }    
        }else{
            if(this.exp1!=null&&this.exp2!=null){
                var result1=this.exp1.getValue(entorno);
                var tipo1=this.exp1.getTipe(entorno);
                var result2=this.exp2.getValue(entorno);
                var tipo2=this.exp2.getTipe(entorno);
                var tipo=generarTipo(tipo1,tipo2);
                if(tipo!=null){
                    if(this.operador=="+"){
                        if(tipo=="STRING"){
                            var result=new Result();
                            result.u_etiqueta=generarEtiqueta();
                            result.cadena+=result.u_etiqueta+"=h;\n";
                            result.cadena+=generarString(result1.valor,false)
                            result.cadena+=generarString(result2.valor,true);
                            result.valor=result1.valor+result2.valor;
                            this.tipoprimitivo=PrimitiveType.STRING;
                            return result;
                        }else if(tipo=="INTEGER"){
                            var result=new Result();
                            result.u_etiqueta=generarEtiqueta();
                            result.cadena=result1.cadena+result2.cadena;
                            result.cadena+=result.u_etiqueta+"="+result1.u_etiqueta+"+"+result2.u_etiqueta+";\n";
                            this.tipoprimitivo=PrimitiveType.INTEGER;
                            return result;
                        }else if(tipo=="DOUBLE"){
                            var result=new Result();
                            result.u_etiqueta=generarEtiqueta();
                            result.cadena=result1.cadena+result2.cadena;
                            result.cadena+=result.u_etiqueta+"="+result1.u_etiqueta+"+"+result2.u_etiqueta+";\n";
                            this.tipoprimitivo=PrimitiveType.DOUBLE;
                            return result;
                        }else if(tipo=="CHAR"){
                            var result=new Result();
                            result.u_etiqueta=generarEtiqueta();
                            result.cadena=result1.cadena+result2.cadena;
                            result.cadena+=result.u_etiqueta+"="+result1.u_etiqueta+"+"+result2.u_etiqueta+";\n";
                            this.tipoprimitivo=PrimitiveType.CHAR;
                            return result;
                        }else{
                            console.log("Error semantico: Operacion no soportada");
                            return null;
                        }
                    }else if(this.operador=="-"){
                         if(tipo=="INTEGER"){
                            var result=new Result();
                            result.u_etiqueta=generarEtiqueta();
                            result.cadena=result1.cadena+result2.cadena;
                            result.cadena+=result.u_etiqueta+"="+result1.u_etiqueta+"-"+result2.u_etiqueta+";\n";
                            this.tipoprimitivo=PrimitiveType.INTEGER;
                            return result;
                        }else if(tipo=="DOUBLE"){
                            var result=new Result();
                            result.u_etiqueta=generarEtiqueta();
                            result.cadena=result1.cadena+result2.cadena;
                            result.cadena+=result.u_etiqueta+"="+result1.u_etiqueta+"-"+result2.u_etiqueta+";\n";
                            this.tipoprimitivo=PrimitiveType.INTEGER;
                            return result;
                        }else if(tipo=="CHAR"){
                            var result=new Result();
                            result.u_etiqueta=generarEtiqueta();
                            result.cadena=result1.cadena+result2.cadena;
                            result.cadena+=result.u_etiqueta+"="+result1.u_etiqueta+"-"+result2.u_etiqueta+";\n";
                            this.tipoprimitivo=PrimitiveType.CHAR;
                            return result;
                        }else{
                            console.log("Error semantico: Operacion no soportada");
                        }
                    }else if(this.operador=="*"){
                        if(tipo=="INTEGER"){
                            var result=new Result();
                            result.u_etiqueta=generarEtiqueta();
                            result.cadena=result1.cadena+result2.cadena;
                            result.cadena+=result.u_etiqueta+"="+result1.u_etiqueta+"*"+result2.u_etiqueta+";\n";
                            this.tipoprimitivo=PrimitiveType.INTEGER;
                            return result;
                        }else if(tipo=="DOUBLE"){
                            var result=new Result();
                            result.u_etiqueta=generarEtiqueta();
                            result.cadena=result1.cadena+result2.cadena;
                            result.cadena+=result.u_etiqueta+"="+result1.u_etiqueta+"*"+result2.u_etiqueta+";\n";
                            this.tipoprimitivo=PrimitiveType.INTEGER;
                            return result;
                        }else if(tipo=="CHAR"){
                            var result=new Result();
                            result.u_etiqueta=generarEtiqueta();
                            result.cadena=result1.cadena+result2.cadena;
                            result.cadena+=result.u_etiqueta+"="+result1.u_etiqueta+"*"+result2.u_etiqueta+";\n";
                            this.tipoprimitivo=PrimitiveType.CHAR;
                            return result;
                        }else{
                            console.log("Error semantico: Operacion no soportada");
                        }
                    }else if(this.operador=="/"){
                        if(tipo=="INTEGER"){
                            var result=new Result();
                            result.u_etiqueta=generarEtiqueta();
                            result.cadena=result1.cadena+result2.cadena;
                            result.cadena+=result.u_etiqueta+"="+result1.u_etiqueta+"/"+result2.u_etiqueta+";\n";
                            this.tipoprimitivo=PrimitiveType.DOUBLE;
                            return result;
                        }else if(tipo=="DOUBLE"){
                            var result=new Result();
                            result.u_etiqueta=generarEtiqueta();
                            result.cadena=result1.cadena+result2.cadena;
                            result.cadena+=result.u_etiqueta+"="+result1.u_etiqueta+"/"+result2.u_etiqueta+";\n";
                            this.tipoprimitivo=PrimitiveType.INTEGER;
                            return result;
                        }else if(tipo=="CHAR"){
                            var result=new Result();
                            result.u_etiqueta=generarEtiqueta();
                            result.cadena=result1.cadena+result2.cadena;
                            result.cadena+=result.u_etiqueta+"="+result1.u_etiqueta+"/"+result2.u_etiqueta+";\n";
                            this.tipoprimitivo=PrimitiveType.CHAR;
                            return result;
                        }else{
                            console.log("Error semantico: Operacion no soportada");
                        }
                    }else if(this.operador=="^"){
                        if(tipo=="INTEGER"){
                            var result=new Result();
                            result.u_etiqueta=generarEtiqueta();
                            result.cadena=result1.cadena+result2.cadena;
                            result.cadena+=result.u_etiqueta+"="+result1.u_etiqueta+"^"+result2.u_etiqueta+";\n";
                            this.tipoprimitivo=PrimitiveType.INTEGER;
                            return result;
                        }else if(tipo=="DOUBLE"){
                            var result=new Result();
                            result.u_etiqueta=generarEtiqueta();
                            result.cadena=result1.cadena+result2.cadena;
                            result.cadena+=result.u_etiqueta+"="+result1.u_etiqueta+"^"+result2.u_etiqueta+";\n";
                            this.tipoprimitivo=PrimitiveType.DOUBLE;
                            return result;
                        }else if(tipo=="CHAR"){
                            var result=new Result();
                            result.u_etiqueta=generarEtiqueta();
                            result.cadena=result1.cadena+result2.cadena;
                            result.cadena+=result.u_etiqueta+"="+result1.u_etiqueta+"^"+result2.u_etiqueta+";\n";
                            this.tipoprimitivo=PrimitiveType.CHAR;
                            return result;
                        }else{
                            console.log("Error semantico: Operacion no soportada");
                        }
                    }else if(this.operador=="%"){
                        if(tipo=="INTEGER"){
                            var result=new Result();
                            result.u_etiqueta=generarEtiqueta();
                            result.cadena=result1.cadena+result2.cadena;
                            result.cadena+=result.u_etiqueta+"="+result1.u_etiqueta+"%"+result2.u_etiqueta+";\n";
                            this.tipoprimitivo=PrimitiveType.INTEGER;
                            return result;
                        }else if(tipo=="DOUBLE"){
                            var result=new Result();
                            result.u_etiqueta=generarEtiqueta();
                            result.cadena=result1.cadena+result2.cadena;
                            result.cadena+=result.u_etiqueta+"="+result1.u_etiqueta+"%"+result2.u_etiqueta+";\n";
                            this.tipoprimitivo=PrimitiveType.DOUBLE;
                            return result;
                        }else if(tipo=="CHAR"){
                            var result=new Result();
                            result.u_etiqueta=generarEtiqueta();
                            result.cadena=result1.cadena+result2.cadena;
                            result.cadena+=result.u_etiqueta+"="+result1.u_etiqueta+"%"+result2.u_etiqueta+";\n";
                            this.tipoprimitivo=PrimitiveType.CHAR;
                            return result;
                        }else{
                            console.log("Error semantico: Operacion no soportada");
                        }
                    }else{
                        console.log("Error semantico: Operador no soportado op: "+this.operador);
                    }
                }else{
                    console.log("Error semantico: no se pueden operar los tipos t1:"+tipo1+" t2: "+tipo2);
                }
            }else{
                //es una valor implicito
                if(this.tipoprimitivo==PrimitiveType.STRING){
                    var result=new Result();
                    result.u_etiqueta=generarEtiqueta();
                    result.cadena=result.u_etiqueta+"=h;\n";
                    result.cadena+=generarString(this.valor,true);
                    result.valor=this.valor;
                    return result;
                }else{
                    var result=new Result();
                    result.u_etiqueta=generarEtiqueta();
                    if(this.tipoprimitivo==PrimitiveType.CHAR){
                        result.valor=this.valor.charCodeAt(1);
                    }else{
                        result.valor=this.valor;
                    }
                    result.cadena=result.u_etiqueta+"="+result.valor+";\n";
                    return result;
                }
                
            }
        }   
    }
    getTipe(entorno){
        return this.tipoprimitivo;
    }
}
function numerico(tipo){
    if(tipo==PrimitiveType.STRING||tipo==PrimitiveType.INTEGER||tipo==PrimitiveType.DOUBLE||tipo==PrimitiveType.BOOLEAN||tipo==PrimitiveType.CHAR){
        return true;
    }else{
        return false;
    }
}
function generarString(cadena,bandera){
    var respuesta="";
    cadena=String(cadena).replace(/['"]+/g, '');
    for(var i=0;i<cadena.length;i++){
        respuesta+="heap[h]="+cadena.charCodeAt(i)+";\n";
        respuesta+="h=h+1;\n";
    }
    if(bandera==true){
        respuesta+="heap[h]=0;\n";
        respuesta+="h=h+1;\n";
    }
    return respuesta;
}
function generarTipo(tipo1,tipo2){
    if(!numerico(tipo1)||!numerico(tipo2)){
        return null;
    }else if(tipo1==PrimitiveType.STRING||tipo2==PrimitiveType.STRING){
        return PrimitiveType.STRING;
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
        //ACA DEBE DE IR EL TIPO CHAR
        return PrimitiveType.BOOLEAN;   
    }
}