
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    wa_id: { type: String, index: true },
    meta_msg_id: { type: String, required: true, unique: true },
    from: String,
    to: String,
    timestamp: Date,
    message_type: {
      type: String,
      enum: ["text", "image", "video", "audio", "document"],
    },
    text: String,
    media_url: String,
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },
    direction: { type: String, enum: ["inbound", "outbound"], required: true },
    contact_name: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema, "processed_messages");
