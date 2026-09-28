import User from "../models/User.js";
import Message from "../models/Message.js";

import {
  createMessage,
  getMessages
} from "../services/messageService.js";

const fetchMessages = async (req, res) => {
  try {
    const messages = await getMessages();

    res.json(messages);
  } catch (error) {
    console.error("Fetch messages error:", error);

    res.status(500).json({
      message: "Unable to fetch messages"
    });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { senderId, text } = req.body;

    if (!senderId || !text?.trim()) {
      return res.status(400).json({
        message: "Sender and message are required"
      });
    }

    const user = await User.findById(senderId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const onlineUsers = await User.find({
      isOnline: true,
      _id: {
        $ne: senderId
      }
    }).select("_id");

    const deliveredTo = onlineUsers.map(
      (item) => item._id
    );

    const message = await createMessage(
      user._id,
      user.username,
      user.profilePhoto,
      text.trim(),
      deliveredTo
    );

    const io = req.app.get("io");

    if (io) {
      io.emit("new_message", message);
    }

    res.status(201).json(message);
  } catch (error) {
    console.error("Send message error:", error);

    res.status(500).json({
      message: "Unable to send message"
    });
  }
};

export {
  fetchMessages,
  sendMessage
};