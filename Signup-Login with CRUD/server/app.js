const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')
const path=require('path')
const authRoute=require('./routes/authRoute')
const UserModel=require('./models/user')
const app=express()
const jwt=require('jsonwebtoken')
const nodemailer=require('nodemailer')
const bcrypt=require('bcryptjs')
app.use(cors())
app.use(express.json())
// Static folder for serving uploaded files// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect('mongodb://127.0.0.1:27017/LOGIN_SIGNUP_1').then(()=>{
    console.log('MongoDB connected Successfully')
}).catch((error)=>{
    console.log('MOngoDB connection Failed',error)
})


app.use('/api',authRoute)

app.listen(5000,()=>{
    console.log('Server running on Port 5000')
})

app.post('/forgot-password', (req, res) => {
    const {email} = req.body;
    UserModel.findOne({email: email})
    .then(user => {
        if(!user) {
            return res.send({Status: "User not existed"})
        } 
        const token = jwt.sign({id: user._id}, "jwt_secret_key", {expiresIn: "1d"})
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'subhojit.mitra18@gmail.com',
              pass: 'okxh hbai ffja hast'
            }
          });
          console.log(email)
          var mailOptions = {
            from: 'subhojit.mitra18@gmail.com',
            to: email,
            subject: 'Reset Password Link',
            text: `http://localhost:3000/reset-password/${user._id}/${token}`
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              return res.send({Status: "Success"})
            }
          });
    })
})


app.post('/reset-password/:id/:token', (req, res) => {
    const {id, token} = req.params
    const {password} = req.body
    console.log("Reset password Called")
    jwt.verify(token, "jwt_secret_key", (err, decoded) => {
        if(err) {
            return res.json({Status: "Error with token"})
        } else {
            bcrypt.hash(password, 10)
            .then(hash => {
                UserModel.findByIdAndUpdate({_id: id}, {password: hash})
                .then(u => res.send({Status: "Success"}))
                .catch(err => res.send({Status: err}))
            })
            .catch(err => res.send({Status: err}))
        }
    })
})