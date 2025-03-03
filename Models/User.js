import mongoose from "mongoose";
 
const UserSchema = new mongoose.Schema({
    Fullname:{
        type:String,
        required:true,
    },
    Email:{
        type:String,
        required:true,
        unique:true,
    },
    PhoneNumber:{
        type:Number,
        required:true,
    },
    Password:{
        type:String,
        required:true,
    },
    Role:{
        type:String,
        enum:['employee','recruiter'],
        required:true,
    },
    Profile:{
        bio:{type:String},
        skills:[{type:String}],
        resume:{type:String},  //URL of Resume
        ResumeoriginalName:{type:String},
        company:{type:mongoose.Schema.Types.ObjectId,ref:'Company'},
        ProfilePhoto:{
            type:String,
            default:"",
        },
    },

   

},{timestamps:true});
const User =  mongoose.model('User',UserSchema);
export default User;