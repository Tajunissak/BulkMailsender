const express = require("express")
const cors = require("cors")
const mongoose =require("mongoose")
const nodemailer = require("nodemailer")
const data = express()
require("dotenv").config();
const frontendUrls = process.env.FRONTEND_URL;
const mongoDbUrl = process.env.MONGO_DB_URL;

data.use(express.json())

data.use(
    cors({
      origin: process.env.FRONTEND_URL,
      methods: "GET, POST, PUT, DELETE",
      allowedHeaders: "Content-Type, Authorization",
      credentials: true,
    })
  );

mongoose.connect(`${mongoDbUrl}`).then(function(data){
    console.log("db is connected")
}).catch(function(){
    console.log("Db is not connected")
});


const credentialSchema = new mongoose.Schema({
    user: String,
    pass: String
});

const credential = mongoose.model("credential", credentialSchema, "bulkmail");



data.post("/sendemail", function(req, res){
   var msg = req.body.msg
   var namefield = req.body.namefield
   var mailfrom = req.body.mailfrom
   var subj = req.body.subj
   var emails = req.body.emails;

   credential.find().then(function(data){

    const email = data[0].user
    const pass = data[0].pass
    console.log(email,pass)

    const transport = nodemailer.createTransport({
        service:"gmail",
         auth:{
            user: email,
            pass: pass,
         }
         
        })
        new Promise(async function(resolve,reject){
            try{
                for(var i=0; i<emails.length; i++){
                   await transport.sendMail(
                        {
                        from: `"${namefield}" <${mailfrom}>`,
                        to:emails[i],
                        subject:subj,
                        text:msg
                     },)
                     console.log("email sent successfully:"+emails[i])
                   }
                   resolve("success")
                   
               }
               catch(error) {
                console.log("Mail sending error:", error);
                reject("Mail sending failed");
            }
            
          }).then(function(){
            res.send(true)
          }).catch(function(){
            res.send(false)
          })
})
.catch(function(error){
    console.log(error)
})
   
   
     
})


data.listen(5000,function(){
    console.log("server started")
})
