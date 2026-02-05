export default function Message({ role, content }) {
  const parts = content.split(/```/g);

  return (
    <div className={`msg ${role}`}>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <CodeBlock key={i} code={p} />
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </div>
  );
}

function CodeBlock({ code }) {
  const copy = () => navigator.clipboard.writeText(code);

  return (
    <div className="code">
      <button onClick={copy}>Copy</button>
      <pre>{code}</pre>
    </div>
  );
}
