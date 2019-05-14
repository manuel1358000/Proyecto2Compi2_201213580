AWS.config.update({
    region: "us-east-2",
    // The endpoint should point to the local or remote computer where DynamoDB (downloadable) is running.
    endpoint: 'https://dynamodb.us-east-2.amazonaws.com',
    accessKeyId: "AKIA2E6UCZWXC7MCX7DK",
    secretAccessKey: "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"
  });
  var dynamodb = new AWS.DynamoDB();
  var docClient = new AWS.DynamoDB.DocumentClient();
function createReporteErrores() {
    var params = {
        TableName : "Reporte_Errores_201213580",
        KeySchema: [
            {
                AttributeName: "ID",
                KeyType: "HASH"
            }
          ],
        AttributeDefinitions: [
            {
                AttributeName: "ID",
                AttributeType: "N"
            }
          ],
        ProvisionedThroughput: {       
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
        }
    };

    dynamodb.createTable(params, function(err, data) {
        if (err) {
            alert("Unable to create table: " + "\n" + JSON.stringify(err, undefined, 5));
        } else {
            alert("Created table: " + "\n" + JSON.stringify(data, undefined, 5));
        }
    });
}
function deleteReporteErrores() {
    var params = {
        TableName : "Reporte_Errores_201213580"
    };

    dynamodb.deleteTable(params, function(err, data) {
        if (err) {
            alert("Unable to delete table: " + "\n" + JSON.stringify(err, undefined, 5));
        } else {
            alert("Table deleted.");
        }
    });
}
function createElementoErrores(id,tipo,descripcion,linea,columna) {
    var params = {
        TableName :"Reporte_Errores_201213580",
        Item:{
            "ID": id,
            "TIPO": tipo,
            "DESCRIPCION": descripcion,
            "LINEA": linea,
            "COLUMNA": columna
        }
    };
    docClient.put(params, function(err, data) {
        if (err) {
            alert("el elemento no se pudo enviar a dynamo" + "\n" + JSON.stringify(err, undefined, 2));
        } else {
            console.log("Elemento Enviado a Dynamo" + "\n" + JSON.stringify(data, undefined, 2));
        }
    });
}

function readElemento(id) {
    var table = "Reporte_Errores_201213580";
    var ID = id;

    var params = {
        TableName: table,
        Key:{
            "ID": ID
        }
    };
    docClient.get(params, function(err, data) {
        if (err) {
            alert("Unable to read item: " + "\n" + JSON.stringify(err, undefined, 2));
        } else {
            alert("GetItem succeeded: " + "\n" + JSON.stringify(data, undefined, 2));
        }
    });
}
function scanData() {
    var params = {
        TableName: "Reporte_Errores_201213580",
        ProjectionExpression: "#id,TIPO,DESCRIPCION,LINEA,COLUMNA",
        ExpressionAttributeNames: {
            "#id": "ID",
        },
    };
    docClient.scan(params, onScan);
    function onScan(err, data) {
        if (err) {
            alert("No se pueden leer los elementos de la tabla: " + "\n" + JSON.stringify(err, undefined, 2));
        } else {
            data.Items.forEach(function(tabla) {
                lista_errores.push(new Errores(tabla.TIPO,tabla.DESCRIPCION,tabla.LINEA,tabla.COLUMNA));
                alert(lista_errores.length);
            });         
            anidarErrores();  
        }
    }
}

function conditionalDelete(id) {
    var table = "Reporte_Errores_201213580";
    var params = {
        TableName:table,
        Key:{
            "ID":id
        },
    };

    docClient.delete(params, function(err, data) {
        if (err) {
            alert("Reinicio Falido: " + "\n" + JSON.stringify(err, undefined, 2));
        } else {
            console.log("Reinicio exitoso");
        }
    });
}

function scanData2() {
    var params = {
        TableName: "Reporte_Errores_201213580",
        ProjectionExpression: "#id",
        ExpressionAttributeNames: {
            "#id": "ID",
        },
    };
    docClient.scan(params, onScan);
    function onScan(err, data) {
        if (err) {
            alert("Error no se pudo consultar la tabla Reporte Errores 201213580: " + "\n" + JSON.stringify(err, undefined, 2));
        } else {
            // Print all the movies
            alert("Reinicio Reportes Exitoso");
            
            data.Items.forEach(function(tabla) {
                conditionalDelete(tabla.ID);
            });         
        }
    }
}
function createReporteAST() {
    var params = {
        TableName : "Reporte_AST_201213580",
        KeySchema: [
            {
                AttributeName: "ID",
                KeyType: "HASH"
            }
          ],
        AttributeDefinitions: [
            {
                AttributeName: "ID",
                AttributeType: "N"
            }
          ],
        ProvisionedThroughput: {       
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
        }
    };

    dynamodb.createTable(params, function(err, data) {
        if (err) {
            alert("Unable to create table: " + "\n" + JSON.stringify(err, undefined, 5));
        } else {
            alert("Created table: " + "\n" + JSON.stringify(data, undefined, 5));
        }
    });
}
function conditionalDeleteAST() {
    var table = "Reporte_AST_201213580";
    var params = {
        TableName:table,
        Key:{
            "ID":0
        },
    };

    docClient.delete(params, function(err, data) {
        if (err) {
            alert("Reinicio Falido: " + "\n" + JSON.stringify(err, undefined, 2));
        } else {
            console.log("Reinicio exitoso");
        }
    });
}
function createElementoAST(codigo) {
    var params = {
        TableName :"Reporte_AST_201213580",
        Item:{
            "ID":0,
            "CODIGO": codigo
        }
    };
    docClient.put(params, function(err, data) {
        if (err) {
            alert("el elemento no se pudo enviar a dynamo" + "\n" + JSON.stringify(err, undefined, 2));
        } else {
            console.log("Elemento AST Enviado a Dynamo" + "\n" + JSON.stringify(data, undefined, 2));
        }
    });
}
function scanDataAST() {
    var params = {
        TableName: "Reporte_AST_201213580",
        ProjectionExpression: "#id,CODIGO",
        ExpressionAttributeNames: {
            "#id": "ID",
        },
    };
    docClient.scan(params, onScan);
    function onScan(err, data) {
        if (err) {
            alert("No se pueden leer los elementos de la tabla: " + "\n" + JSON.stringify(err, undefined, 2));
        } else {
            data.Items.forEach(function(tabla) {
                graficar(tabla.CODIGO);
            });           
        }
    }
}


