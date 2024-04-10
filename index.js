import express from "express";
import path from "path";
import mongoose, { Schema } from "mongoose";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

const app = express();

const PORT = 3000;
const user = [];

//mongodb connection
mongoose
  .connect("mongodb://localhost:27017", {
    dbName: "backend",
  })
  .then(() => console.log("connected successfully"))
  .catch((e) => console.log(e));

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(path.resolve(), "public")));

app.use(cookieParser());

app.get("/public", (req, res) => {
  res.sendFile("public");
});
// middleware for is token exist or not
const moveToNextUser = async (req, res, next) => {
  const { token } = req.cookies;

  if (token) {
    const decodedValue = jwt.verify(token, "ksdjfkjskdf");

    req.user = await Entry.findById(decodedValue._id);

    next();
  } else {
    res.redirect("/login")
  }
};

//routes
app.get("/", moveToNextUser, (req, res) => {
  res.render("logout.ejs", { name: req.user.name }); // Assuming you have logout.ejs template
});

//make a schema for mongodb
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password:String,
});

//after that make a model ..
const Entry = mongoose.model("LoginList", userSchema);

//login so it gets cookie
app.post("/register", async (req, res) => {
  const { name, email,password } = req.body;
  let user = await Entry.findOne({ email });

  if (user) {
    return res.redirect("/login");
  }
  user = await Entry.create({
    name,
    email,
    password
  });


  //cookies

  app.get("/", (req, res) => {
    const { token } = req.cookies;
    if (token) {
      res.render("logout.ejs");
    } else {
      res.render("login.ejs");
    }
  });

  //jwt token
  const token = jwt.sign({ _id: user._id }, "ksdjfkjskdf");

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 1000),
  });

  res.redirect("/");
});

//new user registration 

app.get('/register',(req,res)=>{

  res.render('register.ejs')
})

//if the exist user wants to sign in then render to login page so 

app.get("/login",(req,res)=>{
  res.render("login.ejs")
})

// now handle the login page 

 app.post("/login", async(req,res)=>{
  
const {email,password} = req.body

let user =await Entry.findOne({email})

 if(!user)  return res.redirect("/register")
 
  let enterPass= user.password === password
   if(!enterPass) return res.render("login.ejs",{message:"*incorrect password"})
   
   const token = jwt.sign({ _id: user._id }, "ksdjfkjskdf");

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 1000),
  });

  res.redirect("/");
 })


//logout cookie are deleted
app.get("/logout", (req, res) => {
  res.cookie("token", null, {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`this is running on ${PORT}`);
});
