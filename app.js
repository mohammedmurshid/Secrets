require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");

const app = express();

// trying to log the hash key
console.log(md5("123456"));

// logging the API Key which is saved in .env file
console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB");

// Creating a userSchema
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


// Creating a model User with userSchema
const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
    // creating a new user
    const newUser = new User({
        email: req.body.username,
        password: md5(req.body.password)
    });
    
    newUser.save((err) => {
        if (err) {
            console.log(err);
        } else {
            res.render("secrets");
        }
    });

    // console.log(req.body.email);
});

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = md5(req.body.password);

    User.findOne({email: username}, (err, foundUser) => {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                if (foundUser.password === password){
                    res.render("secrets");
                }
            }
        }
    });
});






app.listen(3000, () => {
    console.log("Server started on port 3000");
});