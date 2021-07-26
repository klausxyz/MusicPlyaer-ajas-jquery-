
var mysql = require('mysql')
function dbConnection() {
    //连接数据库
    var connection = mysql.createConnection({
        host:'localhost', 
        port:'3306',
        user:'root',
        password:'1234',
        database:'user',
        connectTimeout:5000,
        multipleStatements: false // 是否允许一个query中包含多条sql语句
    });
    connection.connect();
}


