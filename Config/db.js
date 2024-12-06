const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config(); 

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE_NAME,
   
});     

connection.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1);
    }
    console.log('Connected to Amazon RDS MySQL Database!🛜  ✔');
}); 
   
module.exports = connection;
