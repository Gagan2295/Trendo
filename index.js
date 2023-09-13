const express = require("express");
const app = express();
const dbconn = require("./connection/config");
const userRoutes = require("./router/userRouter");
const path = require('path');
const hbs =require("hbs");
const fileUpload=require("express-fileupload");
const cloudinary=require("cloudinary");
// const path=require("path");


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






// cloudinary config keys

app.use(fileUpload({
  useTempFiles:true
}));


cloudinary.config({
  cloud_name: 'dlsvo1vn7',
  api_key: '292269167152726',
  api_secret: 'kehQDzCM-dTFcA087wI75YZY1cE',
});










dbconn()

app.use("/", userRoutes);




app.listen(2123, function () {
    console.log("App is running on Port 2123");
});