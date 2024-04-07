
import express from "express";
import path from 'path'
import  mongoose, { Schema }  from "mongoose";
import { name } from "ejs";
const app = express();

const PORT = 4000;
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

app.get('/public',(req,res)=>{
  res.sendFile('public')
})

app.get("/", (req, res) => {
//   res.sendStatus(300);
// res.json({name:"pratik"})
const filePath = path.resolve()
res.sendFile(path.join(filePath,'./index.html'))
res.render("index.ejs",{name:"pratik"})
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
 
 await Msg.create({name:req.body.name,email:req.body.email})
res.redirect('/success')
})



app.listen(PORT, () => {
  console.log(`this is running on ${PORT}`);
});
