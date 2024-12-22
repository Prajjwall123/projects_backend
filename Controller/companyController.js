const Company = require("../model/Company");

const getAllCompanies = async (req, res) => {
    try {
        const companies = await Company.find().populate("user", "name email role");
        res.status(200).json(companies);
    } catch (error) {
        console.error("Error fetching companies:", error);
        res.status(500).json({ message: error.message });
    }
};

const getCompanyById = async (req, res) => {
    const { id } = req.params;
    try {
        const company = await Company.findById(id).populate("user", "name email role");

        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        res.status(200).json(company);
    } catch (error) {
        console.error("Error fetching company:", error);
        res.status(500).json({ message: error.message });
    }
};

const createCompany = async (req, res) => {
    try {
        const { user, name, companyBio, employees, logo, projectsAwarded, projectsPosted, projectsCompleted } = req.body;

        const existingCompany = await Company.findOne({ user });
        if (existingCompany) {
            return res.status(400).json({ message: "A company profile already exists for this user" });
        }

        const company = new Company({
            user,
            name,
            companyBio,
            employees,
            logo,
            projectsAwarded,
            projectsPosted,
            projectsCompleted,
        });

        await company.save();
        console.log("Company Created:", company);

        res.status(201).json(company);
    } catch (error) {
        console.error("Error creating company:", error);
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getAllCompanies,
    getCompanyById,
    createCompany,
};
