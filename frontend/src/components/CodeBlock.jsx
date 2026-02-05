export default function CodeBlock({ code }) {
  const copy = () => navigator.clipboard.writeText(code);

  return (
    <div style={{
      background: "#000",
      color: "#00ff90",
      padding: "15px",
      borderRadius: "8px",
      position: "relative",
      marginTop: "8px",
      fontFamily: "monospace",
      whiteSpace: "pre-wrap"
    }}>
      <button
        onClick={copy}
        style={{
          position: "absolute",
          top: "6px",
          right: "6px",
          fontSize: "12px"
        }}
      >
        Copy
      </button>
      {code}
    </div>
  );
}
