var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
//   password : 'admin',
  database : 'test',
  connectTimeout: 10
});
connection.connect((err)=>{
if(!err) {
    console.log("Database is connected");
    connection.destroy()
} else {
    console.log("Error while connecting with database");
}
});
module.exports = connection; 