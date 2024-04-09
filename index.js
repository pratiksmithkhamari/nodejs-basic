
import express from "express";
import path from 'path'
import  mongoose, { Schema }  from "mongoose";
import cookieParser from "cookie-parser";

const app = express();

const PORT = 3000;
const user= []

mongoose.connect("mongodb://localhost:27017",{
  dbName:"backend",
}).then(()=>console.log('connected successfully')).catch((e)=>console.log(e))

const userSchema = new mongoose.Schema({
  name:String,email:String
})

const Msg = mongoose.model('Message',userSchema)


//middleware
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(path.resolve(),'public')))

app.use(cookieParser())

app.get('/public',(req,res)=>{

  res.sendFile('public')
})

const moveToNextUser = (req,res,next)=>{
  const {token} = req.cookies
  if(token){
    res.render('logout.ejs')
  }else{
    res.render('login.ejs')
  }
}


//cookies

app.get('/',(req,res)=>{
  const {token} = req.cookies
  if(token){
    
    res.render('logout.ejs')
  }else{
    res.render('login.ejs')
  }
  
})
//login so it gets cookie
app.post('/login',(req,res)=>{
  res.cookie("token","pratik",{
    httpOnly:true,
    expires: new Date(Date.now() + 60 * 1000)
  })
  
  res.redirect('/')
  
})

//logout cookie are deleted
app.get('/logout',(req,res)=>{
  res.cookie("token",null,{
    httpOnly:true,
    expires: new Date(Date.now() )
  })
  
  res.redirect('/')
  
})

app.get('/logout',moveToNextUser,(req,res)=>{
  res.redirect('logout.ejs')
})

app.get("/", (req, res) => {
//   res.sendStatus(300);
// res.json({name:"pratik"})
const filePath = path.resolve()
res.sendFile(path.join(filePath,'./index.html'))
res.render("index.ejs")
});

app.get("/add", async (req, res) => {

 await Msg.create({name:"pratik",email:"test@gmail.com"})
    res.send('good job')
  
})
  


app.get("/users", (req, res) => {

  res.json({
    user,
  })
})

app.get("/success", (req, res) => {

  res.render('success.ejs')
})

app.post('/',async (req,res)=>{
 const {name,email} = req.body
 await Msg.create({name:name,email:email})
res.redirect('/success')
})

app.get('/newData',(req,res)=>{
  res.send('new users')
})

app.listen(PORT, () => {
  console.log(`this is running on ${PORT}`);
});
