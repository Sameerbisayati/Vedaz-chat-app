import React from "react";

export default function TypingIndicator({ username }) {
  if (!username) {
    return <div className="typing-space" />;
  }

  return (
    <div className="typing-indicator">
      <span>{username} is typing</span>

      <div className="typing-dots">
        <i></i>
        <i></i>
        <i></i>
      </div>
    </div>
  );
}