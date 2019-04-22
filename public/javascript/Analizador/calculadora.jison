
/* description: Parses and executes mathematical expressions. */

/* lexical grammar */
%lex
%%

\s+                   /* skip whitespace */

"variable"          return 'VARIABLE'
"metodo"            return 'METODO'
"constructor"       return 'CONSTRUCTOR'
"int"               return 'INT'
"string"            return 'STRING'
"double"            return 'DOUBLE'
"char"              return 'CHAR'
"boolean"           return 'BOOLEAN'
"void"              return 'VOID'
"public"            return 'PUBLIC'
"static"            return 'STATIC'
"final"             return 'FINAL'
"private"           return 'PRIVATE'
"protected"         return 'PROTECTED'
"abstract"          return 'ABSTRACT'
"new"               return 'NEW'
"class"             return 'CLASS'
"extends"           return 'EXTENDS'
"import"            return 'IMPORT'
"println"           return 'PRINTLN'
"print"             return 'PRINT'
//sentencias control
"if"                return 'IF'
"else"              return 'ELSE'
"switch"            return 'SWITCH'
"case"              return 'CASE'
"do"                return 'DO'
"while"             return 'WHILE'
"for"               return 'FOR'
"default"           return 'DEFAULT'
"break"             return 'BREAK'
//simbolos del lenguaje
"{"                   return '{'
"}"                   return '}'
","                   return ','
"]"                   return ']'
"["                   return '['
":"                   return ':'
";"                   return ';'
"=="                  return '=='
"="                   return '='
//aritmeticas
"*"                   return '*'
"/"                   return '/'
"++"                  return '++'
"--"                  return '--'
"-"                   return '-'
"+"                   return '+'
"pow"                 return 'POW'
"!="                  return '!='
"%"                   return '%'
//relacionales
"<="                  return '<='
">="                  return '>='
">"                   return '>'
"<"                   return '<'
//operaciones logicas
"&&"                  return '&&'
"||"                  return '||'
"!"                   return '!'
"("                   return '('
")"                   return ')'
"true"                return 'TRUE'
"false"               return 'FALSE'
[0-9]+("."[0-9]+)\b   return 'DECIMAL'
[0-9]+                return 'NUMBER'

