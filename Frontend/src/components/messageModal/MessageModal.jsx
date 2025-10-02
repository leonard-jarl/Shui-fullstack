import "./messageModal.css";
import { useState } from "react";

function MessageModal({
  onClose,
  onPost,
  mode = "create",
  initialText = "",
  initialUsername = "",
  messageId,
}) {
  const [text, setText] = useState(initialText);
  const [username, setUsername] = useState(initialUsername);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text) return setError("Please type a message");
    if (text.length < 10) return setError("Message is too short");
    if (!username) return setError("Please enter your name");
    if (username.length < 2) return setError("Name is too short");

    setLoading(true);
    setError("");

    try {
      let response;
      if (mode === "edit" && messageId) {
        response = await fetch(
          `https://6hjgjxj3nb.execute-api.eu-north-1.amazonaws.com/messages/${messageId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text, username }),
          }
        );
      } else {
        response = await fetch(
          "https://6hjgjxj3nb.execute-api.eu-north-1.amazonaws.com/messages",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text, username }),
          }
        );
      }
      if (response.ok) {
        setText("");
        setUsername("");
        if (onPost) onPost();
        if (onClose) onClose();
      } else {
        setError(
          mode === "edit"
            ? "Failed to update message."
            : "Failed to post message."
        );
      }
    } catch (err) {
      setError(
        mode === "edit" ? "Error updating message" : "Error posting message"
      );
    }
    setLoading(false);
  };

  let modalTitle = "Post new message";
  if (mode === "edit") {
    modalTitle = "Edit message";
  }
  let signature;
  if (mode === "edit") {
    signature = <div className="message-modal__signature">- {username}</div>;
  } else {
    signature = (
      <input
        className="message-modal__input"
        type="text"
        placeholder="Name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        maxLength={15}
      />
    );
  }

  let errorMessage = null;
  if (error) {
    errorMessage = <div className="message-modal__error">{error}</div>;
  }

  let buttonText = "Post";
  if (mode === "edit") {
    buttonText = "Save";
  }

  return (
    <div className="message-modal__backdrop" onClick={onClose}>
      <div className="message-modal" onClick={(e) => e.stopPropagation()}>
        <button className="message-modal__close" onClick={onClose}>
          &times;
        </button>
        <h2 className="message-modal__heading">{modalTitle}</h2>
        <form onSubmit={handleSubmit}>
          <div className="message-modal__message">
            <textarea
              className="message-modal__textarea"
              placeholder="Type your message here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={100}
            />
            {signature}
          </div>
          {errorMessage}
          <button
            className="message-modal__post-button"
            type="submit"
            disabled={loading}
          >
            {buttonText}
          </button>
        </form>
      </div>
    </div>
  );
}

export default MessageModal;
