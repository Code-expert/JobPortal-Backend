import Job from "../Models/job.js";

export const createJob = async (req, res) => {
    try {
        const{title,description,requirement,salary,ExperienceLevel,location,jobtype,Position,companyId} = req.body;
        const userId = req.id;
        if (!title ||!description|| !requirement || !salary || !ExperienceLevel || !location || !jobtype || !Position||!companyId ) {
            return res.status(400).json({
                message: "Please fill all the fields",
                success: false,
            });
            
        }
        const job = await Job.create({
            title,
            description,
            requirement:requirement.split(","),
            salary:Number(salary),
            ExperienceLevel,
            location,
            jobtype,
            Position,
            company:companyId,
            createdBy:userId,
        });
        return res.status(201).json({
            message: "Job Created Successfully",
            job,
            success: true,
        });
    } catch (error) {
        console.log("Create Job Error", error);
    }
};
export const getJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword ||"";
        const query = {
            $or:[
                {title:{
                    $regex:keyword,
                    $options:"i",
                }},
                {description:{
                    $regex:keyword,
                    $options:"i",
                }},
               
            ]
        };
        const jobs = await Job.find(query).populate({
            path:"company",
        }).sort("-createdAt");

        if (!jobs) {
            return res.status(400).json({
                message: "Job not found",
                success: false,
            });
        };

        return res.status(200).json({
            jobs,
            success: true,
        });
    } catch (error) {
       console.log("Get Jobs Error",error); 
    }
};
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path:"applications"
        });
        if (!job) {
            return res.status(400).json({
                message: "Job not found",
                success: false,
            });
        };
        return res.status(200).json({
            job,
            success: true,
        });

    } catch (error) {
     console.log("Get Job By Id Error",error);   
    }
};
export const getAdminsJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({createdBy:adminId}).populate({
            path:"company",
            createdAt:-1,
        });
        if (!jobs) {
            return res.status(400).json({
                message: "Jobs not found",
                success: false,
            });
        };
        return res.status(200).json({
            jobs,
            success: true,
        });
    }
        catch(error) {
            console.log("Get Admins Jobs Error",error);
        }
};
// export const updateJob = async (req, res) => {
//     try {
//         const jobId = req.params.id;
//         const {title,description,requirement,salary,ExperienceLevel,location,jobtype,Position} = req.body;
//         const updateData = {
//             title,
//             description,
//             requirement,
//             salary,
//             ExperienceLevel,
//             location,
//             jobtype,
//             Position,
//         };
//         const job = await Job.findByIdAndUpdate(jobId, updateData, {new:true});
//         if (!job) {
//             return res.status(400).json({
//                 message: "Job not found",
//                 success: false,
//             });
//         };
//         return res.status(200).json({
//             message: "Job Updated Successfully",
//             job,
//             success: true,
//         });
//     } catch (error) {
//         console.log("Update Job Error",error);
//     }
// };