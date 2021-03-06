

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
        this.ambitos="";
        this.padre;
        this.normal;
        this.lista_dimensiones;
        this.codigo=codigo;
        codigo++;
    }
    getValue(entorno){
        if(this.unario){
            var temp="";
            this.exp1.ambitos=this.ambitos;
            this.exp1.padre=this.padre;
            this.exp1.normal=this.normal;
            var temp_ambi="";
            if(this.padre=="main"){
                temp_ambi=this.ambitos+"/"+this.padre;
            }else{
                temp_ambi=this.ambitos;
            }
            this.exp1.ambitos=temp_ambi;
            var result1=this.exp1.getValue(entorno);
            var tipo1=this.exp1.getTipe(entorno);
            if(this.operador=="-"){
                if(tipo1==PrimitiveType.INTEGER){
                    result1.cadena=result1.u_etiqueta+"=-"+result1.valor+";\n";
                    this.tipoprimitivo=tipo1;
                    return result1;
                }else if(tipo1==PrimitiveType.DOUBLE){
                    result1.cadena=result1.u_etiqueta+"=-"+result1.valor+";\n";
                    this.tipoprimitivo=tipo1;
                    return result1;
                }else{
                    alert("Error semantico, en el tipo unario -");
                    var errores_1=new Errores("Semantico","Error en el operador unario",0,0);
                    lista_errores.push(errores_1);
                }
            }else if(this.operador=="++"){
                var result=new Result();
                if(tipo1.toUpperCase()=="INTEGER"||tipo1.toUpperCase()=="DOUBLE"||tipo1.toUpperCase()=="CHAR"){
                    temp+=result1.cadena;
                    temp+=result1.u_etiqueta+"="+result1.u_etiqueta+"+1;\n";
                    var sim=entorno.obtener(this.exp1.valor+"_"+temp_ambi);
                    var temp1=generarEtiqueta();
                    var simulado=generarEtiqueta();
                    temp+=simulado+"=p+"+sim.posRel+";\n";
                    temp+=temp1+"=stack["+simulado+"];\n";//en esta posicion esta almacenado el puntero h que contiene al numero
                    temp+="heap["+temp1+"]="+result1.u_etiqueta+";\n";
                    result.u_etiqueta=result1.u_etiqueta;
                    result.cadena+=temp;
                    this.tipoprimitivo=tipo1.toUpperCase();
                }else{
                    alert("Error Semantico, la operacion incrementar solo se puede realizar a integer, double y char");
                    var errores_1=new Errores("Semantico","La operacion incrementar solo se puede realizar a integer, double y char",0,0);
                    lista_errores.push(errores_1);
                }
                return result;
            }else if(this.operador=="--"){
                var result=new Result();
                if(tipo1.toUpperCase()=="INTEGER"||tipo1.toUpperCase()=="DOUBLE"||tipo1.toUpperCase()=="CHAR"){
                    temp+=result1.cadena;
                    temp+=result1.u_etiqueta+"="+result1.u_etiqueta+"-1;\n";
                    var sim=entorno.obtener(this.exp1.valor+"_"+temp_ambi);
                    var temp1=generarEtiqueta();
                    var simulado=generarEtiqueta();
                    temp+=simulado+"=p+"+sim.posRel+";\n";
                    temp+=temp1+"=stack["+simulado+"];\n";//en esta posicion esta almacenado el puntero h que contiene al numero
                    temp+="heap["+temp1+"]="+result1.u_etiqueta+";\n";
                    result.u_etiqueta=temp1;
                    result.cadena+=temp;
                    this.tipoprimitivo=tipo1.toUpperCase();
                }else{
                    alert("Error Semantico, la operacion decrementar solo se puede realizar a integer, double y char");
                    var errores_1=new Errores("Semantico","La operacion decrementar solo se puede realizar a integer, double y char",0,0);
                    lista_errores.push(errores_1);
                }
                return result;
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
                var tipo=generarTipo(tipo1,tipo2);
                if(tipo!=null){
                    if(this.operador=="+"){
                        if(tipo=="STRING"){
                            var result=new Result();
                            result.cadena+=result1.cadena+result2.cadena;
                            if(tipo1=="STRING"&&tipo2=="STRING"){
                                var temp_unir=unirString(result1.u_etiqueta,result2.u_etiqueta);
                                result.cadena+=temp_unir.cadena;
                                result.u_etiqueta=temp_unir.u_etiqueta;
                            }else if(tipo1=="STRING"&&tipo2!="STRING"){
                                //primero es string el segundo no es string
                                var result_temp;
                                if(tipo2=="INTEGER"){
                                    result_temp=generarString(result2.u_etiqueta,true,"INTEGER");
                                }else if(tipo2=="CHAR"){
                                    
                                    result_temp=generarString(result2.u_etiqueta,true,"CHAR");
                                }else if(tipo2=="BOOLEAN"){
                                    result_temp=generarString(result2.u_etiqueta,true,"BOOLEAN");
                                }else if(tipo2=="DOUBLE"){
                                    result_temp=generarString(result2.u_etiqueta,true,"DOUBLE");
                                }
                                result.cadena+=result_temp.cadena;
                                var temp_unir=unirString(result1.u_etiqueta,result_temp.u_etiqueta);
                                result.cadena+=temp_unir.cadena;
                                result.u_etiqueta=temp_unir.u_etiqueta;
                            }else if(tipo1!="STRING"&&tipo2=="STRING"){
                                var result_temp;
                                if(tipo1=="INTEGER"){
                                    result_temp=generarString(result1.u_etiqueta,true,"INTEGER");
                                }else if(tipo1=="CHAR"){
                                    result_temp=generarString(result1.u_etiqueta,true,"CHAR");
                                }else if(tipo1=="BOOLEAN"){
                                    result_temp=generarString(result1.u_etiqueta,true,"BOOLEAN");
                                }else if(tipo1=="DOUBLE"){
                                    result_temp=generarString(result1.u_etiqueta,true,"DOUBLE");
                                }
                                result.cadena+=result_temp.cadena;
                                var temp_unir=unirString(result_temp.u_etiqueta,result2.u_etiqueta);
                                result.cadena+=temp_unir.cadena;
                                result.u_etiqueta=temp_unir.u_etiqueta;
                            }else{
                                alert("este else no deberia de aparecer");
                            }
                            this.tipoprimitivo=PrimitiveType.STRING;
                            return result;
                        }else if(tipo=="INTEGER"){
                            var result=new Result();
                            result.u_etiqueta=generarEtiqueta();
                            result.cadena=result1.cadena+result2.cadena;
                            result.cadena+=result.u_etiqueta+"="+result1.u_etiqueta+"+"+result2.u_etiqueta+";\n";
                            this.tipoprimitivo=PrimitiveType.INTEGER;
                            result.valor=result.u_etiqueta;
                            return result;
                        }else if(tipo=="DOUBLE"){
                            var result=new Result();
                            result.u_etiqueta=generarEtiqueta();
                            result.cadena=result1.cadena+result2.cadena;
                            result.cadena+=result.u_etiqueta+"="+result1.u_etiqueta+"+"+result2.u_etiqueta+";\n";
                            this.tipoprimitivo=PrimitiveType.DOUBLE;
                            result.valor=result.u_etiqueta;
                            return result;
                        }else if(tipo=="CHAR"){
                            var result=new Result();
                            result.u_etiqueta=generarEtiqueta();
                            result.cadena=result1.cadena+result2.cadena;
                            result.cadena+=result.u_etiqueta+"="+result1.u_etiqueta+"+"+result2.u_etiqueta+";\n";
                            this.tipoprimitivo=PrimitiveType.CHAR;
                            result.valor=result.u_etiqueta;
                            return result;
                        }else{
                            alert("Error semantico: Tipo no soportado para suma");
                            var errores_1=new Errores("Semantico","Tipo no soportado para suma",0,0);
                            lista_errores.push(errores_1);
                            return null;
                        }
                    }else if(this.operador=="-"){
                         if(tipo=="INTEGER"){
                            var result=new Result();
                            result.u_etiqueta=generarEtiqueta();
                            result.cadena=result1.cadena+result2.cadena;
                            result.cadena+=result.u_etiqueta+"="+result1.u_etiqueta+"-"+result2.u_etiqueta+";\n";
                            this.tipoprimitivo=PrimitiveType.INTEGER;
                            result.valor=result.u_etiqueta;
                            return result;
                        }else if(tipo=="DOUBLE"){
                            var result=new Result();
                            result.u_etiqueta=generarEtiqueta();
                            result.cadena=result1.cadena+result2.cadena;
                            result.cadena+=result.u_etiqueta+"="+result1.u_etiqueta+"-"+result2.u_etiqueta+";\n";
                            this.tipoprimitivo=PrimitiveType.INTEGER;
                            result.valor=result.u_etiqueta;
                            return result;
                        }else if(tipo=="CHAR"){
                            var result=new Result();
                            result.u_etiqueta=generarEtiqueta();
                            result.cadena=result1.cadena+result2.cadena;
                            result.cadena+=result.u_etiqueta+"="+result1.u_etiqueta+"-"+result2.u_etiqueta+";\n";
                            this.tipoprimitivo=PrimitiveType.CHAR;
                            result.valor=result.u_etiqueta;
                            return result;
                        }else{
                            alert("Error semantico: Tipo no soportado para resta");
                            var errores_1=new Errores("Semantico","Tipo no soportado para resta",0,0);
                            lista_errores.push(errores_1);
                        }
                    }else if(this.operador=="*"){
                        if(tipo=="INTEGER"){
                            var result=new Result();
                            result.u_etiqueta=generarEtiqueta();
                            result.cadena=result1.cadena+result2.cadena;
                            result.cadena+=result.u_etiqueta+"="+result1.u_etiqueta+"*"+result2.u_etiqueta+";\n";
                            this.tipoprimitivo=PrimitiveType.INTEGER;
                            result.valor=result.u_etiqueta;
                            return result;
                        }else if(tipo=="DOUBLE"){
                            var result=new Result();
                            result.u_etiqueta=generarEtiqueta();
                            result.cadena=result1.cadena+result2.cadena;
                            result.cadena+=result.u_etiqueta+"="+result1.u_etiqueta+"*"+result2.u_etiqueta+";\n";
                            this.tipoprimitivo=PrimitiveType.INTEGER;
                            result.valor=result.u_etiqueta;
                            return result;
                        }else if(tipo=="CHAR"){
                            var result=new Result();
                            result.u_etiqueta=generarEtiqueta();
                            result.cadena=result1.cadena+result2.cadena;
                            result.cadena+=result.u_etiqueta+"="+result1.u_etiqueta+"*"+result2.u_etiqueta+";\n";
                            this.tipoprimitivo=PrimitiveType.CHAR;
                            result.valor=result.u_etiqueta;
                            return result;
                        }else{
                            alert("Error semantico: Tipo no soportado para multiplicacion");
                            var errores_1=new Errores("Semantico","Error en el operador unario",0,0);
                            lista_errores.push(errores_1);
                        }
                    }else if(this.operador=="/"){
                        if(tipo=="INTEGER"){
                            var result=new Result();
                            result.u_etiqueta=generarEtiqueta();
                            result.cadena=result1.cadena+result2.cadena;
                            result.cadena+=result.u_etiqueta+"="+result1.u_etiqueta+"/"+result2.u_etiqueta+";\n";
                            this.tipoprimitivo=PrimitiveType.DOUBLE;
                            result.valor=result.u_etiqueta;
                            return result;
                        }else if(tipo=="DOUBLE"){
                            var result=new Result();
                            result.u_etiqueta=generarEtiqueta();
                            result.cadena=result1.cadena+result2.cadena;
                            result.cadena+=result.u_etiqueta+"="+result1.u_etiqueta+"/"+result2.u_etiqueta+";\n";
                            this.tipoprimitivo=PrimitiveType.INTEGER;
                            result.valor=result.u_etiqueta;
                            return result;
                        }else if(tipo=="CHAR"){
                            var result=new Result();
                            result.u_etiqueta=generarEtiqueta();
                            result.cadena=result1.cadena+result2.cadena;
                            result.cadena+=result.u_etiqueta+"="+result1.u_etiqueta+"/"+result2.u_etiqueta+";\n";
                            this.tipoprimitivo=PrimitiveType.CHAR;
                            result.valor=result.u_etiqueta;
                            return result;
                        }else{
                            alert("Error Semantico, operacion no soportada");
                            var errores_1=new Errores("Semantico","Error semantico: Operacion no soportada",0,0);
                            lista_errores.push(errores_1);
                        }
                    }else if(this.operador=="^"){
                        if(tipo=="INTEGER"){
                            var result=new Result();
                            result.cadena=result1.cadena+result2.cadena;
                            var etc=generarSalto();
                            var etv=generarSalto();
                            var etf=generarSalto();
                            result.u_etiqueta=generarEtiqueta();
                            result.cadena+=result.u_etiqueta+"="+result1.u_etiqueta+";\n";
                            result.cadena+=etc+":\n";
                            result.cadena+="if("+result2.u_etiqueta+">1) goto "+etv+";\n";
                            result.cadena+="goto "+etf+";\n";
                            result.cadena+=etv+":\n";
                            result.cadena+=result2.u_etiqueta+"="+result2.u_etiqueta+"-1;\n";
                            result.cadena+=result.u_etiqueta+"="+result.u_etiqueta+"*"+result1.u_etiqueta+";\n";
                            result.cadena+="goto "+etc+";\n";
                            result.cadena+=etf+":\n";
                            this.tipoprimitivo=PrimitiveType.INTEGER;
                            result.valor=result.u_etiqueta;
                            return result;
                        }else if(tipo=="DOUBLE"){
                            var result=new Result();
                            result.cadena=result1.cadena+result2.cadena;
                            var etc=generarSalto();
                            var etv=generarSalto();
                            var etf=generarSalto();
                            result.u_etiqueta=generarEtiqueta();
                            result.cadena+=result.u_etiqueta+"="+result1.u_etiqueta+";\n";
                            result.cadena+=etc+":\n";
                            result.cadena+="if("+result2.u_etiqueta+">=0) goto "+etv+";\n";
                            result.cadena+="goto "+etf+";\n";
                            result.cadena+=etv+":\n";
                            result.cadena+=result2.u_etiqueta+"="+result2.u_etiqueta+"-1;\n";
                            result.cadena+=result.u_etiqueta+"="+result.u_etiqueta+"*"+result.u_etiqueta+";\n";
                            result.cadena+="goto "+etc+";\n";
                            result.cadena+=etf+":\n";
                            this.tipoprimitivo=PrimitiveType.INTEGER;
                            result.valor=result.u_etiqueta;
                            return result;
                        }else if(tipo=="CHAR"){
                            var result=new Result();
                            result.cadena=result1.cadena+result2.cadena;
                            var etc=generarSalto();
                            var etv=generarSalto();
                            var etf=generarSalto();
                            result.u_etiqueta=generarEtiqueta();
                            result.cadena+=result.u_etiqueta+"="+result1.u_etiqueta+";\n";
                            result.cadena+=etc+":\n";
                            result.cadena+="if("+result2.u_etiqueta+">=0) goto "+etv+";\n";
                            result.cadena+="goto "+etf+";\n";
                            result.cadena+=etv+":\n";
                            result.cadena+=result2.u_etiqueta+"="+result2.u_etiqueta+"-1;\n";
                            result.cadena+=result.u_etiqueta+"="+result.u_etiqueta+"*"+result.u_etiqueta+";\n";
                            result.cadena+="goto "+etc+";\n";
                            result.cadena+=etf+":\n";
                            this.tipoprimitivo=PrimitiveType.INTEGER;
                            result.valor=result.u_etiqueta;
                            return result;
                        }else{
                            alert("Error semantico: Operacion no soportada");
                            var errores_1=new Errores("Semantico","Error Semantico, Operacion no soportada",0,0);
                            lista_errores.push(errores_1);
                        }
                    }else if(this.operador=="%"){
                        if(tipo=="INTEGER"){
                            var result=new Result();
                            result.u_etiqueta=generarEtiqueta();
                            result.cadena=result1.cadena+result2.cadena;
                            result.cadena+=result.u_etiqueta+"="+result1.u_etiqueta+"%"+result2.u_etiqueta+";\n";
                            this.tipoprimitivo=PrimitiveType.INTEGER;
                            result.valor=result.u_etiqueta;
                            return result;
                        }else if(tipo=="DOUBLE"){
                            var result=new Result();
                            result.u_etiqueta=generarEtiqueta();
                            result.cadena=result1.cadena+result2.cadena;
                            result.cadena+=result.u_etiqueta+"="+result1.u_etiqueta+"%"+result2.u_etiqueta+";\n";
                            this.tipoprimitivo=PrimitiveType.DOUBLE;
                            result.valor=result.u_etiqueta;
                            return result;
                        }else if(tipo=="CHAR"){
                            var result=new Result();
                            result.u_etiqueta=generarEtiqueta();
                            result.cadena=result1.cadena+result2.cadena;
                            result.cadena+=result.u_etiqueta+"="+result1.u_etiqueta+"%"+result2.u_etiqueta+";\n";
                            this.tipoprimitivo=PrimitiveType.CHAR;
                            result.valor=result.u_etiqueta;
                            return result;
                        }else{
                            alert("Error semantico: Operacion no soportada");
                            var errores_1=new Errores("Semantico","Operacion no soportada aritmeticas",0,0);
                            lista_errores.push(errores_1);
                        }
                    }else{
                        console.log("Error semantico: Operador no soportado op: "+this.operador);
                        var errores_1=new Errores("Semantico"," Operador no soportado "+this.operador,0,0);
                        lista_errores.push(errores_1);
                    }
                }else{
                    console.log("Error semantico Aritmetica: no se pueden operar los tipos t1:"+tipo1+" t2: "+tipo2);
                    var errores_1=new Errores("Semantico","No se pueden operar los tipos t1:"+tipo1+" t2: "+tipo2,0,0);
                    lista_errores.push(errores_1);
                }
            }else{
                //es una valor implicito
                if(this.tipoprimitivo==PrimitiveType.STRING){
                    var result=new Result();
                    result.u_etiqueta=generarEtiqueta();
                    result.cadena=result.u_etiqueta+"=h;\n";
                    var respu=generarString2(this.valor);
                    result.cadena+=respu;
                    result.valor=this.valor;
                    return result;
                }else if(this.tipoprimitivo=="ID"){
                    var result=new Result();
                    var temp="";
                    var sim=entorno.obtener(this.valor+"_"+this.ambitos);
                    if(sim==null){
                        alert("Error Semantico, No existe el id que se busca "+this.valor+"_"+this.ambitos);
                        var errores_1=new Errores("Semantico","No existe el id que se busca "+this.valor+"_"+this.ambitos,0,0);
                            lista_errores.push(errores_1);
                    }else{
                        var temp1=generarEtiqueta();
                        var simulado=generarEtiqueta();
                        temp+=simulado+"=p+"+sim.posRel+";\n";
                        temp+=temp1+"=stack["+simulado+"];\n";//en esta posicion esta almacenado el puntero h que contiene al numero
                        var temp2=generarEtiqueta();
                        temp+=temp2+"=heap["+temp1+"];\n";
                        if(sim.lista_dimensiones.length>0){
                            result.u_etiqueta=temp1;
                            result.lista_dimensiones=sim.lista_dimensiones;
                        }else{
                            result.u_etiqueta=temp2;
                        }
                        result.cadena+=temp;
                        this.tipoprimitivo=sim.tipo;
                    }
                    return result;
                }else if(this.tipoprimitivo=="ARRAY"){
                    //aqui tomo el valor originar que quiero copiar y lo tengo que almacenar en otra ubicacion, y devuelvo el valor del h para poder asignarlo
                    var result=new Result();
                    var temp="";
                    var sim=entorno.obtener(this.valor+"_"+this.ambitos);
                    if(sim!=null){
                       // if(numerico(sim.tipo)){
                            var eti_principio=generarEtiqueta();
                            var simulado=generarEtiqueta();
                            temp+=simulado+"=p+"+sim.posRel+";\n";
                            temp+=eti_principio+"=stack["+simulado+"];\n";
                            if(sim.lista_dimensiones.length==this.lista_dimensiones.length){
                                if(sim.lista_dimensiones.length==1){
                                    //cuando es de una sola dimension
                                    //sim es el tamanio total
                                    this.lista_dimensiones[0].ambitos=sim.entorno;
                                    var posx=this.lista_dimensiones[0].getValue(entorno);
                                    var postemp=generarEtiqueta();
                                    temp+=posx.cadena;
                                    temp+=postemp+"="+eti_principio+"+"+posx.u_etiqueta+";\n";
                                    var val=generarEtiqueta();
                                    temp+=val+"=heap["+postemp+"];\n";
                                    this.tipoprimitivo=sim.tipo;
                                    result.u_etiqueta=val;
                                    result.cadena+=temp;
                                }else if(sim.lista_dimensiones.length==2){
                                    var tempx;
                                    var posfinal=generarEtiqueta();
                                    for(var y=0;y<this.lista_dimensiones.length;y++){
                                        this.lista_dimensiones[y].ambitos=sim.entorno;
                                        if(y==0){
                                            tempx=this.lista_dimensiones[y].getValue(entorno);
                                            temp+=tempx.cadena;
                                        }else{
                                            var tempy=this.lista_dimensiones[y].getValue(entorno);
                                            temp+=tempy.cadena;
                                            sim.lista_dimensiones[y].ambitos=sim.ambitos;
                                            var tamy=sim.lista_dimensiones[y].getValue(entorno);
                                            temp+=tamy.cadena;
                                            temp+=posfinal+"="+tempx.u_etiqueta+"*"+tamy.u_etiqueta+";\n";
                                            temp+=posfinal+"="+posfinal+"+"+tempy.u_etiqueta+";\n";
                                        }
                                    }
                                    var postemp=generarEtiqueta();
                                    temp+=postemp+"="+eti_principio+"+"+posfinal+";\n";
                                    var val=generarEtiqueta();
                                    temp+=val+"=heap["+postemp+"];\n";
                                    result.u_etiqueta=val;
                                    result.cadena+=temp;
                                    this.tipoprimitivo=sim.tipo;
                                }else{
                                    var tempx;
                                    var posfinal=generarEtiqueta();
                                    for(var y=0;y<this.lista_dimensiones.length;y++){
                                        this.lista_dimensiones[y].ambitos=sim.entorno;
                                        if(y==0){
                                            tempx=this.lista_dimensiones[y].getValue(entorno);
                                            temp+=tempx.cadena;
                                            var tamx=sim.lista_dimensiones[y].getValue(entorno);
                                            temp+=tamx.cadena;
                                            temp+=posfinal+"="+tempx.u_etiqueta+"*"+tamx.u_etiqueta+";\n";
                                        }else{
                                            var tempy=this.lista_dimensiones[y].getValue(entorno);
                                            temp+=tempy.cadena;
                                            sim.lista_dimensiones[y].ambitos=sim.ambitos;
                                            var tamy=sim.lista_dimensiones[y].getValue(entorno);
                                            temp+=tamy.cadena;
                                            temp+=posfinal+"="+posfinal+"+"+tempy.u_etiqueta+";\n";
                                            if(y<this.lista_dimensiones.length-1){
                                                temp+=posfinal+"="+posfinal+"*"+tamy.u_etiqueta+";\n";
                                            }
                                        }
                                    }
                                    var postemp=generarEtiqueta();
                                    temp+=postemp+"="+eti_principio+"+"+posfinal+";\n";
                                    var val=generarEtiqueta();
                                    temp+=val+"=heap["+postemp+"];\n";
                                    result.u_etiqueta=val;
                                    result.cadena+=temp;
                                    this.tipoprimitivo=sim.tipo;
                                }
                            }else{
                                alert("Error Semantico, las dimensiones no coindicen");
                                var errores_1=new Errores("Semantico","Las dimensiones no coinciden",0,0);
                                lista_errores.push(errores_1);
                            }
                        /*}else{


                            alert("Error Semantico, El elemento que quiere acceder es un arreglo de objetos");
                        }*/
                    }else{
                        alert("Error Semantico, No existe el arreglo que se busca");
                        var errores_1=new Errores("Semantico","No existe el arreglo que se busca",0,0);
                            lista_errores.push(errores_1);
                    }
                    return result;
                }else{
                    var result=new Result();
                    result.u_etiqueta=generarEtiqueta();
                    if(this.tipoprimitivo==PrimitiveType.CHAR){
                        result.cadena+=result.u_etiqueta+"="+this.valor.charCodeAt(1)+";\n";
                        result.valor=this.valor.charCodeAt(1);
                    }else if(this.tipoprimitivo==PrimitiveType.BOOLEAN){
                        if(this.valor=='true'){
                            result.valor=1;
                        }else{
                            result.valor=0;
                        }
                        result.cadena+=result.u_etiqueta+"="+result.valor+";\n";
                    }else if(this.tipoprimitivo=="NULO"){
                        result.valor=-1;
                        result.cadena+=result.u_etiqueta+"="+result.valor+";\n";
                    }else{
                        result.cadena+=result.u_etiqueta+"="+this.valor+";\n";
                        result.valor=this.valor;
                    }
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

function unirString(h1,h2){
    var respuesta=new Result();
    var res="//INICIA UNION DE STRINGS\n";
    var h_enviar=generarEtiqueta();
    res+=h_enviar+"=h;\n";
    var etig1=generarSalto();
    var temp1=generarEtiqueta();
    res+=etig1+":\n";
    res+=temp1+"=heap["+h1+"];\n";
    var etiv1=generarSalto();
    res+="if("+temp1+"==0) goto "+etiv1+";\n";
    res+="heap[h]="+temp1+";\n";
    res+="h=h+1;\n";
    res+=h1+"="+h1+"+1;\n";
    res+="goto "+etig1+";\n";
    res+=etiv1+":\n";//aqui empieza a analizar la segunda cadena
    res+=temp1+"=heap["+h2+"];\n";
    var etiv2=generarSalto();
    res+="if("+temp1+"==0) goto "+etiv2+";\n";
    res+="heap[h]="+temp1+";\n";
    res+="h=h+1;\n";
    res+=h2+"="+h2+"+1;\n";
    res+="goto "+etiv1+";\n";
    res+=etiv2+":\n";
    res+="heap[h]=0;\n";
    res+="h=h+1;\n";
    res+="//FINALIZA UNION DE STRINGS\n";
    respuesta.cadena=res;
    respuesta.u_etiqueta=h_enviar;
    return respuesta;
}

function generarString(cadena,bandera,tipo){
    var result=new Result();
    var respuesta="";
    cadena=String(cadena).replace(/['"]+/g, '');
    if(tipo=="INTEGER"){
        //aca va el codigo que me dio fernando
        var puntero_simulado=generarEtiqueta();
        respuesta+=puntero_simulado+"=p+2;\n";//ambito simulado
        respuesta+=puntero_simulado+"="+puntero_simulado+"+1;\n";
        respuesta+="stack["+puntero_simulado+"]="+cadena+";\n";
        respuesta+="p=p+2;\n";
        respuesta+="call enteroString;\n";
        var temp=generarEtiqueta();
        respuesta+=temp+"=p+0;\n";
        var temp2=generarEtiqueta();//aqui se encuentra el puntero a heap que tiene el entero ya convertido
        respuesta+=temp2+"=stack["+temp+"];//en esta posicion se encuentra el puntero h del numero que se convirtio\n";
        respuesta+="p=p-2;//se regresa al ambito actual, se mueven dos posiciones por el this y el return\n";
        respuesta+="//-------------------------finaliza casteo entero a cadena\n";
        //inicia el cambio de posiciones del anterior heap al nuevo heap
        var temp_heap=generarEtiqueta();
        respuesta+=temp_heap+"=h;\n";
        var etig=generarSalto();
        respuesta+=etig+":\n";
        var t1=generarEtiqueta();
        respuesta+=t1+"=heap["+temp2+"];\n";
        var etisalida=generarSalto();
        respuesta+="if("+t1+"==0) goto "+etisalida+";\n";
        respuesta+="heap[h]="+t1+";\n";
        respuesta+="h=h+1;\n";
        respuesta+=temp2+"="+temp2+"+1;\n";
        respuesta+="goto "+etig+";\n";
        respuesta+=etisalida+":\n";
        result.u_etiqueta=temp_heap;
    }else if(tipo=="CHAR"){
        var temp_heap=generarEtiqueta();
        respuesta+=temp_heap+"=h;\n";
        respuesta+="heap[h]="+cadena+";\n";
        respuesta+="h=h+1;\n";
        result.u_etiqueta=temp_heap;
    }else if(tipo=="BOOLEAN"){
        var temp_heap=generarEtiqueta();
        respuesta+=temp_heap+"=h;\n";
        var etiv=generarSalto();
        var etif=generarSalto();
        respuesta+="if("+cadena+"==0) goto "+etiv+";\n";
        //true
        respuesta+="heap[h]=116;\n";
        respuesta+="h=h+1;\n";
        respuesta+="heap[h]=114;\n";
        respuesta+="h=h+1;\n";
        respuesta+="heap[h]=117;\n";
        respuesta+="h=h+1;\n";
        respuesta+="heap[h]=101;\n";
        respuesta+="h=h+1;\n";
        respuesta+="goto "+etif+";\n";
        //false
        respuesta+=etiv+":\n";
        respuesta+="heap[h]=102;\n";
        respuesta+="h=h+1;\n";
        respuesta+="heap[h]=97;\n";
        respuesta+="h=h+1;\n";
        respuesta+="heap[h]=108;\n";
        respuesta+="h=h+1;\n";
        respuesta+="heap[h]=115;\n";
        respuesta+="h=h+1;\n";
        respuesta+="heap[h]=101;\n";
        respuesta+="h=h+1;\n";
        respuesta+=etif+":\n";
        result.u_etiqueta=temp_heap;
    }else if(tipo=="DOUBLE"){
        var puntero_simulado=generarEtiqueta();
        respuesta+=puntero_simulado+"=p+2;\n";//ambito simulado
        respuesta+=puntero_simulado+"="+puntero_simulado+"+1;\n";
        respuesta+="stack["+puntero_simulado+"]="+cadena+";\n";
        respuesta+="p=p+2;\n";
        respuesta+="call doubleString;\n";
        var temp=generarEtiqueta();
        respuesta+=temp+"=p+0;\n";
        var temp2=generarEtiqueta();//aqui se encuentra el puntero a heap que tiene el entero ya convertido
        respuesta+=temp2+"=stack["+temp+"];//en esta posicion se encuentra el puntero h del numero que se convirtio\n";
        respuesta+="p=p-2;//se regresa al ambito actual, se mueven dos posiciones por el this y el return\n";
        respuesta+="//-------------------------finaliza casteo entero a cadena\n";
        //inicia el cambio de posiciones del anterior heap al nuevo heap
        var temp_heap=generarEtiqueta();
        respuesta+=temp_heap+"=h;\n";
        var etig=generarSalto();
        respuesta+=etig+":\n";
        var t1=generarEtiqueta();
        respuesta+=t1+"=heap["+temp2+"];\n";
        var etisalida=generarSalto();
        respuesta+="if("+t1+"==0) goto "+etisalida+";\n";
        respuesta+="heap[h]="+t1+";\n";
        respuesta+="h=h+1;\n";
        respuesta+=temp2+"="+temp2+"+1;\n";
        respuesta+="goto "+etig+";\n";
        respuesta+=etisalida+":\n";
        result.u_etiqueta=temp_heap;
    }
    if(bandera==true){
        respuesta+="heap[h]=0;\n";
        respuesta+="h=h+1;\n";
    }
    result.cadena=respuesta;
    return result;
}
function generarString2(cadena){
    var respuesta="";
    cadena=String(cadena).replace(/['"]+/g, '');
    for(var i=0;i<cadena.length;i++){
        respuesta+="heap[h]="+cadena.charCodeAt(i)+";\n";
        respuesta+="h=h+1;\n";
    }
    respuesta+="heap[h]=0;\n";
    respuesta+="h=h+1;\n";
    return respuesta;
}


function numero_cadena(){
    var temp="";
        var etiv1=generarSalto();
        var etif1=generarSalto();
        var temp_negativo=generarEtiqueta();
        temp+="if("+cadena+"<0) goto "+etiv1+";\n";
        temp+="goto "+etif1+";\n";
        //principio numero negativo
        temp+=etiv1+":\n";
        temp+=temp_negativo+"=-1;\n";
        temp+=cadena+"="+cadena+"*"+temp_negativo+"\n";
        temp+="goto "+etif1+";\n";
        //fin numero negativo
        temp+=etif1+":\n";
        var etiv2=generarSalto();
        var etif2=generarSalto();
        temp+="if("+cadena+"==0) goto "+etiv2+";\n";
        temp+="goto "+etif2+";\n";
        temp+=etiv2+":\n";
        var puntero_h1=generarEtiqueta();//t77
        temp+=puntero_h1+"=h;\n";
        temp+="heap[h]=48;\n";
        temp+="h=h+1;\n";
        var temp_fin=generarSalto();
        temp+="goto "+temp_fin+";\n";
        //finaliza la operacion de conversion
        temp+=temp_fin+":\n";
        temp+="heap[h]=0;\n";
        temp+="h=h+1;\n";
        var temp_retorno=generarEtiqueta();
        temp+=temp_retorno+"=p+0;\n";
        temp+="stack["+temp_retorno+"]="+puntero_h1+";\n";
        temp+="";
        respuesta+=temp;
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