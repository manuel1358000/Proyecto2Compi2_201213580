class Ternario{
    constructor(condicion,nodov,nodof){
        this.condicion=condicion;
        this.nodov=nodov;
        this.nodof=nodof;
        this.ambitos="";
        this.tipoprimitivo=null;
        this.padre;
        this.normal;
        this.codigo=codigo;
        codigo++;
    }
    getValue(entorno){
        var result=new Result();
        var temp="";
        this.condicion.ambitos=this.ambitos;
        this.condicion.padre=this.padre;
        this.condicion.normal=this.normal;
        var result_condicion=this.condicion.getValue(entorno);
        var tipo_condicion=this.condicion.getTipe(entorno);
        var etisalir=generarSalto();
        var etif=generarSalto();
        var eti1=generarEtiqueta();
        if(result_condicion!=null&&tipo_condicion=="BOOLEAN"){
            temp+=result_condicion.cadena;
            temp+="if("+result_condicion.u_etiqueta+"==0) goto "+etif+";\n";
            this.nodov.ambitos=this.ambitos;
            this.nodov.padre=this.padre;
            this.nodov.normal=this.normal;
            var result_verdadero=this.nodov.getValue(entorno);
            var tipo_verdadero=this.nodov.getTipe(entorno);
            temp+=result_verdadero.cadena;
            temp+=eti1+"="+result_verdadero.u_etiqueta+";\n";
            temp+="goto "+etisalir+";\n";
            temp+=etif+":\n";
            this.nodof.ambitos=this.ambitos;
            this.nodof.padre=this.padre;
            this.nodof.normal=this.normal;
            var result_falso=this.nodof.getValue(entorno);
            var tipo_falso=this.nodof.getTipe(entorno);
            temp+=result_falso.cadena;
            temp+=eti1+"="+result_falso.u_etiqueta+";\n";
            temp+=etisalir+":\n";
            this.tipoprimitivo=tipo_falso;
            result.u_etiqueta=eti1;
            
        }else{
            alert("Error Semantico, La condicion del ternario tiene que ser BOOLEAN");
        } 
        result.cadena+=temp;
        return result;  
    }
    getTipe(entorno){
        return this.tipoprimitivo;
    }
}