
/* description: Parses and executes mathematical expressions. */

/* lexical grammar */
%lex
%%

\s+                   /* skip whitespace */

"void"                return 'VOID'
"\"%c\""              return 'C'
"\"%d\""              return 'D'
"\"%e\""              return 'E'
"h"                   return 'H'
"p"                   return 'P'
"print"               return 'PRINT'
"if"               return 'IF'
"heap"                return 'HEAP'
"stack"               return 'STACK'
"goto"                return 'GOTO'  
"call"                return 'CALL'
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

e: sentencias EOF{ return $1; };

sentencias:sentencias sentencias_generales
        | sentencias_generales;


sentencias_generales: metodo
                    | sentencias_globales;

sentencias_globales: asignacion
                    | salto
                    | sentencia_goto
                    | llamada_metodo
                    | sentencia_print
                    | sentencia_if
                    /*
                    | sentencia_iffalse*/;


sentencia_if: IF '(' expresion simbolo_RL expresion ')' GOTO LNUMBER ';';


sentencia_global: sentencia_global sentencias_globales
                | sentencias_globales;



metodo: VOID ID '(' ')' '{' sentencia_global '}'
        | VOID ID '(' ')' '{' '}';

sentencia_print: PRINT '(' tipos_print ',' TNUMBER ')' ';';

tipos_print: E
           | D
           | C;

llamada_metodo: CALL ID '(' ')' ';';

sentencia_goto: GOTO LNUMBER ';';

salto: LNUMBER ':';


asignacion: expresion '=' expresion simbolo expresion ';'
        | expresion '=' expresion ';'
        | expresion '=' '-' expresion ';';


expresion: TNUMBER
        | NUMBER
        | 'H'
        | 'P'
        | HEAP '[' contenido_heap ']'
        | STACK '[' contenido_heap ']';

contenido_heap: TNUMBER
                | NUMBER
                | 'H';

simbolo: '+'
        | '-'
        | '/'
        | '*'
        | '^'
        | '%';

simbolo_RL: '=='
           | '!='
           | '>'
           | '<'
           | '>='
           | '<='
           | '&&'
           | '||';
