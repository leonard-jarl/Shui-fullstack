import "./message.css";

function Message({ text, username, timestamp }) {
  const formattedTime = new Date(timestamp).toLocaleString("sv-SE", {
    weekday: "long",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="message">
      <p className="message__timestamp">{formattedTime}</p>
      <p className="message__text">{text}</p>
      <p className="message__signature">- {username}</p>
    </div>
  );
}

export default Message;
