const express = require("express");
const router = express.Router();

const {
  getConversations,
  getMessages,
  sendMessage,
} = require("../controllers/messageController");

const { updateStatus } = require("../controllers/statusController");
const { getUserInfo } = require("../controllers/userController");


// Message routes
router.get("/conversations", getConversations);
router.get("/messages/:wa_id", getMessages);
router.post("/send", sendMessage);

// Status routes
router.post("/status", updateStatus);

// User routes
router.get("/user/:wa_id", getUserInfo);


module.exports = router;
