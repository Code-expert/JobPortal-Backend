
import mongoose from "mongoose";

const ApplicationSchema =  new mongoose.Schema({
    job:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Job',
        required:true,
    },
    Applicant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    status:{
        type:String,
        enum:['pending','Accepted','Rejected'],
        default:'pending',
    }
},{timestamps:true});
const Application = mongoose.model('Application',ApplicationSchema);
export default Application;