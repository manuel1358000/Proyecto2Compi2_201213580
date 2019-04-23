AWS.config.update({
    region: "us-east-2",
    // The endpoint should point to the local or remote computer where DynamoDB (downloadable) is running.
    endpoint: 'https://dynamodb.us-east-2.amazonaws.com',
    accessKeyId: "AKIA2E6UCZWXJDGVLGAN",
    secretAccessKey: "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"
  });
  var dynamodb = new AWS.DynamoDB();
  var docClient = new AWS.DynamoDB.DocumentClient();
function createReporte() {
    var params = {
        TableName : "Reporte",
        KeySchema: [
            { AttributeName: "year", KeyType: "HASH"},
            { AttributeName: "title", KeyType: "RANGE" }
        ],
        AttributeDefinitions: [       
            { AttributeName: "year", AttributeType: "N" },
            { AttributeName: "title", AttributeType: "S" }
        ],
        ProvisionedThroughput: {       
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
        }
    };

    dynamodb.createTable(params, function(err, data) {
        if (err) {
            alert("Unable to create table: " + "\n" + JSON.stringify(err, undefined, 2));
        } else {
            alert("Created table: " + "\n" + JSON.stringify(data, undefined, 2));
        }
    });
}
function deleteReporte() {
    var params = {
        TableName : "Reporte"
    };

    dynamodb.deleteTable(params, function(err, data) {
        if (err) {
            alert("Unable to delete table: " + "\n" + JSON.stringify(err, undefined, 2));
        } else {
            alert("Table deleted.");
        }
    });
}
function agregarRegistro(){

    
}