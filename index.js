const mysql = require("mysql");
const express = require('express');
const app = express();
const bp = require('body-parser');
const alert = require('alert');

app.use("/views", express.static("views"));
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "room_rentals",
    multipleStatements: true
});

db.connect(function (error) {
    if (error) throw error
    else console.log("connected to database successfully");
});


const ejs = require('ejs');

const PORT = 3000;
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

app.use(express.static("public"));
app.use(express.json());

app.set("view engine", "ejs");

app.get("/", (req, resp) => {
    resp.render("index");
})
app.get("/register", (req, resp) => {
    resp.render("register");
})

app.get("/login", (req, resp) => {
    resp.render("login");
})
app.get("/owner_register", (req, resp) => {
    resp.render("owner_register");
})

app.get("/owner_login", (req, resp) => {
    resp.render("owner_login");
})
app.get("/contact", (req, resp) => {
    resp.render("contact");
})

app.get("/main", (req, res) => {
    db.query("SELECT * FROM signup", function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.render('main', { data: rows })
        }
    })
})




app.get("/flats", function (req, res) {
    var sql = "select FLAT_NAME,LANDMARK,LOCATION from flat";
    db.query(sql, function (err, result) {
        if (err) { console.log(err) };
        res.render("./flats", { Room: result });
    })
})


//post
// app.post("/register", function (req, resp) {
//     const fname = req.body.name;
//     const pno = req.body.Phno;
//     const uname = req.body.Uname;
//     const pass = req.body.Password;
//     const email = req.body.Email;
//     var sql = "INSERT INTO signup(name,email_id,contact,username,pwd) VALUES('" + fname + "','" + email + "','" + pno + "','" + uname + "','" + pass + "')";
//     db.query(sql, function (error, results) {
//         if (error) throw error;
//         // resp.send('Registration successful' +results.insertId);
//             alert('Successfully signed up');
//             resp.redirect('/login');
        
//             // resp.send('Username exists <a href="/login"><h3>Click here to login</h3></a>');
//     })
// })

app.post('/register',(req,res)=>{
    console.log(req.body);
    const name = req.body.name;
    const username = req.body.Uname;
    const email_ID = req.body.Email;
    const contact = req.body.Phno;
    const pwd = req.body.Password;
    var sqlee = "SELECT * FROM signup where username = '"+username+"' ";
    db.query(sqlee,function(error,result2){
        if(result2.length>0){
            alert("Username not available")
        }
        else if(name == ''||username == ''||email_ID == ''||contact == ''||pwd == ''){
            alert("Please enter all the details");
        }
        else{
       var sql = "INSERT INTO signup(name,username,email_id,contact,pwd)VALUES('"+name+"','"+username+"','"+email_ID+"','"+contact+"','"+pwd+"')";
            db.query(sql,function(err,result){
                if(err) {console.log("err");}
                alert("registration successful");
                res.redirect('/login');
            })
        }
    })
   
        // res.send("Registration successful");
    //    res.send("ok registered");
    })


// app.post("/owner_register", function (req, resp) {
//     const fname = req.body.Fname;
//     const lname = req.body.Lname;
//     const pno = req.body.Phno;
//     const uname = req.body.Uname;
//     const pass = req.body.Password;
//     console.log(req.body);
//     var sqle = "SELECT * FROM ownersignup where username = '" + username + "' ";
//     db.query(sqle, function (error, result1) {
//         if (result1.length > 0) {
//             alert("Username not available")
//         }
//         else if (name == '' || username == '' || email_id == '' || contact == '' || pwd == '' || address == '') {
//             alert("Please enter all the details");
//         }
//         else {

//             var sql = "INSERT INTO owner_signup(FIRSTNAME,LASTNAME,PHONENUMBER,USERNAME,PASSWORD) VALUES('" + fname + "','" + lname + "','" + pno + "','" + uname + "','" + pass + "')";
//             db.query(sql, function (error, results) {
//                 // if (error) throw error;
//                 console.log("Owner Registered successfully");
//                 alert('Successfully signed up');
//                 resp.redirect('owner_login');


//             })
//         }
//     })
// })

