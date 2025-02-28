const axios = require("axios");
const Transaction = require("../model/Transaction");
const Wallet = require("../model/Wallet");

const initiateTransaction = async (req, res) => {
    const { userId, amount, paymentGateway } = req.body;

    if (!userId || !amount) {
        return res.status(400).json({
            success: false,
            message: "User ID and amount are required.",
        });
    }

    try {
        const purchase_order_id = `order_${Date.now()}`;
        const purchase_order_name = "Wallet Load";

        const transaction = new Transaction({
            userId,
            amount,
            paymentGateway,
            transactionId: purchase_order_id,
            status: "pending",
        });

        await transaction.save();
        console.log("Transaction created:", transaction);

        const khaltiResponse = await axios.post(
            "https://dev.khalti.com/api/v2/epayment/initiate/",
            {
                return_url: "http://localhost:5173/payment-callback",
                website_url: "http://localhost:5173",
                amount: amount * 100,
                purchase_order_id,
                purchase_order_name,
            },
            {
                headers: {
                    Authorization: `Key 30b1378dd0a94714b1bb34494df6ee02`,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("Khalti response (initiate):", khaltiResponse.data);

        const { pidx, payment_url } = khaltiResponse.data;

        res.status(201).json({
            success: true,
            message: "Transaction initiated successfully.",
            pidx,
            payment_url,
            transactionId: purchase_order_id,
        });

    } catch (err) {
        console.error("Error initiating transaction:", err.response?.data || err.message);

        res.status(500).json({
            success: false,
            message: "Failed to initiate transaction.",
            error: err.response?.data || err.message,
        });
    }
};

const verifyTransaction = async (req, res) => {
    const { pidx, transaction_id } = req.body;

    if (!pidx || !transaction_id) {
        return res.status(400).json({
            success: false,
            message: "pidx and transaction_id are required.",
        });
    }

    try {
        console.log("Verifying transaction with pidx:", pidx);

        const khaltiResponse = await axios.post(
            "https://dev.khalti.com/api/v2/epayment/lookup/",
            { pidx },
            {
                headers: {
                    Authorization: `Key 30b1378dd0a94714b1bb34494df6ee02`,
                },
            }
        );

        const { status, total_amount } = khaltiResponse.data;
        console.log("Khalti response (verify):", khaltiResponse.data);

        const transaction = await Transaction.findOne({ transactionId: transaction_id });

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found.",
            });
        }

        if (transaction.status === "success") {
            return res.status(400).json({
                success: false,
                message: "Transaction already verified and processed.",
            });
        }

        transaction.status = status.toLowerCase();
        await transaction.save();

        const wallet = await Wallet.findOneAndUpdate(
            { userId: transaction.userId },
            { $inc: { balance: total_amount / 100 } },
            { upsert: true, new: true }
        );

        return res.status(200).json({
            success: true,
            message: `Transaction verified successfully. Status: ${status}`,
            wallet,
        });

    } catch (err) {
        console.error("Error verifying transaction:", err.response?.data || err.message);

        res.status(500).json({
            success: false,
            message: "Transaction verification failed.",
            error: err.response?.data || err.message,
        });
    }
};



module.exports = {
    verifyTransaction,
    initiateTransaction
};