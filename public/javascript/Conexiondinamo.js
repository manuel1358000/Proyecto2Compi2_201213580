AWS.config.update({
    region: "us-east-2",
    // The endpoint should point to the local or remote computer where DynamoDB (downloadable) is running.
    endpoint: 'https://dynamodb.us-east-2.amazonaws.com',
    accessKeyId: "AKIA2E6UCZWXIJTVLQ6X",
    secretAccessKey: "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"
  });
  var dynamodb = new AWS.DynamoDB();
  var docClient = new AWS.DynamoDB.DocumentClient();
function createReporte() {
    var params = {
        TableName : "Reportes",
        KeySchema: [
            {
                AttributeName: "ID",
                KeyType: "HASH"
            }
          ],
        AttributeDefinitions: [
            {
                AttributeName: "ID",
                AttributeType: "S"
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
function deleteReporte() {
    var params = {
        TableName : "Reportes"
    };

    dynamodb.deleteTable(params, function(err, data) {
        if (err) {
            alert("Unable to delete table: " + "\n" + JSON.stringify(err, undefined, 5));
        } else {
            alert("Table deleted.");
        }
    });
}
function createElemento() {
    var params = {
        TableName :"Reportes",
        Item:{
            "ID": "0",
            "TIPO": "Error Semantico",
            "DESCRIPCION": "Tipo de Dato invalido",
            "LINEA": "0",
            "COLUMNA": "1"
        }
    };
    docClient.put(params, function(err, data) {
        if (err) {
            alert("Unable to add item: " + "\n" + JSON.stringify(err, undefined, 2));
        } else {
            alert("PutItem succeeded: " + "\n" + JSON.stringify(data, undefined, 2));
        }
    });
}

function readElemento() {
    var table = "Reportes";
    var ID = "0";

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

