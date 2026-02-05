export default function Sidebar({ chats }) {
  return (
    <div className="sidebar">
      <h3>Chat History</h3>
      {chats
        .filter(c => c.role === "user")
        .map((c, i) => (
          <div key={i} className="chat-item">
            {c.content.slice(0, 30)}
          </div>
        ))}
    </div>
  );
}