function createReporteSimbolos() {
    var params = {
        TableName : "Reporte_Tabla_201213580",
        KeySchema: [
            {
                AttributeName: "ID",
                KeyType: "HASH"
            }
          ],
        AttributeDefinitions: [
            {
                AttributeName: "ID",
                AttributeType: "N"
            }
          ],
        ProvisionedThroughput: {       
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
        }
    };

    dynamodb.createTable(params, function(err, data) {
        if (err) {
            alert("Unable to create table: " + "\n" + JSON.stringify(err, undefined, 5));
        } else {
            alert("Created table: " + "\n" + JSON.stringify(data, undefined, 5));
        }
    });
}
function scanDataSimbolos() {
    var params = {
        TableName: "Reporte_Tabla_201213580",
        ProjectionExpression: "#id",
        ExpressionAttributeNames: {
            "#id": "ID",
        },
    };
    docClient.scan(params, onScan);
    function onScan(err, data) {
        if (err) {
            alert("Error no se pudo consultar la tabla Reporte Errores 201213580: " + "\n" + JSON.stringify(err, undefined, 2));
        } else {
            // Print all the movies
            alert("Reinicio Reportes Exitoso");
            
            data.Items.forEach(function(tabla) {
                conditionalDeleteSimbolos(tabla.ID);
            });         
        }
    }
}
function conditionalDeleteSimbolos(id) {
    var table = "Reporte_Tabla_201213580";
    var params = {
        TableName:table,
        Key:{
            "ID":id
        },
    };

    docClient.delete(params, function(err, data) {
        if (err) {
            alert("Reinicio Falido: " + "\n" + JSON.stringify(err, undefined, 2));
        } else {
            console.log("Reinicio exitoso");
        }
    });
}
function createElementoSimbolos(id,nombre,tipo,ambito,rol,posrel,tamanio,dimensiones,visibilidad,modificadores,inicializado,extiende) {
    var params = {
        TableName :"Reporte_Tabla_201213580",
        Item:{
            "ID":id,
            "NOMBRE": nombre,
            "TIPO":tipo,
            "AMBITO":ambito,
            "ROL":rol,
            "POSREL":posrel,
            "TAMANIO":tamanio,
            "DIMENSIONES":"-",
            "VISIBILIDAD":visibilidad,
            "MODIFICADORES":modificadores,
            "INICIALIZADO":inicializado,
            "EXTIENDE":"-"
        }
    };
    docClient.put(params, function(err, data) {
        if (err) {
            alert("el elemento no se pudo enviar a dynamo" + "\n" + JSON.stringify(err, undefined, 2));
        } else {
            console.log("Elemento Tabla Enviado a Dynamo" + "\n" + JSON.stringify(data, undefined, 2));
        }
    });
}
function scanDataTabla2() {
    var params = {
        TableName: "Reporte_Tabla_201213580",
        ProjectionExpression: "#id,NOMBRE,TIPO,AMBITO,ROL,POSREL,TAMANIO,DIMENSIONES,VISIBILIDAD,MODIFICADORES,INICIALIZADO,EXTIENDE",
        ExpressionAttributeNames: {
            "#id": "ID",
        },
    };
    docClient.scan(params, onScan);
    function onScan(err, data) {
        if (err) {
            alert("No se pueden leer los elementos de la tabla: " + "\n" + JSON.stringify(err, undefined, 2));
        } else {
            var tabla=document.getElementById("cuerpo_tabla");
            tabla.innerHTML = "";
            var fila="";
            data.Items.forEach(function(tabla) {
                fila+="<tr>";
                fila+="<td>"+tabla.ID+"</td>";
                fila+="<td>"+tabla.NOMBRE+"</td>";
                fila+="<td>"+tabla.TIPO+"</td>";
                fila+="<td>"+tabla.AMBITO+"</td>";
                fila+="<td>"+tabla.ROL+"</td>";
                fila+="<td>"+tabla.POSREL+"</td>";
                fila+="<td>"+tabla.TAMANIO+"</td>";
                fila+="<td>"+tabla.DIMENSIONES+"</td>";
                fila+="<td>"+tabla.VISIBILIDAD+"</td>";
                fila+="<td>"+tabla.MODIFICADORES+"</td>";
                fila+="<td>"+tabla.INICIALIZADO+"</td>"
                fila+="<td>"+tabla.EXTIENDE+"</td>";
                fila+="</tr>";
            });
            tabla.insertAdjacentHTML('beforeend',fila);           
        }
    }
}