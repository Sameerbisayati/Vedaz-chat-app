import User from "../models/User.js";
import Message from "../models/Message.js";

const getOnlineUsers = async () => {
  return await User.find({
    isOnline: true
  }).select(
    "_id username profilePhoto isOnline lastSeen"
  );
};

const sendUsersUpdate = async (io) => {
  const users = await User.find()
    .select(
      "_id username profilePhoto isOnline lastSeen"
    )
    .sort({ username: 1 });

  io.emit("users_update", users);
};

const setupSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("join", async ({ userId }) => {
      try {
        const user = await User.findById(userId);

        if (!user) {
          return;
        }

        await User.findByIdAndUpdate(userId, {
          socketId: socket.id,
          isOnline: true,
          lastSeen: null
        });

        socket.userId = userId;

        await Message.updateMany(
          {
            senderId: {
              $ne: userId
            },
            deliveredTo: {
              $ne: userId
            }
          },
          {
            $addToSet: {
              deliveredTo: userId
            }
          }
        );

        await sendUsersUpdate(io);
      } catch (error) {
        console.error("Join error:", error);
      }
    });
socket.on("typing_start", async () => {
  try {
    console.log("TYPING START:", socket.userId);

    if (!socket.userId) {
      console.log("No socket userId");
      return;
    }

    const user = await User.findById(socket.userId)
      .select("username");

    if (!user) {
      console.log("User not found");
      return;
    }

    console.log("Broadcasting typing:", user.username);

    socket.broadcast.emit("user_typing", {
      userId: socket.userId,
      username: user.username
    });
  } catch (error) {
    console.error("Typing start error:", error);
  }
});

socket.on("typing_stop", () => {
  console.log("TYPING STOP:", socket.userId);

  socket.broadcast.emit("user_stopped_typing", {
    userId: socket.userId
  });
});

    socket.on("messages_read", async ({ messageIds }) => {
      try {
        if (!socket.userId || !Array.isArray(messageIds)) {
          return;
        }

        await Message.updateMany(
          {
            _id: {
              $in: messageIds
            },
            senderId: {
              $ne: socket.userId
            }
          },
          {
            $addToSet: {
              readBy: socket.userId
            }
          }
        );

        const updatedMessages = await Message.find({
          _id: {
            $in: messageIds
          }
        });

        updatedMessages.forEach((message) => {
          io.emit("message_status", {
            messageId: message._id,
            deliveredTo: message.deliveredTo,
            readBy: message.readBy
          });
        });
      } catch (error) {
        console.error("Read message error:", error);
      }
    });

    socket.on("disconnect", async () => {
      try {
        if (!socket.userId) {
          return;
        }

        await User.findOneAndUpdate(
          {
            _id: socket.userId,
            socketId: socket.id
          },
          {
            socketId: null,
            isOnline: false,
            lastSeen: new Date()
          }
        );

        await sendUsersUpdate(io);

        console.log(
          "Socket disconnected:",
          socket.id
        );
      } catch (error) {
        console.error(
          "Disconnect error:",
          error
        );
      }
    });
  });
};

export default setupSocket;