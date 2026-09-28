import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

function MessageList({
  messages,
  currentUser,
  onMessagesRead
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth"
    });

    const unreadMessages = messages
      .filter(
        (message) =>
          message.senderId !== currentUser._id &&
          !message.readBy?.includes(currentUser._id)
      )
      .map((message) => message._id);

    if (unreadMessages.length > 0) {
      onMessagesRead(unreadMessages);
    }
  }, [
    messages,
    currentUser._id,
    onMessagesRead
  ]);

  return (
    <div className="message-list">
      {messages.length === 0 ? (
        <div className="empty-chat">
          <div className="empty-icon">💬</div>

          <h3>Start a conversation</h3>

          <p>
            Send the first message to everyone online.
          </p>
        </div>
      ) : (
        messages.map((message) => (
          <MessageBubble
            key={message._id}
            message={message}
            currentUser={currentUser}
          />
        ))
      )}

      <div ref={bottomRef} />
    </div>
  );
}

export default MessageList;