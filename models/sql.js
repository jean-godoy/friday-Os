const mysql = require('mysql2');

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASS,
    database: process.env.DATA_BASE
});

db.connect((err) => {
    if(err){
        console.error('error connecting: ' +err.stack)
    }

    console.log('connected as id : '+ db.threadId);
});

module.exports = db;