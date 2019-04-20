
class Selecciona{
    constructor(condicion,lista_cases,defecto){
        this.condicion=condicion;
        this.lista_cases=lista_cases;
        this.defecto=defecto;
        this.ambitos="";
    }
    execute(entorno){
        var control=false;
        var result=new Result();
        var temp="";
        var etisalida=generarSalto();
        this.condicion.ambitos=this.ambitos;
        var result_condi=this.condicion.getValue(entorno);
        var tipo_condi=this.condicion.getTipe(entorno);
        if(result_condi!=null){
            temp+="//INICIA LA EVALUACION DEL SWITCH\n";
            pool_salida.push(etisalida);
            if(this.lista_cases.length>0){
                //aqui vamos a evaluar cada una de las condiciones
                
                for(var i=0;i<this.lista_cases.length;i++){
                    this.lista_cases[i].condicion.ambitos=this.ambitos;
                    var result_case=this.lista_cases[i].condicion.getValue(entorno);
                    var case_tipe=this.lista_cases[i].condicion.getTipe(entorno);
                    if(tipo_condi==case_tipe){
                        var etif=generarSalto();
                        temp+=result_condi.cadena;
                        temp+=result_case.cadena;
                        temp+="if("+result_condi.u_etiqueta+"!="+result_case.u_etiqueta+") goto "+etif+";\n";
                        var result_case2=this.lista_cases[i].execute(entorno);
                        if(result_case2!=null){
                            temp+=result_case2.cadena;
                            temp+=etif+":\n";
                        }
                    }
                }
            }
            if(this.defecto!=null){
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
        result.cadena+=temp;
        return result;
    }
}