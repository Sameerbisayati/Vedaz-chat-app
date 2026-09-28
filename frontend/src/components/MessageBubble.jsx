const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

function getPhotoUrl(photo) {
  if (!photo) {
    return "";
  }

  if (photo.startsWith("http")) {
    return photo;
  }

  return `${API_URL}${photo}`;
}

function MessageBubble({
  message,
  currentUser
}) {
  const isMine =
    message.senderId === currentUser._id;

  const time = new Date(
    message.createdAt
  ).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });

  const getStatus = () => {
    if (!isMine) {
      return null;
    }

    if (message.readBy?.length > 0) {
      return (
        <span className="message-status read">
          ✓✓
        </span>
      );
    }

    if (
      message.deliveredTo?.length > 0
    ) {
      return (
        <span className="message-status">
          ✓✓
        </span>
      );
    }

    return (
      <span className="message-status">
        ✓
      </span>
    );
  };

  return (
    <div
      className={`message-row ${
        isMine ? "mine" : "other"
      }`}
    >
      {!isMine && (
        <div className="message-avatar">
          {getPhotoUrl(
            message.senderPhoto
          ) ? (
            <img
              src={getPhotoUrl(
                message.senderPhoto
              )}
              alt={message.senderName}
            />
          ) : (
            <div className="avatar-fallback">
              {message.senderName
                .charAt(0)
                .toUpperCase()}
            </div>
          )}
        </div>
      )}

      <div className="message-content">
        {!isMine && (
          <span className="sender-name">
            {message.senderName}
          </span>
        )}

        <div className="message-bubble">
          <p>{message.text}</p>

          <div className="message-meta">
            <span>{time}</span>

            {getStatus()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;