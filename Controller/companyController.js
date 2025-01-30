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

const updateCompany = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const company = await Company.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        }).populate("user", "name email role");

        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        console.log("Company Updated:", company);
        res.status(200).json(company);
    } catch (error) {
        console.error("Error updating company:", error);
        res.status(400).json({ message: error.message });
    }
};

const deleteCompany = async (req, res) => {
    const { id } = req.params;

    try {
        const company = await Company.findByIdAndDelete(id);

        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        console.log("Company Deleted:", company);
        res.status(200).json({ message: "Company deleted successfully" });
    } catch (error) {
        console.error("Error deleting company:", error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllCompanies,
    getCompanyById,
    updateCompany,
    deleteCompany,
};
