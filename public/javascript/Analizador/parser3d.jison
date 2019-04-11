
/* description: Parses and executes mathematical expressions. */

/* lexical grammar */
%lex
%%
\s+                   /* skip whitespace */
"//"[^\r\n]*[^\r\n]   return ;
"/*"[^'*']*"*/"       return;
"void"                return 'VOID'
"\"%c\""              return 'C'
"\"%d\""              return 'D'
"\"%e\""              return 'E'
"h"                   return 'H'
"p"                   return 'P'
"print"               return 'PRINT'
"iffalse"             return 'IFFALSE'
"if"                  return 'IF'
"heap"                return 'HEAP'
"stack"               return 'STACK'
"goto"                return 'GOTO'  
"call"                return 'CALL'
"proc"                return 'PROC'
"begin"               return 'BEGIN'
"end"                 return 'END'
"var"                 return 'VAR'
//simbolos del lenguaje
"["                   return '['                
"]"                   return ']'
"{"                   return '{'
"}"                   return '}'
":"                   return ':'
";"                   return ';'
","                   return ','
"=="                  return '=='
"="                   return '='
//aritmeticas
"*"                   return '*'
"/"                   return '/'
"-"                   return '-'
"+"                   return '+'
"pow"                 return 'POW'
"!="                  return '!='
"^"                  return '^'
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
([0-9])([0-9]+)?      return 'NUMBER'
("t"[0-9])([0-9]+)?   return 'TNUMBER'
("L"[0-9])([0-9]+)?   return 'LNUMBER'
"'"[a-zA-Z][^''\n]*"'" return 'CHAR'
([a-zA-Z]|["_"])([a-zA-Z]|[0-9]|["_"])* return 'ID'
<<EOF>>               return 'EOF'
.                     return 'INVALID'

/lex

/* operator associations and precedence */

%left '+' '-'
%left '*' '/' '%'
%left 'pow'
%right '!'
%left '&&' '||'
%left '==' '!=' '>' '>=' '<' '<='
%left '(' ')'

%start e

%% /* language grammar */

e: sentencias_principio EOF{ return $1; };

sentencias_principio: sentencias_variables sentencias{
                                                        $$=$1;
                                                        for(var i=0;i<$2.length;i++){
                                                                $$.push($2[i]);
                                                        }
                                                        }
                | sentencias{$$=$1;};

sentencias_variables:sentencias_variables sentencia_variable{
                                                        $$=$1;
                                                        for(var i=0;i<$2.length;i++){
                                                                $$.push($2[i]);
                                                        }
                                                        }
                    | sentencia_variable{$$=$1;};
sentencia_variable: VAR lista_tnumber ';'{$$=$2;}
                   | VAR H '=' NUMBER ';'{
                                        $$=[];
                                        $$.push(new Declaracion3D($2,$4,"H"));}
                   | VAR P '=' NUMBER ';'{
                                        $$=[];
                                        $$.push(new Declaracion3D($2,$4,"P"));
                                        }
                   | VAR HEAP '[' ']' ';'{
                                        $$=[];
                                        $$.push(new Declaracion3D($2,0,"HEAP"));
                                        }
                   | VAR STACK '[' ']' ';'{
                                        $$=[];
                                        $$.push(new Declaracion3D($2,0,"STACK"));
                                        };

lista_tnumber: lista_tnumber ',' TNUMBER{
                                        $$=$1;
                                        $$.push(new Declaracion3D($3,0,"ETIQUETA"));
                                        }
                | TNUMBER{
                        $$=[];
                        $$.push(new Declaracion3D($2,0,"ETIQUETA"));
                        };

sentencias:sentencias sentencias_generales{
                                        $$=$1;
                                        $$.push($2);
                                        }
        | sentencias_generales{
                                $$=[];
                                $$.push($1);
                                };
sentencias_generales: metodo{$$=$1;}
                    | sentencias_globales{$$=$1;};

sentencias_globales: asignacion{$$=$1;}
                    | salto{$$=$1;}
                    | sentencia_goto{$$=$1;}
                    | llamada_metodo{$$=$1;}
                    | sentencia_print{$$=$1;}
                    | sentencia_if{$$=$1;}
                    | sentencia_iffalse{$$=$1;};

