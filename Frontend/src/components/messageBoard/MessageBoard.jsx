import { useState, useEffect } from "react";
import Message from "../message/Message";
import Button from "../button/Button";
import SortButton from "../sortButton/SortButton";
import MessageModal from "../messageModal/MessageModal";
import SearchBar from "../searchbar/Searchbar";
import "./messageBoard.css";

function MessageBoard() {
  const [messages, setMessages] = useState([]);
  const [modal, setModal] = useState({ mode: null });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("descending");

  useEffect(() => {
    fetch("https://6hjgjxj3nb.execute-api.eu-north-1.amazonaws.com/messages")
      .then((res) => res.json())
      .then((data) => {
        if (data.messages) {
          setMessages(data.messages);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    setLoading(true);
    let url;
    if (search.trim() === "") {
      url = "https://6hjgjxj3nb.execute-api.eu-north-1.amazonaws.com/messages";
    } else {
      url = `https://6hjgjxj3nb.execute-api.eu-north-1.amazonaws.com/messages/${encodeURIComponent(
        search.trim()
      )}`;
    }
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.messages) {
          setMessages(data.messages);
        } else {
          setMessages([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setMessages([]);
        setLoading(false);
      });
  }, [search]);

  let messageElement;
  let modalElement;

  const sortedMessages = [...messages].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return sortOrder === "descending" ? dateB - dateA : dateA - dateB;
  });
  const filteredMessages = sortedMessages;

  if (loading) {
    messageElement = null;
  } else if (!filteredMessages.length) {
    messageElement = (
      <p className="messageboard__error-message">Inga meddelanden hittades.</p>
    );
  } else {
    messageElement = (
      <div className="messageboard">
        {filteredMessages.map((msg) => (
          <div key={msg.id} onClick={() => setModal({ mode: "edit", ...msg })}>
            <Message
              text={msg.text}
              username={msg.username}
              timestamp={msg.createdAt}
            />
          </div>
        ))}
        <Button onClick={() => setModal({ mode: "create" })} />
      </div>
    );
  }

  if (modal.mode === "edit") {
    modalElement = (
      <MessageModal
        mode="edit"
        initialText={modal.text}
        initialUsername={modal.username}
        messageId={modal.id}
        onClose={() => setModal({ mode: null })}
        onPost={() => window.location.reload()}
      />
    );
  } else if (modal.mode === "create") {
    modalElement = (
      <MessageModal
        onClose={() => setModal({ mode: null })}
        onPost={() => window.location.reload()}
      />
    );
  }

  return (
    <>
      <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} />
      <SortButton
        sortOrder={sortOrder}
        onToggleSort={() =>
          setSortOrder(sortOrder === "descending" ? "ascending" : "descending")
        }
      />
      {messageElement}
      {modalElement}
    </>
  );
}

export default MessageBoard;
