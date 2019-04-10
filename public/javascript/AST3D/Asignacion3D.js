//aqui vamos a realizar las declaracion que incluyen las operaciones aritmeticas y relacionales
class Asignacion3D{
    //id,exp1,tipo,acceso
    constructor(id,exp1,tipo,acceso){
        this.id,id;//esta es la etiqueta que va a ser asignada
        this.exp1=exp1;///expresion que tiene el valor a asignar
        this.acceso=acceso;//este acceso sirve para cuando sea un acceso a heap, puede ser una etiqueta, un valor puntual, h o p
        this.tipo=tipo;//esto contiene el tipo que tiene la asignacion, esta puede ser un ptr_p,ptr_h,a_heap,a_stack,etiqueta
    }
}