app.post('/owner_register',(req,res)=>{
    console.log(req.body);
    const name = req.body.name;
    const username = req.body.username;
    const email_id = req.body.emailid;
    const contact = req.body.ph;
    const pwd = req.body.pass;
    const address = req.body.address;

    var sqle = "SELECT * FROM owner_signup where username = '"+username+"' ";
    db.query(sqle,function(error,result1){
        if(result1.length>0){
            alert("Username not available")
        }
        else if(name == ''||username == ''||email_id == ''||contact == ''||pwd == ''||address == ''){
            alert("Please enter all the details");
        }
        else{
       var sql = "INSERT INTO owner_signup(name,username,email_ID,contact,pwd,address)VALUES('"+name+"','"+username+"','"+email_id+"','"+contact+"','"+pwd+"','"+address+"')";
            db.query(sql,function(err,result){
                // if(err) {console.log("error");}
                if(err)throw err;
                alert("registration successfull");
                res.redirect('/owner_login');
            })
        }
    })
   
        // res.send("Registration successful");
    //    res.send("ok registered");
    })


app.post("/login", function (req, resp) {
    const uname = req.body.username;
    const password = req.body.pass;
    var sql = "SELECT username,pwd FROM signup WHERE '" + uname + "'=username AND '" + password + "'=pwd ";
    db.query(sql, ['non-existent-username'], function (error, results) {
        if (error) throw error;
        // resp.send('Registration successful' +results.insertId);
        if (results.length > 0) {

            resp.redirect('/main');
            alert('Successfully logged in');
        }
        else {
            resp.redirect('/login');
            alert("Incorrect username or password");
        }
    })
})
var uname;
var password;
app.post("/owner_login", function (req, resp) {
    uname = req.body.username;
    password = req.body.pass;
    if (uname && password) {

        var sql = "SELECT username,pwd FROM owner_signup WHERE '" + uname + "'= username AND '" + password + "'=pwd";
        db.query(sql, ['non-existent-USERNAME'], function (error, results) {
            // if (error) throw error;
            // resp.send('Registration successful' +results.insertId);
            if (results.length > 0) {
                resp.redirect('ownerprofile');
                console.log("Username:-", req.body.username, "Password:-", req.body.pass);
                // alert('Logged in successfully');
            }
            else {

                // console.log("Username:-", req.body.username, "Password:-", req.body.pass);
                alert('Incorrect username or password');
                // resp.redirect('owner_register')
            }
        })
    }
})
app.get("/ownerprofile", function (req, res) {
    var sql = "select * from owner where USERNAME = '" + uname + "' and PASSWORD = '" + password + "'; select p.PG_ID,p.PG_NAME,p.LANDMARK,p.LOCATION from pg p,owner o where o.USERNAME = '" + uname + "' and o.OWNER_ID=p.OWNER_ID;select f.FLAT_ID,f.FLAT_NAME,f.LANDMARK,f.LOCATION from flat f,owner o where o.USERNAME='" + uname + "' and o.OWNER_ID = f.OWNER_ID";
    db.query(sql, function (err, result) {
        if (err) { console.log(err) };
        res.render("./ownerprofile", { o: result[0], Room: result[1], flat: result[2] });
    })
})

app.get('/pg', function (req, res) {
    var sql = "SELECT PG_NAME,LANDMARK,LOCATION FROM pg";
    db.query(sql, function (err, result) {
        if (err) { console.log(err) };
        res.render("./pg", { Room: result })
    })
})
app.get('/search', function (req, res) {
    var location = req.query.LOCATION;
    var sql = "select * from pg where LOCATION like '%" + location + "'";
    db.query(sql, function (err, result) {
        if (err) { console.log(err) }
        res.render('./pg', { Room: result });
    })
})

app.get('/searchflat', function (req, res) {
    var landmark = req.query.landmark;
    var sql = "select * from flat where LOCATION like '%" + landmark + "'";
    db.query(sql, function (err, result) {
        if (err) { console.log(err) }
        res.render('./flats', { Room: result });
    })
})

app.get('/pg_name:id', function (req, res) {
    db.query(`SELECT * from pg where PG_NAME="${req.params.id}"`, function (error, results, fields) {
        if (error) throw error;
        // res.send(results)
        if (results.length > 0) {
            // res.render('allpg', { Room: results })
            res.render('allpg', { Room: results });
        } else {
            console.log("Not found");
        }

    });

})

