const { ExpressValidator, validationResult } = require("express-validator");
const userModel = require("../model/userSchema");
const Product = require("../model/product");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bodyparser=require("body-parser");
const cloudinary=require("cloudinary").v2;
let fileUpload=require("express-fileupload");
const multer=require("multer");







// Register (Signup form) Data in Mongodb & validations in Signup Form & bcrypt password

let data;
let register = async (req, res) => {
    try {
        let { name, email, mobile, password } = req.body;

        let salt = bcrypt.genSaltSync(10);
        let hashpass = bcrypt.hashSync(password, salt);
        data = {
            name: name,
            email: email,
            mobile: mobile,
            password: hashpass
        }


        const errors = validationResult(req);
        const err = errors.array()

        for (var i = 0; i < err.length; i++) {
            if (err[i].path === 'name') {
                res.render("signup.hbs", { messagen: "name short" })
            }
            else if (err[i].path === 'email') {
                res.render("signup.hbs", { messagee: "email not valid" })
            }
            else if (err[i].path === 'mobile') {
                res.render("signup.hbs", { messagem: "mobile not valid" })
            }
            else if (err[i].path === 'password') {
                res.render("signup.hbs", { messagep: "Enter a secure password: At least 8 characters long, containing uppercase and lowercase letters and numbers." })
            }
            console.log(err[i])
        }
        // if (!errors.isEmpty()) {
        //     res.json({ errors: errors })
        // } 

        const alreadyExistUser = await userModel.findOne({ email: req.body.email });
        if (alreadyExistUser) {

            return res.render("signup.hbs", { message: "User already Exist" });
        } else {
            let { password, confirm_password } = req.body;
            if (password !== confirm_password) {
                res.render("signup.hbs", { message: "Error:Confirm password not match" })
            } else {
                await userModel.create(data);
                res.redirect("/login",)
                res.render("login.hbs", { message: "Register Successfully" });
            }
        }


    } catch (error) {
        return res.render("signup.hbs", { message: error.message })
    }
}

// login page with JWT token & compare hashpass

let loginpage = async (req, res) => {
    try {

        let { email, password } = req.body;
        let find = await userModel.findOne({ email: email })
        if (!find) return res.render("login.hbs", { message: "Invalid credentials" })

        let compare = bcrypt.compareSync(password, find.password);
        let newdata = { name: find.name, email: find.email, mobile: find.mobile }
        if (!compare) return res.render("login.hbs", { message: "Incorrect Email or Password" })

        jwt.sign(newdata, process.env.secretkey, (err, token) => {
            if (err) return res.render("login.hbs", { message: err.message })
            res.cookie("jwtToken", token)
            res.render("home.hbs", ({ message2: find.name }));

        })



    } catch (error) {
        res.render("login.hbs", { message: error })
    }
}



//   logout

const logout = async (req, res) => {
    res.clearCookie("jwtToken")
    res.redirect("/homePage")
}





//  ------ contact us post api With nodemailer ----------

// pass: 'tlimcwenjrgcefjk'
const contactpage = async (req, res) => {
    try {
        let { name, email, message } = req.body;
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'deepvirk539@gmail.com',
                pass: 'tlimcwenjrgcefjk'
            }
        });

        var mailOptions = {
            from: "deepvirk539@gmail.com",
            to: req.body.email,
            subject: "we got your email",
            text: `hii ${req.body.email} is connected....`,

        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                res.render("home.hbs", { message: "mail not sent" })
                console.log(error);
            } else {
                res.render("home.hbs", { message: "Thanks For your Feedback !!" })
                console.log('Email sent: ' + info.response);
            }
        });

    } catch (error) {
        console.log(error)
    }
};

//  ---post api of OTP send on gmail for forgot password-----

let email_otp;
let find;
const emailpage = async (req, res) => {
    find = await userModel.findOne({ email: req.body.email });
    if (find) {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'deepvirk539@gmail.com',
                pass: 'tlimcwenjrgcefjk'
            }
        });
        email_otp = Math.floor(1000 + Math.random() * 9000);
        var mailOptions = {
            from: "deepvirk539@gmail.com",
            to: req.body.email,
            text: `Your Verification OTP for forgot password is ${email_otp}`,
            subject: "Forgot password OTP"

        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                res.render("otp.hbs", { message: "try again" })
                console.log(error);
            } else {
                res.render("otp.hbs")
                console.log(email_otp)
            }
        });
    }
};

// ----verify OTP---- 

const verifyotp = async (req, res) => {

    if (email_otp == req.body.email_otp) {
        res.render("password.hbs")
    } else {
        res.render("email.hbs")
    }

};

//    ----confirm password-----


const confirm_password = async (req, res) => {
    try {
        console.log(find)
        let salt = bcrypt.genSaltSync(10);
        let hashpass = bcrypt.hashSync(req.body.password, salt)
        let update = await userModel.updateOne({ _id: find._id }, {
            $set: {
                password: hashpass
            }
        })
        if (update) {
            res.render("login.hbs");
            console.log(find._id)
        } else {
            res.render("password.hbs")
            console.log(find._id)
        }

    } catch (error) {
        res.render(error)
    }
}


// .......Add Product Api.................

let newdata;
const addproductpage = async (req,res) =>{
    try{
        let {product_name,price,discount_price,description,category}=req.body
        let file = req.files.image
        cloudinary.uploader.upload(file.tempFilePath,async(err,data)=>{
            newdata ={
                product_name:product_name,
                price:price,
                discount_price:discount_price,
                description:description,
                category:category,
                image:data.url
            };
            let savedata=await Product.create(newdata);
            if(savedata) return res.render("addproduct.hbs",{message:"Your Product Upload Successfully..."});
            console.log(savedata)
            if(!savedata) return res.render("addproduct.hbs",{message:"Your Product Not Upload Successfully...Try again"});
        })
    }catch(error){
        res.render(error)
    }
}

// update product

const updateproduct = async (req,res)=>{ 
    try{
        const products = await Product.findById()
        console.log(products)

    //    res.render("product.hbs", { products });

    
}catch(error){
        res.render(error)
    };
};



//  Get Api's


const home = (req, res) => {
    res.render("home.hbs")
}

const login = (req, res) => {
    res.render("login.hbs")
}

const signup = (req, res) => {
    res.render("signup.hbs")
}

const cart = (req, res) => {
    res.render("cart.hbs")
}

const showContactPage = (req, res) => {
    res.render("contact.hbs",)
}

const password = (req, res) => {
    res.render("password.hbs")
}

const email = (req, res) => {
    res.render("email.hbs")
}

const otp = (req, res) => {
    res.render("otp.hbs")
}

const product = (req, res) => {
    res.render("product.hbs")
}

const addproduct = (req, res) => {
    res.render("addproduct.hbs")
}




module.exports = {
    register,
    home,
    login,
    loginpage,
    signup,
    cart,
    showContactPage,
    contactpage,
    email,
    emailpage,
    otp,
    verifyotp,
    password,
    confirm_password,
    logout,
    product,
    updateproduct,
    addproduct,
    addproductpage

}