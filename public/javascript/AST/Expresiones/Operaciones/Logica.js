class Logica{
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
        if(this.unario){
            var temp="";
            this.exp1.ambitos=this.ambitos;
            this.exp1.padre=this.padre;
            this.exp1.normal=this.normal;
            var result1=this.exp1.getValue(entorno);
            var tipo1=this.exp1.getTipe(entorno);
            var eti1=generarEtiqueta();
            var etifalsa=generarSalto();
            var etisalida=generarSalto();
            if(this.operador=="!"){
                var result=new Result();
                if(tipo1=="BOOLEAN"){
                    temp+=result1.cadena;
                    temp+="if("+result1.u_etiqueta+"==0) goto "+etifalsa+";\n";
                    temp+=eti1+"=0;\n";
                    temp+="goto "+etisalida+";\n";
                    temp+=etifalsa+":\n";
                    temp+=eti1+"=1;\n";
                    temp+=etisalida+":\n";
                    result.cadena+=temp;
                    result.u_etiqueta=eti1;
                    this.tipoprimitivo=tipo1;
                }else{
                    alert("Error Semantico, La operacion unaria ! solo puede ser aplicada a boolean");
                }
                return result;
            }else{  
                console.log("Es algun otro operador unario");
            }
        }else{
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
                var tipo=generarTipoLogica(tipo1,tipo2);
                if(tipo!=null){
                    if(this.operador=="^"){
                        
                        var salto_1=generarSalto();
                        var salto_f=generarSalto();
                        var salto_v=generarSalto();
                        var salto_s=generarSalto();
                        var eti_aux=generarEtiqueta();
                        var result=new Result();
                        var temp="";
                        result.cadena+=result1.cadena+result2.cadena;
                        temp+="if("+result1.u_etiqueta+"==1) goto "+salto_1+";\n";
                        //si el primero es falso
                        temp+="if("+result2.u_etiqueta+"==1) goto "+salto_v+";\n";
                        temp+=eti_aux+"=0;\n";
                        temp+="goto "+salto_s+";\n";
                        temp+=salto_1+":\n";
                        temp+="if("+result2.u_etiqueta+"==1) goto "+salto_f+";\n";
                        temp+=salto_v+":\n";
                        temp+=eti_aux+"=1;\n";
                        temp+="goto "+salto_s+";\n";
                        temp+=salto_f+":\n";
                        temp+=eti_aux+"=0;\n";
                        temp+="goto "+salto_s+";\n";
                        temp+=salto_s+":\n";
                        this.tipoprimitivo=PrimitiveType.BOOLEAN;
                        result.u_etiqueta=eti_aux;
                        result.cadena+=temp;
                        return result;
                    }else if(this.operador=="||"){
                        var salto_v=generarSalto();
                        var salto_f=generarSalto();
                        var salto_f2=generarSalto();
                        var salto_s=generarSalto();
                        var eti_aux=generarEtiqueta();
                        var result=new Result();
                        result.cadena+=result1.cadena+result2.cadena;
                        result.cadena+="if("+result1.u_etiqueta+"==1) goto "+salto_v+";\n";
                        result.cadena+="goto "+salto_f+";\n";
                        result.cadena+=salto_f+":\n";
                        result.cadena+="if("+result2.u_etiqueta+"==1) goto "+salto_v+";\n";
                        result.cadena+="goto "+salto_f2+";\n";
                        result.cadena+=salto_v+":\n";
                        result.cadena+=eti_aux+"=1;\n";
                        result.cadena+="goto "+salto_s+";\n";
                        result.cadena+=salto_f2+":\n";
                        result.cadena+=eti_aux+"=0;\n";
                        result.cadena+=salto_s+":\n";
                        this.tipoprimitivo=PrimitiveType.BOOLEAN;
                        result.u_etiqueta=eti_aux;
                        return result;
                    }else if(this.operador=="&&"){
                        var salto_v=generarSalto();
                        var salto_v2=generarSalto();
                        var salto_f=generarSalto();
                        var salto_s=generarSalto();
                        var eti_aux=generarEtiqueta();
                        /*var result=new Result();
                        result.cadena+=result1.cadena+result2.cadena;
                        result.cadena+="if("+result1.u_etiqueta+"==1) goto "+salto_v+";\n";
                        result.cadena+="goto "+salto_f+";\n";
                        result.cadena+=salto_v+":\n";
                        result.cadena+="if("+result2.u_etiqueta+"==1)goto "+salto_v2+";\n";
                        result.cadena+="goto "+salto_f+";\n";
                        result.cadena+=salto_v2+":\n";
                        result.cadena+=eti_aux+"=1;\n";
                        result.cadena+="goto "+salto_s+";\n";
                        result.cadena+=salto_f+":\n";
                        result.cadena+=eti_aux+"=0;\n";
                        result.cadena+=salto_s+":\n";
                        this.tipoprimitivo=PrimitiveType.BOOLEAN;
                        result.u_etiqueta=eti_aux;
                        return result;*/
                        var result=new Result();
                        result.cadena+=result1.cadena+result2.cadena;
                        result.cadena+="iffalse("+result1.u_etiqueta+"==0) goto "+salto_f+";\n";
                        result.cadena+="iffalse("+result2.u_etiqueta+"==0)goto "+salto_f+";\n";
                        result.cadena+=salto_v+":\n";
                        result.cadena+=eti_aux+"=1;\n"
                        result.cadena+="goto "+salto_s+";\n";
                        result.cadena+=salto_f+":\n";
                        result.cadena+=eti_aux+"=0;\n";
                        result.cadena+=salto_s+":\n";
                        result.u_etiqueta=eti_aux;
                        this.tipoprimitivo=PrimitiveType.BOOLEAN;
                        return result;
                    }else{
                        console.log("Error semantico Logicas: Operador no soportado para operaciones logicas");
                    }
                }else{
                    console.log("Error semantico Logicas: No se pueden operar los tipos tipo1: "+tipo1+" tipo2:"+tipo2);
                }
            }else{
                return this.valor;
            }
        }
    }
    getTipe(entorno){
        return this.tipoprimitivo;
    }
}
function logico(tipo){
    if(tipo==PrimitiveType.BOOLEAN){
        return true;
    }else{
        return false;
    }
}
function generarTipoLogica(tipo1,tipo2){
    if(!logico(tipo1)&&!logico(tipo2)){
        return null;
    }else if(tipo1==PrimitiveType.BOOLEAN&&tipo2==PrimitiveType.BOOLEAN){
        return PrimitiveType.BOOLEAN
    }else{
        return null;
    }
}