app.get('/flat_name:id', function (req, res) {
    db.query(`SELECT * from flat where FLAT_NAME="${req.params.id}"`, function (error, results, fields) {
        if (error) throw error;
        // res.send(results)
        if (results.length > 0) {
            // res.render('allpg', { Room: results })
            res.render('flatdet', { Room: results });
        } else {
            console.log("Not found");
        }

    });

})
app.get('/deletepg', (req, res) => {
    var sql = "delete from pg where PG_ID=?";

    var PG_ID = req.query.PG_ID;
    db.query(sql, [PG_ID], (err, result) => {
        if (err) { console.log(error) }
        res.redirect('/ownerprofile');
    })
})

app.get('/deleteflat', (req, res) => {
    var sql = "delete from flat where FLAT_ID=?";

    var Flat_ID = req.query.Flat_ID;
    db.query(sql, [Flat_ID], (err, result) => {
        if (err) { console.log(err) }
        res.redirect('/ownerprofile');
    })
})

var Owner_ID
app.get('/addpg', (req, res) => {

    Owner_ID = req.query.Owner_ID;
    console.log(Owner_ID)
    res.render('addpg')
})

app.get('/addflat', (req, res) => {

    Owner_ID = req.query.Owner_ID;
    console.log(Owner_ID)
    console.log(req.query)
    res.render('addflat')
})
var P_ID
app.get('/updatepg', (req, res) => {
    P_ID = req.query.PG_ID;
    console.log(P_ID)
    res.render('updatepg')
})



app.post('/addpg', (req, res) => {
    console.log(req.body);
    const Name = req.body.Name;
    const landmark = req.body.landmark;
    const No_Rooms = req.body.Noofrooms;
    const Rooms_Filled = req.body.roomsfilled;
    const Rooms_vac = req.body.roomsvac;
    const Address = req.body.address;
    const facilities = req.body.facilities;
    const foods = req.body.food;
    var sql = "INSERT INTO pg(PG_NAME,LANDMARK,NO_OF_ROOMS,ROOMS_FILLED,ROOMS_VACANT,LOCATION,FACILITIES,FOOD,OWNER_ID)VALUES('" + Name + "','" + landmark + "','" + No_Rooms + "','" + Rooms_Filled + "','" + Rooms_vac + "','" + Address + "','" + facilities + "','" + foods + "','" + Owner_ID + "')";
    db.query(sql, function (err, result) {
        if (err) throw err;
        alert("pg added");
        res.redirect('/ownerprofile');
    })
    // res.send("Registration successful");
    //    res.send("ok registered");
})



app.post('/addflat', (req, res) => {
    console.log(req.body);
    const Name = req.body.Name;
    const landmark = req.body.landmark;
    const contact = req.body.contact;
    const address = req.body.address;
    const type = req.body.type;
    console.log(req.query);
    var sql = "Insert into flat(FLAT_NAME,LANDMARK,CONTACT,LOCATION,NO_OF_ROOMS,OWNER_ID)values('" + Name + "','" + landmark + "','" + contact + "','" + address + "','" + type + "','" + Owner_ID + "')";
    db.query(sql, function (err, result) {
        if (err) throw err;
        alert("flat added");
        res.redirect('/ownerprofile');
    })
})

app.post('/updatepg', (req, res) => {
    const Name = req.body.Name;
    const landmark = req.body.landmark;
    const Noofrooms = req.body.Noofrooms;
    const roomsfilled = req.body.roomsfilled;
    const roomsvac = req.body.roomsvac;
    const address = req.body.address;
    const facilities = req.body.facilities;
    const food = req.body.food;
    db.query('CALL update_pg(?, ?, ?, ?, ?, ?, ?, ?, ?)', [Name, landmark, Noofrooms, roomsfilled, roomsvac, address, facilities, food, P_ID], (error, results) => {
        if (error) throw error;
        res.redirect('/ownerprofile')
        // console.log(results[0][0].message);
    });
}) //update

var FID
app.get('/updateflat', (req, res) => {

    FID = req.query.Flat_ID;
    console.log(FID)
    res.render('updateflat')
})
app.post('/updateflat', (req, res) => {
    const Name = req.body.Name;
    const landmark = req.body.landmark;
    const contact = req.body.contact;
    const address = req.body.address;
    const type = req.body.type;
    console.log(FID)
    console.log(req.query)
    db.query('CALL update_flat(?, ?, ?, ?, ?,?)', [Name, landmark, contact, address, type, FID], (error, results) => {
        if (error) throw error;
        res.redirect('/ownerprofile')
        // console.log(results[0][0].message);
    });
}) //update

app.listen(PORT, () =>
    console.log('Server started on port 3000'));

