import { useEffect, useRef, useState } from "react";

const API = "";

function getUserId() {
  let id = localStorage.getItem("user_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("user_id", id);
  }
  return id;
}

export default function App() {
  const userId = getUserId();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    fetch(`/history?user_id=${userId}`)
      .then(r => r.json())
      .then(setMessages);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send() {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setMessages(m => [...m, userMsg, { role: "assistant", content: "" }]);
    setInput("");

    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, message: userMsg.content })
    });

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    let aiText = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      aiText += decoder.decode(value);
      setMessages(m => {
        const copy = [...m];
        copy[copy.length - 1].content = aiText;
        return copy;
      });
    }
  }

  function clearChat() {
    fetch(`/clear?user_id=${userId}`, { method: "POST" })
      .then(() => setMessages([]));
  }

  return (
    <div className="container">
      <header>
        <h2>Local Ollama Chat</h2>
        <button onClick={clearChat}>Clear</button>
      </header>

      <div className="chat">
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>
            <pre>{m.content}</pre>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <footer>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Type and press Enter..."
        />
        <button onClick={send}>Send</button>
      </footer>
    </div>
  );
}