"\""[^\"\n]*"\""      return 'STRING'
"'"[a-zA-Z][^''\n]*"'" return 'CHAR'
([a-zA-Z]|["_"])([a-zA-Z]|[0-9]|["_"])* return 'ID'
<<EOF>>               return 'EOF'
.                     return 'INVALID'

/lex

/* operator associations and precedence */


%nonassoc '++' '--'
%left '+' '-'
%left '*' '/' '%'
%left 'pow'
%right '!'
%left '&&' '||'
%left '==' '!=' '>' '>=' '<' '<='
%left '(' ')'

%start expressions

%% /* language grammar */

expressions
    : e EOF
        { return $1; }
    ;

e: sentencias_globales{$$=$1;};
sentencias_globales: declaraciones_import sentencias_generales{
                                                            $$=$1;
                                                            for(var i=0;i<$2.length;i++){
                                                                $$.push($2);
                                                            }
                                                            }
                    | sentencias_generales{$$=$1;};

declaraciones_import: declaraciones_import declaracion_import 
                    | declaracion_impor;

declaracion_import: IMPORT STRING ';';

sentencias_generales: declaraciones_clase{$$=$1;};



declaraciones_clase: declaraciones_clase declaracion_clase{
                                                            $$=$1;
                                                            $$.push($2);
                                                            }
                   | declaracion_clase{
                                        $$=[];
                                        $$.push($1);
                                        };

declaracion_clase: modificadores_clase CLASS ID '{' cuerpo_clase '}'{
                                                                    $$=new Declaracionclase($3,$1,"",$5);
                                                                    }
                 | modificadores_clase CLASS ID EXTENDS ID '{' cuerpo_clase '}'{
                                                                                $$=new Declaracionclase($3,$1,$5,$7);
                                                                                }; 
modificadores_clase:{$$=[];}
                    | modificadores_clase2{$$=$1;};
modificadores_clase2: modificadores_clase2 modificador_clase{
                                                            $$=$1;
                                                            $$.push($2);
                                                            }
                    | modificador_clase{
                                        $$=[];
                                        $$.push($1);
                                        };

modificador_clase: PUBLIC{$$=Visibilidad.PUBLIC;}
                 | PROTECTED{$$=Visibilidad.PROTECTED;}
                 | PRIVATE{$$=Visibilidad.PRIVATE;}
                 | ABSTRACT{$$=Visibilidad.ABSTRACT;}
                 | STATIC{$$=Visibilidad.STATIC;}
                 | FINAL{$$=Visibilidad.FINAL;};


cuerpo_clase: cuerpo_clase cuerpo_clase_sentencias{
                                                $$=$1;
                                                for(var i=0;i<$2.length;i++){
                                                    $$.push($2[i]);
                                                }
                                                }
            | cuerpo_clase_sentencias{
                                    $$=$1;
                                    };

cuerpo_clase_sentencias: modificadores declaracion_metodos{
                                                            $$=[];
                                                            $2.modificadores=$1;
                                                            $$.push($2);
                                                        }
                        | declaracion_metodos{
                            $$=[];
                            $$.push($1);
                        }
                        | declaracion_variables{$$=$1;};

declaracion_variables: modificadores variables ';'{
                                                for(var i=0;i<$2.length;i++){
                                                    $2[i].modificadores=$1;
                                                }
                                                $$=$2;
                                              }
                    | variables ';'{
                                $$=$1;
                               };

variables: tipo lista_id {
                                //DECLARACION DE UNA VARIABLE
                                for(var i=0;i<$2.length;i++){
                                    $2[i].tipo=$1;
                                }
                                $$=$2;
                            }
         | ID lista_id {
                            //DECLARACION DE UN OBJETO
                            for(var i=0;i<$2.length;i++){
                                $2[i].tipo=$1;
                            }
                            $$=$2;
                            }
         | tipo lista_id '=' exp {
                                    //DECLARACION ASIGNACION DE UNA VARIABLE
                                    for(var i=0;i<$2.length;i++){
                                        $2[i].tipo=$1;
                                    }
                                    $2[($2.length-1)].iniValue=$4;
                                    $$=$2;
                                    }
         | ID lista_id '=' exp{ 
                                    //DECLARACION ASIGNACION DE UN OBJETO
                                    //aca queda normal, en la parte de expresiones tenemos que agregar las declaracion new objeto();
                                    for(var i=0;i<$2.length;i++){
                                        $2[i].tipo=$1;
                                    }
                                    $2[($2.length-1)].iniValue=$4;
                                    $$=$2;
                                    };

lista_id: lista_id ',' ID{
                        $$=$1;
                        $$.push(new Declaracion(yytext,PrimitiveType.NULO,null,null,0,0,0));
                        }
        | ID{
            $$=[];
            $$.push(new Declaracion(yytext,PrimitiveType.NULO,null,[],0,0,0));
            };

declaracion_metodos: tipo ID '(' lista_parametros ')' '{' cuerpo_metodo '}'{
                                                                            //UN METODO NORMAL
                                                                            $$=new Metodo($2,$1,$7,$4);
                                                                            } 
                   | tipo ID '(' lista_parametros ')' ';'{
                                                        //UN METODO ABSTRACTO NORMAL
                                                        //id,tipo,nodos,parametros
                                                        $$=new Metodo($2,$1,[],$4);
                                                        }
                   | ID ID '(' lista_parametros ')' ';'{
                                                        //UN METODO ABSTRACTO QUE DEVUELVE UN OBJETO
                                                        $$=new Metodo($2,$1,[],$4);
                                                        }
                   | ID ID '(' lista_parametros ')' '{' cuerpo_metodo '}'{
                                                                            //METODO QUE DEVUELVE UN OBJETO
                                                                            $$=new Metodo($2,$1,$7,$4);
                                                                        }
                   | ID '(' lista_parametros ')' '{' cuerpo_metodo '}'{
                                                                        //CONSTRUCTOR
                                                                        $$=new Metodo($1,"VOID",$6,$3);
                                                                        $$.constructor=true;
                                                                    };

cuerpo_metodo: cuerpo_metodo sentencias_metodo{
                                                $$=$1;
                                                for(var i=0;i<$2.length;i++){
                                                    $$.push($2[i]);
                                                }
                                            }
            | sentencias_metodo{
                                $$=$1;
                                };

//-------------------------sentencias dentro de un metodo

sentencias_metodo: variables ';'{$$=$1;}
                 | sentencia_imprimir{
                                    $$=[];
                                    $$.push($1);
                                    }
                 | sentencia_if{
                                    $$=[];
                                    $$.push($1);
                                }
                 | sentencia_switch{
                                    $$=[];
                                    $$.push($1);
                                    }
                 | sentencia_while{
                                    $$=[];
                                    $$.push($1);
                                    }
                 | sentencia_for{
                                $$=[];
                                $$.push($1);
                                }
                 | sentencia_dowhile{
                                    $$=[];
                                    $$.push($1);
                                    }
                 | sentencia_asignacion ';'{
                                            $$=[];
                                            $$.push($1);
                                           }
                 | sentencia_break ';'{
                                    $$=[];
                                    $$.push($1);
                                }
                 | sentencia_incre_decre{
                                        $$=[];
                                        $$.push($1);
                                        };
sentencia_incre_decre: ID '--' ';'{
                                var temp=new Aritmetica(null,null,false,$1,null,Type.ID,0,0);
                                $$=new Aritmetica(temp,null,true,null,"--",null,0,0);
                                }
                        | ID '++' ';'{
                                    var temp=new Aritmetica(null,null,false,$1,null,Type.ID,0,0);
                                    $$=new Aritmetica(temp,null,true,null,"++",null,0,0);
                                }
                        | '--' ID ';'{
                                    var temp=new Aritmetica(null,null,false,$2,null,Type.ID,0,0);
                                    $$=new Aritmetica(temp,null,true,null,"--",null,0,0);
                                    }
                        | '++' ID  ';'{
                                    var temp=new Aritmetica(null,null,false,$2,null,Type.ID,0,0);
                                    $$=new Aritmetica(temp,null,true,null,"++",null,0,0);
                                    };
sentencia_break: BREAK{$$=new Detener($1);};
sentencia_asignacion: ID '=' exp{
                                $$=new Asignacion($1,$3,0);
                                };

//-------------------------------------------SENTENCIA SWITCH
sentencia_switch: SWITCH '(' exp ')' '{' listas_cases case_default '}'{
                                                                    $$=new Selecciona($3,$6,$7);
                                                                    }
                | SWITCH '(' exp ')' '{' listas_cases '}'{
                                                            $$=new Selecciona($3,$6,null);
                                                        };
listas_cases: listas_cases lista_case{
                                        $$=$1;
                                        $$.push($2);
                                    }
            | lista_case{
                        $$=[];
                        $$.push($1);
                        };
lista_case: CASE exp ':' cuerpo_metodo{
                                        $$=new Caso($2,$4);
                                        };
case_default: DEFAULT ':' cuerpo_metodo{
                                        $$=new Caso(null,$3);
                                        };
//-------------------------------------------FIN SWITCH

//-------------------------------------------SENTENCIA WHILE
sentencia_while: WHILE '(' exp ')' '{' cuerpo_metodo '}'{$$=new Mientras($3,$6,true);};
//-------------------------------------------FIN WHILE

//-------------------------------------------SENTENCIA FOR
sentencia_for:FOR '(' for_inicio ';' exp ';' exp ')' '{' cuerpo_metodo '}'{
                                                                            //es un for normal  
                                                                            //inicializado,condicion,aumento,nodos
                                                                            $$=new Para($3,$5,$7,$9);
                                                                            }
            | FOR '(' for_inicio ':' exp ')' '{' cuerpo_metodo '}'{
                                                                    //aqui se va a realizar el foreach
                                                                    };
for_inicio: variables{$$=$1;}
            | sentencia_asignacion{$$=$1;};
//-------------------------------------------FIN FOR 

//-------------------------------------------SENTENCIA DOWHILE
sentencia_dowhile: '{' cuerpo_metodo '}' DO WHILE '(' exp ')' ';'{$$=new Mientras($7,$2,false);};
//-------------------------------------------FIN DOWHILE

//--------------------------------------------SENTENCIA IF
sentencia_if: IF '(' exp ')' '{' cuerpo_metodo '}' sentencia_elseif sentencia_else{
                                                                                    //condicion,nodos,subifs,defecto
                                                                                    $$=new Si($3,$6,$8,$9);
                                                                                    }
            | IF '(' exp ')' '{' cuerpo_metodo '}' sentencia_elseif{
                                                                    //condicion,nodos,subifs,defecto
                                                                    $$=new Si($3,$6,$8,null);
                                                                    }
            | IF '(' exp ')' '{' cuerpo_metodo '}' sentencia_else{
                                                                //condicion,nodos,subifs,defecto
                                                                $$=new Si($3,$6,[],$8);
                                                                }
            | IF '(' exp ')' '{' cuerpo_metodo '}'{
                                                    //condicion,nodos,subifs,defecto
                                                    $$=new Si($3,$6,[],null);
                                                    };

sentencia_else: ELSE '{' cuerpo_metodo '}'{
                                            $$=new Subsi(null,$3);
                                        };

sentencia_elseif: sentencia_elseif ELSE IF '(' exp ')' '{' cuerpo_metodo '}'{
                                                                            $$=$1;
                                                                            $$.push(new Subsi($5,$8));
                                                                            }
                | ELSE IF '(' exp ')' '{' cuerpo_metodo '}'{
                                                            $$=[];
                                                            $$.push(new Subsi($4,$7));
                                                            };
//-------------------------------------------FIN SENTENCIA IF











sentencia_imprimir: PRINT '(' exp ')' ';'{
                                        $$=new Imprimir($3,false);
                                        }
                    | PRINTLN '(' exp ')' ';'{
                                            $$=new Imprimir($3,true);
                                            };
//------------------------- finalizan las sentencias que van dentro de un metodo



//aqui se tiene que agregar las asignaciones
lista_parametros: {$$=[];}
                | parametros{$$=$1;};
parametros: parametros ',' parametro{
                                    $$=$1;
                                    $$.push($3);
                                    }
            | parametro{
                        $$=[];
                        $$.push($1);
                       };

parametro: tipo ID{$$=new Declaracion($2,$1,null,[],0,0,0);}
         | ID ID{$$=new Declaracion($2,$1,null,[],0,0,0);};


modificadores: modificadores modificador{
                                        $$=$1;
                                        $$.push($2);
                                        }
            | modificador{
                        $$=[];
                        $$.push($1);
                        };

modificador: ABSTRACT{$$=Visibilidad.ABSTRACT;}
             | STATIC{$$=Visibilidad.STATIC;}
             | FINAL{$$=Visibilidad.FINAL;}
             | visibilidad{$$=$1;};

visibilidad: PUBLIC{$$=Visibilidad.PUBLIC;}
           | PRIVATE{$$=Visibilidad.PRIVATE;}
           | PROTECTED{$$=Visibilidad.PROTECTED;};


tipo: INT{$$=PrimitiveType.INTEGER;}
    | STRING{$$=PrimitiveType.STRING;}
    | DOUBLE{$$=PrimitiveType.DOUBLE;}
    | CHAR{$$=PrimitiveType.CHAR;}
    | BOOLEAN{$$=PrimitiveType.BOOLEAN;}
    | VOID{$$=PrimitiveType.VOID;};

exp: '!' exp
        {
            $$=new Logica($2,null,true,null,"!",null,0,0);
        }
    | exp '&&' exp
        {
            $$=new Logica($1,$3,false,null,"&&",0,0);
        }  
    | exp '||' exp
        {
            $$=new Logica($1,$3,false,null,"||",0,0);
        }  
    | exp '>' exp
        {
            $$=new Relacional($1,$3,false,null,">",0,0);
        }
    | exp '<' exp
        {
            $$=new Relacional($1,$3,false,null,"<",0,0);
        }
    | exp '>=' exp
        {
            $$=new Relacional($1,$3,false,null,">=",0,0);
        }
    | exp '<=' exp
        {
            $$=new Relacional($1,$3,false,null,"<=",0,0);
        }
    | exp '==' exp
        {
            $$=new Relacional($1,$3,false,null,"==",0,0);
        }
    | exp '!=' exp
        {
            $$=new Relacional($1,$3,false,null,"!=",0,0);
        }
    | exp '+' exp
        {
            $$=new Aritmetica($1,$3,false,null,"+",null,0,0);
        }
    | exp '-' exp
        {
            $$=new Aritmetica($1,$3,false,null,"-",null,0,0);
        }
    | exp '*' exp
        {
            $$=new Aritmetica($1,$3,false,null,"*",null,0,0);
        }
    | exp '/' exp
        {
            $$=new Aritmetica($1,$3,false,null,"/",null,0,0);
        }
    | POW '(' exp ',' exp ')'
        {
            $$=new Aritmetica($3,$5,false,null,"^",null,0,0);
        }
    | exp '%' exp
        {
            $$=new Aritmetica($1,$3,false,null,"%",null,0,0);
        }
    | '(' exp ')'{
                    $$ = $2;
                 }
    | '-' exp{
                $$=new Aritmetica($2,null,true,null,"-",null,0,0);
             } 
    | ID '--'{
                var temp=new Aritmetica(null,null,false,$1,null,Type.ID,0,0);
                $$=new Aritmetica(temp,null,true,null,"--",null,0,0);
                }
    | ID '++'{
                var temp=new Aritmetica(null,null,false,$1,null,Type.ID,0,0);
                $$=new Aritmetica(temp,null,true,null,"++",null,0,0);
                }
    | '--' ID {
                var temp=new Aritmetica(null,null,false,$2,null,Type.ID,0,0);
                $$=new Aritmetica(temp,null,true,null,"--",null,0,0);
                }
    | '++' ID  {
                var temp=new Aritmetica(null,null,false,$2,null,Type.ID,0,0);
                $$=new Aritmetica(temp,null,true,null,"++",null,0,0);
                }
    | NUMBER
        {
            $$=new Aritmetica(null,null,false,Number(yytext),null,PrimitiveType.INTEGER,0,0);
        }
    | DECIMAL
        {
            $$=new Aritmetica(null,null,false,Number(yytext),null,PrimitiveType.DOUBLE,0,0);
        }
    | STRING
        {
            $$=new Aritmetica(null,null,false,yytext,null,PrimitiveType.STRING,0,0);
        }
    | FALSE
        {
            $$=new Aritmetica(null,null,false,"false",null,PrimitiveType.BOOLEAN,0,0);
        }
    | TRUE
        {
            $$=new Aritmetica(null,null,false,"true",null,PrimitiveType.BOOLEAN,0,0);
        }
    | CHAR
        {
            $$=new Aritmetica(null,null,false,yytext,null,PrimitiveType.CHAR,0,0);
        }
    | ID{
            $$=new Aritmetica(null,null,false,yytext,null,Type.ID,0,0);
        }
    ;