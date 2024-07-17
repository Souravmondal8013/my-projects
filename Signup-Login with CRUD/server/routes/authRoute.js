const authController=require('../controllers/authController')
const jwt=require('jsonwebtoken')
const bcryptjs=require('bcryptjs')
const User=require('../models/user')
const multer=require('multer')
const nodemailer=require('nodemailer')
const express=require('express')
const studentModel=require('../models/student')

const router=express.Router()


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

router.post('/createStudent',upload.single('image'),async (req,res)=>{
  console.log("createStudent Called:")
  const { name, city, gender, education } = req.body;
  console.log(name,city, gender, education)
const image = req.file;
try {
  const student = new studentModel({
      name:name,
      city: city,
      gender: gender,
      education: education.split(','),
      image:image?image.path:null
    });
    await student.save()
    console.log("Data Saved")
    return res.status(201).json({student});
} catch (error) {
  console.log(error)
  return res.status(300).json({ error: 'Server error' });
}
})

router.get('/',(req,res)=>{
  studentModel.find()
  .then(users => res.json(users))
  .catch(err => res.json(err))
})

router.get('/updateStudent/:id',async (req,res)=>{
  const id = req.params.id
  await studentModel.findById({_id:id})
  .then(users => res.json(users))
  .catch(err => res.json(err)) 
})

router.put('/editStudent/:id', upload.single('image'), async (req, res) => {
  const id = req.params.id;
  const image = req.file;
  const { name, city, gender, education } = req.body;

  try {
    const updateData = {
      name: name,
      city: city,
      gender: gender,
      education: JSON.parse(education), // Parse education back to array
    };

    if (image) {
      updateData.image = image.path;
    }

    const updatedStudent = await studentModel.findByIdAndUpdate(
      { _id: id },
      updateData,
      { new: true } // This option returns the updated document
    );

    res.json(updatedStudent);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


router.delete('/deleteStudent/:id',(req,res)=>{
  const id=req.params.id
  studentModel.findByIdAndDelete({_id:id})
  .then(res => res.json(res))
  .catch(err => res.json(err))
})




// Define routes
router.post('/register',upload.single('image'),authController.register);
router.post('/login',authController.login)
router.put('/profile', upload.single('image'), authController.editProfile);
router.delete('/delete-account',authController.deleteAccount)
router.get('/logout', (req, res) => {
    res.clearCookie('token')
    return res.status(200).json({ status: "successful" })
})

router.post('/verifyemail', async (req,res)=>{
    try {
        const {email} = req.body
        
        const existingUser=await User.findOne({email})

        if(existingUser)
          {
            return res.status(250).json({message:'User Already Exists'})
          }
        
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'subhojit.mitra18@gmail.com',
              pass: 'okxh hbai ffja hast'
            }
          });
          
          var mailOptions = {
            from: 'subhojit.mitra18@gmail.com',
            to: email,
            subject: 'Email verification Link ohh yaa',
            text: `http://localhost:3000/verifyemail/${email}`
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
             return res.status(200).json({message: "mail sent"})
            }
          });
          

    } catch (error) {
        console.log(error)
    }
})


module.exports=router