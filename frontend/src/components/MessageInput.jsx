import { useEffect, useRef, useState } from "react";
import { Paperclip, Send, Smile } from "lucide-react";

function MessageInput({ onSend, onTypingStart, onTypingStop }) {
  const [text, setText] = useState("");
  const typingTimer = useRef(null);
  const isTyping = useRef(false);

  const handleChange = (event) => {
    const value = event.target.value;
    setText(value);

    if (value.trim()) {
      if (!isTyping.current) {
        isTyping.current = true;
        onTypingStart();
      }

      clearTimeout(typingTimer.current);

      typingTimer.current = setTimeout(() => {
        isTyping.current = false;
        onTypingStop();
      }, 3000);
    } else {
      clearTimeout(typingTimer.current);

      if (isTyping.current) {
        isTyping.current = false;
        onTypingStop();
      }
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!text.trim()) return;

    onSend(text.trim());
    setText("");

    clearTimeout(typingTimer.current);

    if (isTyping.current) {
      isTyping.current = false;
      onTypingStop();
    }
  };

  useEffect(() => {
    return () => {
      clearTimeout(typingTimer.current);
    };
  }, []);

  return (
    <form className="message-input-area" onSubmit={handleSubmit}>
      <button
        type="button"
        className="input-icon-button"
      >
        <Paperclip size={19} />
      </button>

      <input
        value={text}
        onChange={handleChange}
        placeholder="Type a message..."
      />

      <button
        type="button"
        className="input-icon-button"
      >
        <Smile size={19} />
      </button>

      <button
        type="submit"
        className="send-button"
        disabled={!text.trim()}
      >
        <Send size={19} />
      </button>
    </form>
  );
}

export default MessageInput;