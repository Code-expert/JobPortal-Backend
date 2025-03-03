import Company from '../Models/Company.js';
import getDataUri from '../Connection/datauri.js';
import cloudinary from '../Connection/cloudinary.js';

export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;
        if (!companyName) {
            return res.status(400).json({
                message: "Company Name is required",
                success: false,
            })
        }
        let company = await Company.findOne({companyName});
        if (company) {
            return res.status(400).json({
                message: "Company already exists with this name",
                success: false,
            })
        }
        company = await Company.create({
            companyName,
            userId: req.id,
        });
        return res.status(201).json({
            message: "Company Registered Successfully",
            company,
            success: true,
        });
    } catch (error) {
        console.log("Register Company error", error);
    }
};
export const getCompanies = async (req, res) => {
    try {
        const userId = req.id;
        const companies = await Company.find({ userId });
        if (!companies) {
            return res.status(400).json({
                message: "No Company Found",
                success: false,
            })
        }
        return res.status(200).json({
            companies,
            success: true,
        });

    } catch (error) {
        console.log("Get Companies Error", error);
    }
};
export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById( companyId );
        if (!company) {
            return res.status(400).json({
                message: "Company not found",
                success: false,
            })
        }
        return res.status(200).json({
            company,
            success: true,
        })
    } catch (error) {
        console.log("Get Company By Id Error", error);
    }
};
export const updateCompany = async (req, res) => {
    try {
        const companyId = req.params.id;
        const { companyName, description, website, location } = req.body;

        const file = req.file;
        const fileUri = getDataUri(file);   
        const cloudResponse = await  cloudinary.uploader.upload(fileUri.content);
        const logo =  cloudResponse.secure_url;

        const updateData = {
            companyName,    
            description,
            website,
            location,
            logo,
        }
        const company = await Company.findByIdAndUpdate(companyId, updateData, { new: true });
        if (!company) {
            return res.status(400).json({
                message: "Company not found",
                success: false,
            })
        }
        return res.status(200).json({
            message: "Company Updated Successfully",
            success: true,
        });
    } catch (error) {
        console.log("Update Company Error", error);
    }
};