const express = require("express");
const { ExpressValidator,check } = require("express-validator");
const router = express.Router();
let auth=require("../middleware/userMiddleware")

const { register,home,login,signup,cart,loginpage,showContactPage,contactpage,password,email,emailpage,otp,verifyotp,confirm_password,logout,product } = require("../controller/userController")

router.post("/signup",[
    check("name").isLength({min:3}).withMessage("name is too short"),
    check("email").isEmail().withMessage("Invalid Email"),
    check("password").isStrongPassword().withMessage("Enter Strong password"),
    check("mobile").isMobilePhone().withMessage("Enter Valid Mobile number")],register);

router.get("/homePage",auth,home)
router.get("/signup",signup)
router.get("/cart",auth,cart)
router.get("/login",login)
router.post("/login",loginpage)
router.get("/contact",auth,showContactPage)
router.post("/contact",auth,contactpage)
router.get("/verifyemail",email)
router.post("/verifyemail",emailpage)
router.get("/otp",otp)
router.post("/otp",verifyotp)
router.get("/password",password)
router.post("/password",confirm_password)
router.get("/logout",logout)
router.get("/product",auth,product)





module.exports = router;