sentencia_iffalse: IFFALSE '(' expresion simbolo_RL expresion ')' GOTO LNUMBER ';'{
                                                                        //exp1,exp2,operador,unario,acceso,tipo
                                                                        var condicion=new Expresion3D($3,$5,$4,false,false,"EXPRESION");
                                                                        $$=new Iffalse3D(condicion,new Goto3D($8));
                                                                        };

sentencia_if: IF '(' expresion simbolo_RL expresion ')' GOTO LNUMBER ';'{
                                                                        //exp1,exp2,operador,unario,acceso,tipo
                                                                        var condicion=new Expresion3D($3,$5,$4,false,false,"EXPRESION");
                                                                        $$=new If3D(condicion,new Goto3D($8));
                                                                        };
sentencia_global: sentencia_global sentencias_globales{
                                                        $$=$1;
                                                        $$.push($2);
                                                        }
                | sentencias_globales{
                                        $$=[];
                                        $$.push($1);
                                        };



metodo: PROC ID BEGIN sentencia_global END{$$=new Metodo3D($2,$4);}
        | PROC ID BEGIN END{$$=new Metodo3D($2,[]);};

sentencia_print: PRINT '(' tipos_print ',' TNUMBER ')' ';'{$$=new Imprimir3D($3,$5);};

tipos_print: E{$$=$1;}
           | D{$$=$1;}
           | C{$$=$1;};

llamada_metodo: CALL ID ';'{$$=new Llamada_Metodo3D($2);};

sentencia_goto: GOTO LNUMBER ';'{$$=new Goto3D($2);};

salto: LNUMBER ':'{$$=new Salto3D($1);};

//id,exp1,tipo,acceso
asignacion: expresion_asignar '=' expresion simbolo expresion ';'{
                                                                $$=$1;
                                                                $$.exp1=new Asignacion3D($3,$5,$4,false,null,"EXPRESION");
                                                                }
        | expresion_asignar '=' expresion ';'{
                                                $$=$1;
                                                $$.exp1=new Asignacion3D($3,null,null,true,null,"EXPRESION");
                                                }
        | expresion_asignar '=' '-' expresion ';'{
                                                $$=$1;
                                                $$.exp1=new Asignacion3D($4,null,$3,true,null,"EXPRESION");                          
                                                };

//exp1,exp2,operador,unario,acceso,tipo
expresion: TNUMBER{$$=new Expresion3D($1,null,null,null,null,"ETIQUETA");}
        | NUMBER{$$=new Expresion3D($1,null,null,null,null,"NUMERO");}
        | 'H'{$$=new Expresion3D($1,null,null,null,null,"H");}
        | 'P'{$$=new Expresion3D($1,null,null,null,null,"P");}
        | HEAP '[' contenido_hs ']'{$$=new Expresion3D($1,null,null,null,$3,"HEAP");}
        | STACK '[' contenido_hs ']'{$$=new Expresion3D($1,null,null,null,$3,"STACK");};

//id,exp1,tipo,acceso
expresion_asignar:TNUMBER{$$=new Asignacion3D($1,null,"ETIQUETA",null);}
                | 'H'{$$=new Asignacion3D($1,null,"H",null);}
                | 'P'{$$=new Asignacion3D($1,null,"P",null);}
                | HEAP '[' contenido_hs ']'{$$=new Asignacion3D($1,null,"HEAP",$3);}
                | STACK '[' contenido_hs ']'{$$=new Asignacion3D($1,null,"STACK",$3);};



contenido_hs: TNUMBER{$$=$1;}
                | NUMBER{$$=$1;}
                | 'H'{$$=$1;}
                | 'P'{$$=$1;};

simbolo: '+'{$$=$1;}
        | '-'{$$=$1;}
        | '/'{$$=$1;}
        | '*'{$$=$1;}
        | '^'{$$=$1;}
        | '%'{$$=$1;};

simbolo_RL: '=='{$$=$1;}
           | '!='{$$=$1;}
           | '>'{$$=$1;}
           | '<'{$$=$1;}
           | '>='{$$=$1;}
           | '<='{$$=$1;}
           | '&&'{$$=$1;}
           | '||'{$$=$1;};
