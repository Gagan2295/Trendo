const express = require("express");
const dbconn = require("./connection/config");
const userRoutes = require("./router/userRouter");
const app = express();
const path = require('path');
const hbs =require("hbs");
let cookieParser=require("cookie-parser");
app.use(cookieParser());


app.use(express.json())
app.use(express.urlencoded({ extended: true }));
// app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'public'))); //Project - public/ already set
// app.engine('handlebars', engine());

app.set("views-engine", "hbs");

let pathViews=path.join(__dirname, "/views") 
app.set("views");
hbs.registerPartials(pathViews); 



dbconn()



app.use("/", userRoutes);




app.listen(2123, function () {
    console.log("App is running on Port 2123");
});