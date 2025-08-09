
const Message = require("../models/Message");

exports.updateStatus = async (req, res) => {
  try {
    const { message_id, status } = req.body;

    const updated = await Message.findOneAndUpdate(
      { meta_msg_id: message_id },
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Emit real-time update
    req.io.to(updated.wa_id).emit("status_update", {
      message_id,
      status,
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
