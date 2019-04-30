
class Selecciona{
    constructor(condicion,lista_cases,defecto){
        this.condicion=condicion;
        this.lista_cases=lista_cases;
        this.defecto=defecto;
        this.ambitos="";
        this.padre="";
        this.normal="";
    }
    execute(entorno){
        var control=false;
        var result=new Result();
        var temp="";
        var temp_ambi="";
        if(this.padre=="main"){
            temp_ambi=this.ambitos+"/"+this.padre;
        }else{
            temp_ambi=this.ambitos;
        }
        var etisalida=generarSalto();
        this.condicion.ambitos=temp_ambi;
        var result_condi=this.condicion.getValue(entorno);
        var tipo_condi=this.condicion.getTipe(entorno);
        if(result_condi!=null){
            temp+="//INICIA LA EVALUACION DEL SWITCH\n";
            pool_salida.push(etisalida);
            if(this.lista_cases.length>0){
                //aqui vamos a evaluar cada una de las condiciones
                var control_breakes_continuos=true;
                for(var i=0;i<this.lista_cases.length;i++){
                    this.lista_cases[i].condicion.ambitos=temp_ambi;
                    var result_case=this.lista_cases[i].condicion.getValue(entorno);
                    var case_tipe=this.lista_cases[i].condicion.getTipe(entorno);
                    if(tipo_condi==case_tipe){
                        var etif=generarSalto();
                        if(control_breakes_continuos){
                            temp+=result_condi.cadena;
                            temp+=result_case.cadena;
                            temp+="if("+result_condi.u_etiqueta+"!="+result_case.u_etiqueta+") goto "+etif+";\n";
                        }
                        this.lista_cases[i].ambitos=this.ambitos;
                        this.lista_cases[i].padre=this.padre;
                        this.lista_cases[i].normal=this.normal;
                        var result_case2=this.lista_cases[i].execute(entorno);
                        if(result_case2!=null){
                            temp+=result_case2.cadena;
                            temp+=etif+":\n";
                            control_breakes_continuos=result_case2.u_etiqueta;
                        }
                    }
                }
            }
            if(this.defecto!=null){
                this.defecto.padre=this.padre;
                this.defecto.normal=this.normal;
                this.defecto.ambitos=this.ambitos;
                var result_defecto=this.defecto.execute(entorno);
                if(result_defecto!=null){
                    temp+="//empieza el default\n";
                    temp+=result_defecto.cadena;
                    temp+="//termina el default\n";
                }
            }
            temp+=etisalida+":\n";
            temp+="//FINALIZA LA EVALUACION DEL SWITCH\n";
        }else{
            alert("Error Semantico, en la condicion del switch, tiene que ser una operacion logica o relacional");
        }
        pool_salida.pop()
        result.cadena+=temp;
        return result;
    }
}