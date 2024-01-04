import mysql from "mysql2/promise";

const connection = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "quan-li-nha-hang",
});


export default connection;  