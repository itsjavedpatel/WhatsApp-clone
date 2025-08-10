const PayloadService = require("../services/payloadService");

exports.initializeData = async (req, res) => {
  try {
    // console.log("Initializing data from payloads");
    const zipPath = await PayloadService.downloadZipPath();
    // console.log(zipPath);
    await PayloadService.processPayloads(zipPath);
    res.status(200).json({
      success: true,
      message: "Payloads processed successfully",
    });
  } catch (err) {
    
    res.status(500).json({
      success: false,
      message: "Initialization failed",
      error: err.message,
    });
  }
};
