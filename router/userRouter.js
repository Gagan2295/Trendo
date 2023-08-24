const express = require("express");
const { ExpressValidator,check } = require("express-validator");
const router = express.Router();

const { register,home,login,signup,cart,loginpage,contact,contactpage,password,email,emailpage,otp,verifyotp,confirm_password,logout } = require("../controller/userController")

router.post("/signup",[
    check("name").isLength({min:3}).withMessage("name is too short"),
    check("email").isEmail().withMessage("Invalid Email"),
    check("password").isStrongPassword().withMessage("Enter Strong password"),
    check("mobile").isMobilePhone().withMessage("Enter Valid Mobile number"),
] ,register)
router.get("/home",home)
router.get("/signup",signup)
router.get("/cart",cart)
router.get("/login",login)
router.post("/login",loginpage)
router.get("/contact",contact)
router.post("/contact",contactpage)
router.get("/verifyemail",email)
router.post("/verifyemail",emailpage)
router.get("/otp",otp)
router.post("/otp",verifyotp)
router.get("/password",password)
router.post("/password",confirm_password)
// router.post("/logout",logout)
router.get("/logout",logout)

// router.get("/logout",logout)





module.exports = router;
