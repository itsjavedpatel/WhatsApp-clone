const AdmZip = require("adm-zip");
const fs = require("fs");
const path = require("path");
const Message = require("../models/Message");

class PayloadService {
  static async downloadZipPath() {
    try {
      console.log("I'm here to download zip");
      const zipPath = path.join(__dirname, "../payload.zip");
      console.log("zipPath", zipPath);
      return zipPath;
    } catch (error) {
      console.log(error);
    }
  }

  static async processPayloads(zipPath) {
    const zip = new AdmZip(zipPath);
    const zipEntries = zip.getEntries();

    // Process messages 
    for (const entry of zipEntries.filter(
      (e) => e.entryName.includes("message_") && e.entryName.endsWith(".json")
    )) {
      await this.processMessagePayload(entry);
    }

    // Then process statuses
    for (const entry of zipEntries.filter(
      (e) => e.entryName.includes("status_") && e.entryName.endsWith(".json")
    )) {
      await this.processStatusPayload(entry);
    }
  }

  static async processMessagePayload(entry) {
    const content = entry.getData().toString("utf8");
    const payload = JSON.parse(content);
    const change = payload.metaData?.entry?.[0]?.changes?.[0];

    if (!change || change.field !== "messages") return;

    const messageData = change.value.messages[0];
    const contact = change.value.contacts?.[0];
    const metadata = change.value.metadata;

    const message = {
      wa_id: contact?.wa_id || messageData.from,
      meta_msg_id: messageData.id,
      from: messageData.from,
      to: metadata?.phone_number_id || "system",
      timestamp: new Date(parseInt(messageData.timestamp) * 1000),
      message_type: messageData.type,
      text: messageData.text?.body,
      direction:
        metadata?.display_phone_number === messageData.from
          ? "outbound"
          : "inbound",
      contact_name: contact?.profile?.name,
      status: "sent",
    };

    try {
      await Message.findOneAndUpdate(
        { meta_msg_id: message.meta_msg_id },
        message,
        { upsert: true, new: true }
      );
      console.log(`Processed message: ${message.meta_msg_id}`);
    } catch (err) {
      console.error(
        `Error processing message ${message.meta_msg_id}:`,
        err.message
      );
    }
  }

  static async processStatusPayload(entry) {
    const content = entry.getData().toString("utf8");
    const payload = JSON.parse(content);
    const change = payload.metaData?.entry?.[0]?.changes?.[0];

    if (!change || change.field !== "messages") return;

    const statusData = change?.value?.statuses?.[0];

    try {
      const updated = await Message.findOneAndUpdate(
        { meta_msg_id: statusData?.id },
        { status: statusData?.status },
        { new: true }
      );

      if (updated) {
        console.log(
          `Updated status for ${statusData?.id} to ${statusData?.status}`
        );
      } else {
        console.log(`Message not found for status update: ${statusData?.id}`);
      }
    } catch (err) {
      console.error(`Error updating status for ${statusData.id}:`, err.message);
    }
  }
}

module.exports = PayloadService;
