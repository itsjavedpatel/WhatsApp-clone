const express = require("express");
const router = express.Router();

// Import controller methods directly
const {
  getConversations,
  getMessages,
  sendMessage,
} = require("../controllers/messageController");

const { updateStatus } = require("../controllers/statusController");
const { getUserInfo } = require("../controllers/userController");
// const { getMedia } = require('../controllers/mediaController');

// Message routes
router.get("/conversations", getConversations);
router.get("/messages/:wa_id", getMessages);
router.post("/send", sendMessage);

// Status routes
router.post("/status", updateStatus);

// User routes
router.get("/user/:wa_id", getUserInfo);

// Media routes
// router.get('/media/:message_id', getMedia);

module.exports = router;
