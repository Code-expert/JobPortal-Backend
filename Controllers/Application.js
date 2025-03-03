import Application from "../Models/application.js";
import Job from "../Models/job.js";

export const applyJobs = async (req,res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;
        if (!jobId) {
            return res.status(400).json({
                message:"Job is required",
                success:false
            })
        };
    //check if the job  is already applied or not
    const existingApplication = await Application.findOne({job:jobId,Applicant:userId});
    if (existingApplication) {
        return res.status(400).json({
            message:"You have already applied for the job",
            success:false
        })
    };
    //check of the job exits
    const job =  await Job.findById(jobId);
    if (!job) {
        return res.status(400).json({
            message:"No Job Available",
            success:false
        })
    }
        const newApplicant = await  Application.create({
            job:jobId,
            Applicant:userId
        });
        job.applications.push(newApplicant._id);
        await job.save();
        return  res.status(201).json({
            message:"Job applied successfully",
            success:true    
        })
}
     catch (error) {
        console.log("apply jobs error",error);
    }
};
export const getAppliedJobs = async (req,res) => {
    try {
        const userId = req.id;
        const application = await Application.find({Applicant:userId}).sort({createdAt:-1}).populate({
            path:"job",
            options:{sort:{createdAt:-1}},
            populate:{
                path:"company",
                options:{sort:{createdAt:-1}},
            }
        });
        if (!application) {
            return res.status(400).json({
                message:"No job found",
                success:false
            })
        }

        return res.status(200).json({
            message:"Applied jobs fetched successfully",
            application,
            success:true,
        })

    }
     catch (error) {
        console.log("get applied jobs error",error);
    }
};
//admin will se  who have applied for the jobs
export const getApplications = async (req,res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).sort("-createdAt").populate({
            path:"applications",
            options:{sort:{createdAt:-1}},
            populate:{  
            path:"Applicant",
            options:{sort:{createdAt:-1}},
            }
        })
        if (!job) {
            return res.status(400).json({
                message:"No job found",
                success:false
            })
        }
        return res.status(200).json({
            message:"Applications fetched successfully",
            job,
            success:true,
        })
    } catch (error) {
        console.log("get applications error",error);
    }

};
//for  the update of the application status
export const updateStatus = async (req,res) => {
    try {
        const applicationId = req.params.id;
        const {status} = req.body;
        if (!status) {
            return res.status(400).json({
                message:"status is required",
                success:false
            })
        }
        const application = await Application.findById({_id:applicationId});
        if (!application) {
            return res.status(400).json({
                message:"No application found",
                success:false
            })
        }
        application.status = status;
        await application.save();
        return res.status(200).json({
            message:"Application status updated successfully",
            success:true
        })

            
        
    } catch (error) {
        console.log("update application error",error);
    }
};