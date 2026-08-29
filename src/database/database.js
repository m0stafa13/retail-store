import mysql2 from 'mysql2'
export const connection = mysql2.createConnection({
    host: "127.0.0.1",
    database: "promanage",
    user: "root",
    password: "",

    multipleStatements: true
})

connection.on("connect", () => {
    console.log("database connected ");
})

