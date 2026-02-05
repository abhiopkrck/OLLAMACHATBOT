export default function CodeBlock({ code }) {
  const copy = () => navigator.clipboard.writeText(code);

  return (
    <div style={{
      background:"#000",
      color:"#0f0",
      padding:15,
      borderRadius:8,
      fontFamily:"monospace",
      whiteSpace:"pre-wrap",
      position:"relative"
    }}>
      <button
        onClick={copy}
        style={{
          position:"absolute",
          top:5,
          right:5,
          background:"#222",
          color:"#fff",
          border:"none",
          cursor:"pointer"
        }}>
        Copy
      </button>
      {code}
    </div>
  );
}
