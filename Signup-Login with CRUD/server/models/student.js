const mongoose=require('mongoose')

const studentSchema=new mongoose.Schema({
    name: String,
    city: String,
    gender: String,
    education: { type: [String], required: true },
    image:String
}) 

const studentModel=mongoose.model('collection',studentSchema)
module.exports=studentModel