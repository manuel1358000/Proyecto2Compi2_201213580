class Llamada_Metodo{
    constructor(id,parametros){
        this.id=id;
        this.parametros=parametros;
        this.ambitos="";
        this.padre="";
        this.normal="";
    }
    execute(entorno){
        var result=null;
        var nombre_completo=this.normal+"_"+this.id;
        var temp="\n\n\n";
        var param_temp=this.parametros;
        var indices=[];
        for(var i=0;i<param_temp.length;i++){
            if(this.parametros[i].getTipe(entorno)=="ID"){
                indices.unshift(i);
            }
            if(this.padre=="main"){
                param_temp[i].ambitos=this.ambitos+"/"+this.padre
            }else{
                param_temp[i].ambitos=this.ambitos;
            }
            param_temp[i].getValue(entorno);
            nombre_completo+="_"+param_temp[i].getTipe(entorno);
        }

        //vamos a verificar si existe el metodo en el entorno
        var sim=entorno.obtener(nombre_completo);   
        if(sim!=null){
            //if(sim.ambito==this.ambitos){
                result=new Result();
                var sim_temp=entorno.obtener(this.padre);
                if(sim_temp!=null){
                    var eti1=generarEtiqueta();
                    temp+=eti1+"=p+"+sim_temp.tamanio+";//simulacion de cambio de ambito para pasar los parametros\n";
                    var pos=2;
                    for(var i=0;i<this.parametros.length;i++){
                        for(var t=0;t<indices.length;t++){
                            if(indices[t]==i){
                                this.parametros[i].tipoprimitivo="ID";
                            }
                        }
                        if(this.padre=="main"){
                            this.parametros[i].ambitos=this.ambitos+"/"+this.padre
                        }else{
                            this.parametros[i].ambitos=this.ambitos;
                        }
                        
                        var result_temp=this.parametros[i].getValue(entorno);
                        var tipo_parametro=this.parametros[i].getTipe(entorno);
                        if(tipo_parametro=="INTEGER"||tipo_parametro=="DOUBLE"||tipo_parametro=="BOOLEAN"){
                            temp+="         //INICIO PARAMETRO "+(i+1)+"\n";
                            var temp_h=generarEtiqueta();
                            temp+=temp_h+"=h;\n";
                            var eti2=generarEtiqueta();
                            temp+=result_temp.cadena;
                            temp+=eti2+"="+eti1+"+"+pos+";//posicion del parametro\n";
                            temp+="heap["+temp_h+"]="+result_temp.u_etiqueta+";\n";
                            temp+="h=h+1;\n";
                            temp+="stack["+eti2+"]="+temp_h+";\n";
                            pos++;
                            temp+="         //FIN PARAMETRO "+(i+1)+"\n";
                        }else if(tipo_parametro=="STRING"||tipo_parametro=="CHAR"){
                            temp+="         //INICIO PARAMETRO "+(i+1)+"\n";
                            var temp_h=generarEtiqueta();
                            temp+=temp_h+"=h;\n";
                            temp+="h=h+1;\n";
                            var eti2=generarEtiqueta();
                            temp+=result_temp.cadena;
                            temp+=eti2+"="+eti1+"+"+pos+";//posicion del parametro\n";
                            temp+="heap["+temp_h+"]="+result_temp.u_etiqueta+";\n";
                            temp+="h=h+1;\n";
                            temp+="stack["+eti2+"]="+temp_h+";\n";
                            pos++;
                            temp+="         //FIN PARAMETRO "+(i+1)+"\n";
                        }else{
                            alert("Es un id el que se esta mandando como parametro");
                        }
                    }
                    temp+="p=p+"+sim_temp.tamanio+";\n";
                    temp+="call "+nombre_completo+";\n";
                    temp+="p=p-"+sim_temp.tamanio+";\n";
                }else{
                    alert("Ocurrio un error en el indice padre llamada a metodo");
                }
           /* }else{
                alert("Error Semantico, No existe el metodo en la clase");
            }*/
        }else{
            alert("Error Semantico, No existe el metodo que se esta llamando "+nombre_completo);
        }
        temp+="\n\n\n";
        result.cadena+=temp;
        return result;
    }
}