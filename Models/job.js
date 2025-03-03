
import mongoose from "mongoose";
import Application from "./application.js";

const JobSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    requirement:[{
        type:String,
        
    }],
    salary:{
        type:String,
        required:true,
    },
    ExperienceLevel:{
        type:String,
        required:true,
    },
    location:{
        type:String,
        required:true,
    },
    jobtype:{
        type:String,
        required:true,
    },
    Position:{
        type:String,
        required:true,
    },
    company:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Company',
        required:true,
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    applications:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Application',
        }
    ]
},{timestamps:true});

const Job = mongoose.model('Job',JobSchema);
export default  Job;