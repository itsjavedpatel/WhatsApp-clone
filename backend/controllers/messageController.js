// controllers/messageController.js
const Message = require("../models/Message");

exports.getConversations = async (req, res) => {
  try {
    const conversations = await Message.aggregate([
      {
        $group: {
          _id: "$wa_id",
          lastMessage: { $last: "$timestamp" },
          contact_name: { $first: "$contact_name" },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$direction", "inbound"] },
                    { $ne: ["$status", "read"] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      { $sort: { lastMessage: -1 } },
    ]);

    res.json(conversations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { wa_id } = req.params;
    const messages = await Message.find({ wa_id }).sort({ timestamp: 1 });

    // Mark messages as read when fetched
    await Message.updateMany(
      {
        wa_id,
        direction: "inbound",
        status: { $ne: "read" },
      },
      { status: "read" }
    );

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { wa_id, text } = req.body;

    // Get contact info from existing messages
    const lastMessage = await Message.findOne({ wa_id }).sort({
      timestamp: -1,
    });

    const newMessage = new Message({
      wa_id,
      meta_msg_id: `demo-${Date.now()}`,
      from: "system", // Your business number in production
      to: wa_id,
      timestamp: new Date(),
      message_type: "text",
      text,
      status: "sent",
      direction: "outbound",
      contact_name: lastMessage?.contact_name || wa_id,
    });

    await newMessage.save();

    // Emit real-time update
    req.io.to(wa_id).emit("new_message", newMessage);

    // Simulate status updates
    setTimeout(async () => {
      await Message.updateOne(
        { meta_msg_id: newMessage.meta_msg_id },
        { status: "delivered" }
      );
      req.io.to(wa_id).emit("status_update", {
        message_id: newMessage.meta_msg_id,
        status: "delivered",
      });
    }, 1000);

    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
