const mysql = require('mysql')

const con = mysql.createConnection({
    host       : 'localhost',
    database   : 'USER',
    password   : 'shahrearrootuser',
    user       : 'root'
})

con.connect((err, connection) => {
    if(err) throw err;
    console.log('Connected!')
})

module.exports = con