const Wallet = require("../model/Wallet");
const Freelancer = require("../model/Freelancer");

// Get wallet balance by userId (For Companies)
const getWalletBalanceByUser = async (req, res) => {
    const { userId } = req.params; // Get userId from URL

    try {
        // Find wallet using userId
        const wallet = await Wallet.findOne({ userId });

        if (!wallet) {
            return res.status(404).json({ success: false, message: "Wallet not found" });
        }

        res.status(200).json({
            success: true,
            balance: wallet.balance,
            transactions: wallet.transactions, // Optional: Include transactions
        });

    } catch (error) {
        console.error("Error fetching wallet balance:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve wallet balance",
            error: error.message,
        });
    }
};

// Get wallet balance by freelancerId (For Freelancers)
const getWalletBalanceByFreelancer = async (req, res) => {
    const { freelancerId } = req.params; // Get freelancerId from URL

    try {
        // Find freelancer to get corresponding userId
        const freelancer = await Freelancer.findById(freelancerId);
        if (!freelancer) {
            return res.status(404).json({ success: false, message: "Freelancer not found" });
        }

        // Find wallet using the user's ID
        const wallet = await Wallet.findOne({ userId: freelancer.user });

        if (!wallet) {
            return res.status(404).json({ success: false, message: "Wallet not found" });
        }

        res.status(200).json({
            success: true,
            balance: wallet.balance,
            transactions: wallet.transactions, // Optional: Include transactions
        });

    } catch (error) {
        console.error("Error fetching wallet balance:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve wallet balance",
            error: error.message,
        });
    }
};


const transferMoney = async (req, res) => {
    console.log("transfer money api hit");
    const { senderId, freelancerId, amount } = req.body;

    if (!senderId || !freelancerId || !amount || amount <= 0) {
        return res.status(400).json({
            success: false,
            message: "Invalid input. Sender ID, Freelancer ID, and a positive amount are required.",
        });
    }

    try {
        const senderWallet = await Wallet.findOne({ userId: senderId });
        if (!senderWallet) {
            return res.status(404).json({ success: false, message: "Sender wallet not found." });
        }

        const freelancer = await Freelancer.findById(freelancerId);
        if (!freelancer || !freelancer.user) {
            return res.status(404).json({ success: false, message: "Freelancer not found or has no associated user." });
        }
        const receiverUserId = freelancer.user;

        let receiverWallet = await Wallet.findOne({ userId: receiverUserId });
        if (!receiverWallet) {
            return res.status(404).json({ success: false, message: "Receiver wallet not found." });
        }

        if (senderWallet.balance < amount) {
            return res.status(400).json({ success: false, message: "Insufficient balance." });
        }

        senderWallet.balance -= amount;
        receiverWallet.balance += amount;

        await senderWallet.save();
        await receiverWallet.save();

        return res.status(200).json({
            success: true,
            message: `Successfully transferred NPR ${amount} from Sender to Freelancer.`,
        });

    } catch (error) {
        console.error("Error transferring money:", error);
        return res.status(500).json({ success: false, message: "Transfer failed. Try again." });
    }
};


module.exports = { getWalletBalanceByUser, getWalletBalanceByFreelancer, transferMoney };
