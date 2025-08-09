
const Message = require("../models/Message");

exports.getUserInfo = async (req, res) => {
  try {
    const { wa_id } = req.params;

    const userData = await Message.findOne({ wa_id })
      .sort({ timestamp: -1 })
      .select("contact_name wa_id");

    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    const stats = {
      totalMessages: await Message.countDocuments({ wa_id }),
      lastInteraction: (
        await Message.findOne({ wa_id })
          .sort({ timestamp: -1 })
          .select("timestamp")
      ).timestamp,
    };

    res.json({
      contact_name: userData.contact_name,
      wa_id: userData.wa_id,
      ...stats,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
