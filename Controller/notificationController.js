const Notification = require("../model/Notification");

// Fetch notifications for a specific user
const getNotifications = async (req, res) => {
    const { userId, userType } = req.params;

    try {
        const notifications = await Notification.find({ recipient: userId, recipientType: userType })
            .sort({ createdAt: -1 });

        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Error fetching notifications", error });
    }
};

// Mark a notification as read
const markNotificationAsRead = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.notificationId,
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({ message: "Error updating notification", error });
    }
};

// Create a new notification (used in project awarding)
const createNotification = async (recipient, recipientType, message) => {
    try {
        const notification = new Notification({
            recipient,
            recipientType,
            message,
        });
        await notification.save();
        console.log("Notification sent:", notification);
    } catch (error) {
        console.error("Error creating notification:", error);
    }
};

module.exports = { getNotifications, markNotificationAsRead, createNotification };
