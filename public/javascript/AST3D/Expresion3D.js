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

            }else{
                //es un valor puntual
                return this.exp1;
            }

        }
    }
}