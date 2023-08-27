require("dotenv").config();
let jwt =require("jsonwebtoken");
let auth=(req,res,next)=>{

    try{
    // console.log(req.cookies.jwtToken)
if(!req.cookies?.jwtToken) return res.redirect("/login");
let verifyToken=jwt.verify(req.cookies?.jwtToken,process.env. secretkey);
if(!verifyToken)  return res.redirect("/login");
switch(req.url){
    case "/homePage":return res.render("home.hbs",{message2:verifyToken.name});
    break;
    case "/contact":return res.render("contact.hbs",{message2:verifyToken.name});
    break;
    case "/product":return res.render("product.hbs",{message2:verifyToken.name});
    break;
    default:return res.redirect("/login");

}
// return res.render("home.hbs",{message2:verifyToken.name});
next();
    }catch(err){
return err.message
    }
}

module.exports=auth