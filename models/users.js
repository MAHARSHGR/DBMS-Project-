const mysql=require("mysql");


const connection=mysql.createConnection({
    host: "localhost",
    user: "root",
    password:"",
    database: "room_rentals"
});

connection.connect(function(error){
    if(error)throw error
    else console.log("connected to database successfully")
})

module.exports=User;