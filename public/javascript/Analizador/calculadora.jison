
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




//simbolos del lenguaje
","                   return ','
"]"                   return ']'
"["                   return '['
";"                   return ';'
"="                   return '='
"*"                   return '*'
"/"                   return '/'
"-"                   return '-'
"+"                   return '+'
"^"                   return '^'
"!"                   return '!'
"%"                   return '%'
"("                   return '('
")"                   return ')'
([a-zA-Z]|["_"])([a-zA-Z]|[0-9]|["_"])* return 'ID'
[0-9]+("."[0-9]+)?\b  return 'NUMBER'
<<EOF>>               return 'EOF'
.                     return 'INVALID'

/lex

/* operator associations and precedence */

%left '+' '-'
%left '*' '/'
%left '^'
%right '!'
%right '%'
%left UMINUS

%start expressions

%% /* language grammar */

expressions
    : e EOF
        { return $1; }
    ;

e: sentencias_globales;


sentencias_globales: declaracion_variables{$$=$1;};

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


exp: exp '+' exp
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
            $$ = $1/$3;
        }
    | exp '^' exp
        {
            $$=new Aritmetica($1,$3,false,null,"^",null,0,0);
        }
    | '(' exp ')'
        {$$ = $2;}
    | NUMBER
        {
            $$=new Aritmetica(null,null,false,Number(yytext),null,PrimitiveType.INTEGER,0,0);
        }
    | ID{
            $$=new Aritmetica(null,null,false,yytext,null,Type.ID,0,0);
        }
    ;