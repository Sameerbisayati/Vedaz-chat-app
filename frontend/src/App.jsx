import { useCallback, useEffect, useState } from "react";

import Login from "./components/Login";
import ChatHeader from "./components/ChatHeader";
import MessageList from "./components/MessageList";
import MessageInput from "./components/MessageInput";
import TypingIndicator from "./components/TypingIndicator";
import UserStatus from "./components/UserStatus";

import {
  getMessages,
  sendMessage
} from "./services/api";

import socket from "./services/socket";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

const getPhotoUrl = (photo) => {
  if (!photo) {
    return "";
  }

  if (photo.startsWith("http")) {
    return photo;
  }

  return `${API_URL}${photo}`;
};

function App() {
  const [currentUser, setCurrentUser] =
    useState(() => {
      const saved =
        localStorage.getItem("chatUser");

      return saved
        ? JSON.parse(saved)
        : null;
    });

  const [messages, setMessages] =
    useState([]);

  const [users, setUsers] = useState([]);

  const [typingUser, setTypingUser] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const loadMessages = async () => {
    try {
      setLoading(true);

      const data = await getMessages();

      setMessages(data);
    } catch (error) {
      console.error(
        "Unable to load messages:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    socket.disconnect();

    localStorage.removeItem("chatUser");

    setCurrentUser(null);
    setMessages([]);
    setUsers([]);
  };

  const handleSend = async (text) => {
    try {
      await sendMessage(
        currentUser._id,
        text
      );
    } catch (error) {
      console.error(
        "Unable to send message:",
        error
      );
    }
  };

  const handleMessagesRead = useCallback(
    (messageIds) => {
      if (
        socket.connected &&
        messageIds.length > 0
      ) {
        socket.emit("messages_read", {
          messageIds
        });
      }
    },
    []
  );

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    loadMessages();

    const handleConnect = () => {
      socket.emit("join", {
        userId: currentUser._id
      });
    };

    const handleNewMessage = (message) => {
      setMessages((previous) => {
        const exists = previous.some(
          (item) => item._id === message._id
        );

        if (exists) {
          return previous;
        }

        return [...previous, message];
      });
    };

    const handleUsersUpdate = (updatedUsers) => {
      setUsers(updatedUsers);
    };

    const handleTyping = ({
  userId,
  username
}) => {
  console.log("RECEIVED TYPING:", {
    userId,
    username,
    currentUser: currentUser._id
  });

  if (userId !== currentUser._id) {
    console.log("SETTING TYPING USER:", username);
    setTypingUser(username);
  }
};

const handleStoppedTyping = ({
  userId
}) => {
  console.log("RECEIVED TYPING STOP:", userId);

  if (userId !== currentUser._id) {
    setTypingUser("");
  }
};


    const handleMessageStatus = ({
      messageId,
      deliveredTo,
      readBy
    }) => {
      setMessages((previous) =>
        previous.map((message) =>
          message._id === messageId
            ? {
                ...message,
                deliveredTo,
                readBy
              }
            : message
        )
      );
    };

    socket.on("connect", handleConnect);
    socket.on(
      "new_message",
      handleNewMessage
    );
    socket.on(
      "users_update",
      handleUsersUpdate
    );
    socket.on(
      "user_typing",
      handleTyping
    );
    socket.on(
      "user_stopped_typing",
      handleStoppedTyping
    );
    socket.on(
      "message_status",
      handleMessageStatus
    );

    if (!socket.connected) {
      socket.connect();
    } else {
      handleConnect();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off(
        "new_message",
        handleNewMessage
      );
      socket.off(
        "users_update",
        handleUsersUpdate
      );
      socket.off(
        "user_typing",
        handleTyping
      );
      socket.off(
        "user_stopped_typing",
        handleStoppedTyping
      );
      socket.off(
        "message_status",
        handleMessageStatus
      );
    };
  }, [currentUser]);

  const handleTypingStart = () => {
    socket.emit("typing_start");
  };

  const handleTypingStop = () => {
    socket.emit("typing_stop");
  };

  if (!currentUser) {
    return (
      <Login onLogin={handleLogin} />
    );
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-small">
            💬
          </div>

          <div>
            <h1>ChatWave</h1>
            <span>Real-time chat</span>
          </div>
        </div>

        <div className="profile-card">
          <div className="profile-avatar">
            {getPhotoUrl(
              currentUser.profilePhoto
            ) ? (
              <img
                src={getPhotoUrl(
                  currentUser.profilePhoto
                )}
                alt={currentUser.username}
              />
            ) : (
              <div className="avatar-fallback">
                {currentUser.username
                  .charAt(0)
                  .toUpperCase()}
              </div>
            )}

            <span className="status-dot" />
          </div>

          <div>
            <strong>
              {currentUser.username}
            </strong>

            <span className="online-text">
              Online
            </span>
          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        <div className="users-heading">
          <span>People</span>
          <span>{users.length}</span>
        </div>

        <div className="users-list">
          {users.map((user) => (
            <UserStatus
              key={user._id}
              user={{
                ...user,
                profilePhoto:
                  getPhotoUrl(
                    user.profilePhoto
                  )
              }}
              currentUser={currentUser}
            />
          ))}
        </div>
      </aside>

      <main className="chat">
        <ChatHeader
          currentUser={currentUser}
          onlineUsers={users.filter(
            (user) => user.isOnline
          )}
          typingUser={typingUser}
        />

        {loading && messages.length === 0 ? (
          <div className="loading">
            Loading messages...
          </div>
        ) : (
          <MessageList
            messages={messages}
            currentUser={currentUser}
            onMessagesRead={
              handleMessagesRead
            }
          />
        )}

        <TypingIndicator
          username={typingUser}
        />

        <MessageInput
          onSend={handleSend}
          onTypingStart={
            handleTypingStart
          }
          onTypingStop={
            handleTypingStop
          }
        />
      </main>
    </div>
  );
}

export default App;