import mysql from "mysql2/promise";

const connection = mysql.createPool({
    host: "127.0.0.1",
    user: "root",
    password: "12345",
    database: "quan-li-nha-hang",
});


export default connection;  