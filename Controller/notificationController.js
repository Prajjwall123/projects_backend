const Notification = require("../model/Notification");

// Fetch notifications for a specific user
const getNotifications = async (req, res) => {
    const { userId, userType } = req.params;
    console.log("Fetching notifications for user:", userId, "of type:", userType);

    try {
        const formattedUserType =
            userType.charAt(0).toUpperCase() + userType.slice(1).toLowerCase();

        // Select only the fields we need (by default, _id is included)
        const notifications = await Notification.find({
            recipient: userId,
            recipientType: formattedUserType,
        })
            .select("recipient recipientType message isRead createdAt")
            .sort({ createdAt: -1 });

        // Map _id to id
        const formattedNotifications = notifications.map((notification) => ({
            id: notification._id,
            recipient: notification.recipient,
            recipientType: notification.recipientType,
            message: notification.message,
            isRead: notification.isRead,
            createdAt: notification.createdAt,
        }));

        if (formattedNotifications.length === 0) {
            console.log("No notifications found for", userId);
        }

        res.status(200).json(formattedNotifications);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res
            .status(500)
            .json({ message: "Error fetching notifications", error: error.message });
    }
};



// Mark a notification as read
const markNotificationAsRead = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.notificationId,
            { isRead: true },
            { new: true, timestamps: true } // Ensure updatedAt is updated
        ).select("_id isRead updatedAt");

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        // Ensure updatedAt is always present
        const updatedAt = notification.updatedAt ? notification.updatedAt.toISOString() : new Date().toISOString();

        res.status(200).json({
            id: notification._id.toString(),
            isRead: notification.isRead,
            updatedAt: updatedAt,
        });
    } catch (error) {
        console.error("Error updating notification:", error);
        res.status(500).json({ message: "Error updating notification", error: error.message });
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
