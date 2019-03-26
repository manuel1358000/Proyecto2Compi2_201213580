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
            //es una operacion unaria
            console.log("operacion unaria");
        }else{
            if(this.exp1!=null&&this.exp2!=null){
                var valor1=exp1.getValue(entorno);
                var e_tipo=exp1.getTipe(entorno);
                var valor2=exp2.getValue(entorno);
                var e_tipo2=exp2.getTipe(entorno);
                var tipo_generado=generarTipo(e_tipo,e_tipo2,this.operador);
                if(tipo_generado!=null){
                    console.log("El tipo generado es"+tipo_generado);
                }else{
                    console.log("No se pueden operar los valores");
                }
            }else{
                //es una valor implicito
                return this.valor;
            }
        }   
    }
    getTipe(entorno){
        return this.tipo;
    }
    generarTipo(tipo1,tipo2,operacion){
        

    }
}