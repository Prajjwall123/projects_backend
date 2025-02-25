const express = require("express");
const { getNotifications, markNotificationAsRead } = require("../controller/notificationController");

const router = express.Router();

// Get notifications for a user
router.get("/:userId/:userType", getNotifications);

// Mark a notification as read
router.put("/mark-read/:notificationId", markNotificationAsRead);

module.exports = router;
