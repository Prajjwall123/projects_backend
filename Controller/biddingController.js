const Bidding = require("../model/Bidding");

// Create a new bid
const createBidding = async (req, res) => {
    try {
        const { freelancer, project, amount, message } = req.body;

        const newBid = new Bidding({
            freelancer,
            project,
            amount,
            message,
        });

        const savedBid = await newBid.save();
        res.status(201).json({ success: true, data: savedBid });
    } catch (error) {
        console.error("Error creating bid:", error);
        res.status(500).json({ success: false, message: "Failed to create bid" });
    }
};

// Update an existing bid
const updateBidding = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, message } = req.body;

        const updatedBid = await Bidding.findByIdAndUpdate(
            id,
            { amount, message },
            { new: true }
        );

        if (!updatedBid) {
            return res.status(404).json({ success: false, message: "Bid not found" });
        }

        res.status(200).json({ success: true, data: updatedBid });
    } catch (error) {
        console.error("Error updating bid:", error);
        res.status(500).json({ success: false, message: "Failed to update bid" });
    }
};

// Delete a bid
const deleteBidding = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedBid = await Bidding.findByIdAndDelete(id);

        if (!deletedBid) {
            return res.status(404).json({ success: false, message: "Bid not found" });
        }

        res.status(200).json({ success: true, message: "Bid successfully deleted" });
    } catch (error) {
        console.error("Error deleting bid:", error);
        res.status(500).json({ success: false, message: "Failed to delete bid" });
    }
};

// Get all bids
const getAllBiddings = async (req, res) => {
    try {
        const bids = await Bidding.find().populate("freelancer project");

        res.status(200).json({ success: true, data: bids });
    } catch (error) {
        console.error("Error fetching all bids:", error);
        res.status(500).json({ success: false, message: "Failed to fetch bids" });
    }
};

// Get all bids for a specific project
const getBiddingsByProject = async (req, res) => {
    try {
        const { projectId } = req.params;

        const bids = await Bidding.find({ project: projectId }).populate("freelancer");

        if (bids.length === 0) {
            return res.status(404).json({ success: false, message: "No bids found for this project" });
        }

        res.status(200).json({ success: true, data: bids });
    } catch (error) {
        console.error("Error fetching bids by project:", error);
        res.status(500).json({ success: false, message: "Failed to fetch bids" });
    }
};

module.exports = { createBidding, updateBidding, deleteBidding, getAllBiddings, getBiddingsByProject };