// DB modules
var mysql = require('mysql');

var con = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'dalviroo',
	multipleStatements: true
});

con.connect(function(err){
	if(err){
		throw err;
	}
	console.log('MySQL is CONNECTED..!!');
});

module.exports = con;