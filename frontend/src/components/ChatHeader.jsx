import React, { useState } from "react";
import { MoreVertical, Search } from "lucide-react";

const DEFAULT_AVATAR =
  "https://cdn-icons-png.flaticon.com/512/10728/10728169.png";

function ChatHeader({ currentUser, onlineUsers = [], typingUser }) {
  const [imgError, setImgError] = useState(false);

  const otherUsers = onlineUsers.filter(
    (user) => user?._id !== currentUser?._id
  );

  const avatarSrc =
    !imgError && currentUser?.profilePhoto
      ? currentUser.profilePhoto
      : DEFAULT_AVATAR;

  return (
    <header className="chat-header">
      <div className="chat-title-area">
        <div className="header-avatar">
          <img
            src={avatarSrc}
            alt="Global Chat"
            onError={() => setImgError(true)}
          />
          <span className="online-dot" />
        </div>

        <div>
          <h2>Global Chat</h2>

          <p className="status-text">
            {typingUser ? (
              <span className="typing-text">
                {typingUser} is typing...
              </span>
            ) : otherUsers.length > 0 ? (
              `${otherUsers.length} user${
                otherUsers.length > 1 ? "s" : ""
              } online`
            ) : (
              "No one else online"
            )}
          </p>
        </div>
      </div>

      <div className="header-actions">
        <button aria-label="Search">
          <Search size={20} />
        </button>

        <button aria-label="More options">
          <MoreVertical size={20} />
        </button>
      </div>
    </header>
  );
}

export default ChatHeader;