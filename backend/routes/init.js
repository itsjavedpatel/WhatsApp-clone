// backend/routes/init.js
const express = require("express");
const router = express.Router();
const initController = require("../controllers/initController");

router.post("/initialize", initController.initializeData);

module.exports = router;
