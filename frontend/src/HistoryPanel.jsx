export default function HistoryPanel({ chats }) {
  return (
    <div style={{
      width:260,
      background:"#111",
      color:"#fff",
      overflowY:"auto"
    }}>
      <h3 style={{ padding:10 }}>History</h3>
      {chats.map(c => (
        <div key={c[0]} style={{ padding:8, borderBottom:"1px solid #333" }}>
          <small>{c[1]}</small>
          <div style={{ fontSize:12, opacity:0.7 }}>
            {c[2].slice(0,40)}...
          </div>
        </div>
      ))}
    </div>
  );
}
