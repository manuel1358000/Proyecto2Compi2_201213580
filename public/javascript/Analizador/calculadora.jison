
/* description: Parses and executes mathematical expressions. */

/* lexical grammar */
%lex
%%

\s+                   /* skip whitespace */


"int"               return 'INT'
"string"            return 'STRING'
"double"            return 'DOUBLE'
"char"              return 'CHAR'
"boolean"           return 'BOOLEAN'

"public"            return 'PUBLIC'
"static"            return 'STATIC'
"final"             return 'FINAL'
"private"           return 'PRIVATE'
"protected"         return 'PROTECTED'
"abstract"          return 'ABSTRACT'

"class"             return 'CLASS'
"extends"           return 'EXTENDS'

//simbolos del lenguaje
"{"                   return '{'
"}"                   return '}'
","                   return ','
"]"                   return ']'
"["                   return '['
";"                   return ';'
"=="                  return '=='
"="                   return '='
//aritmeticas
"*"                   return '*'
"/"                   return '/'
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

%left '+' '-'
%left '*' '/' '%'
%left 'pow'
%left '(' ')'
%left '==' '!=' '>' '>=' '<' '<='
%right '!'
%left '&&' '||'
%start expressions

%% /* language grammar */

expressions
    : e EOF
        { return $1; }
    ;

//e: sentencias_globales{$$=$1;};
e: exp{
    $$=[];
    $$.push($1);
    };

sentencias_globales: declaraciones_clase{$$=$1;};

declaraciones_clase: declaraciones_clase declaracion_clase{
                                                            $$=$1;
                                                            $$.push($2);
                                                        }
                   | declaracion_clase{
                                        $$=[];
                                        $$.push($1);
                                    };

declaracion_clase: modificadores_clase CLASS ID '{' cuerpo_clase '}'{
                                                                        $$=new Declaracionclase($3,$1,null,$5);
                                                                    }
                 | modificadores_clase CLASS ID EXTENDS ID '{' cuerpo_clase '}'{
                                                                                $$=new Declaracionclase($3,$1,$5,$7);
                                                                            }; 

cuerpo_clase: cuerpo_clase cuerpo_clase_declaraciones{
                                                        $$=$1;
                                                        for(var i=0;i<$2.length;i++){
                                                            $$.push($2[i]);
                                                        }                
                                                    }
            | cuerpo_clase_declaraciones{
                                        $$=[];
                                        for(var i=0;i<$1.length;i++){
                                            $$.push($1[i]);
                                        }
                                        };

//aqui vamos a definir las variables,metodos, constructor, clases
cuerpo_clase_declaraciones:declaracion_variables{$$=$1;};

modificadores_clase:{$$=[];}
                    | modificadores_clase2{$$=$1};
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

declaracion_variables: modificadores_variables tipo declaraciones_var ';'{
                                                                          for(var i=0;i<$3.length;i++){
                                                                              $3[i].modificadores=$1;
                                                                              $3[i].tipo=$2;
                                                                          }
                                                                          $$=$3;
                                                                        };

declaraciones_var: declaraciones_var ',' declaracion_var{$$=$1
                                                        $$.push($3);
                                                        }
                |  declaracion_var{$$=[];
                                    $$.push($1);
                                    };

declaracion_var: variable_id '=' variable_inicializada{
                                                        $1.iniValue=$3
                                                        $1.inicializado=true;
                                                        $$=$1;
                                                    }
                | variable_id{$$=$1;};

variable_id:  variable_id '[' ']'{$1.dimensiones=$1.dimensiones+1;
                                $$=$1;
                                }
            | ID{$$=new Declaracion(yytext,PrimitiveType.NULO,null,0,0,0);};

variable_inicializada: exp{
                            $$=$1;
                            };


modificadores_variables: {$$=[];}
                        | modificadores_variables2{$$=$1;};
modificadores_variables2: modificadores_variables2 modificador_variable{
                                                                        $$=$1;
                                                                        $$.push($2);
                                                                       }
                         | modificador_variable{
                                                $$=[];
                                                $$.push($1);       
                         };

modificador_variable: STATIC{$$=Visibilidad.STATIC;}
                    | FINAL{$$=Visibilidad.FINAL;}
                    | PUBLIC{$$=Visibilidad.PUBLIC;}
                    | PRIVATE{$$=Visibilidad.PRIVATE;}
                    | PROTECTED{$$=Visibilidad.PROTECTED;};

tipo: INT{$$=PrimitiveType.INTEGER;}
    | STRING{$$=PrimitiveType.STRING;}
    | DOUBLE{$$=PrimitiveType.DOUBLE;}
    | CHAR{$$=PrimitiveType.CHAR;}
    | BOOLEAN{$$=PrimitiveType.BOOLEAN;};


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