import Message from "../models/Message.js";

const createMessage = async (
  senderId,
  senderName,
  senderPhoto,
  text,
  deliveredTo = []
) => {
  const message = await Message.create({
    senderId,
    senderName,
    senderPhoto,
    text,
    deliveredTo
  });

  return message;
};

const getMessages = async () => {
  return await Message.find()
    .sort({ createdAt: 1 })
    .limit(100);
};

export {
  createMessage,
  getMessages
};