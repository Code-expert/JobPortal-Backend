import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema({
    companyName:{
        type:String,
        required:true,
        unique:true,
    },
    description:{
        type:String,
    },
    website:{
        type:String,
    },
    location:{
        type:String,
    },
    logo:{
        type:String,
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    }
},{timestamps:true});
const Company  = mongoose.model('Company',CompanySchema);
export default Company;