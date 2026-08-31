export default function Home() {
  return (
    <main className="hero">
      <div className="hero-grid" aria-hidden="true" />
      <p className="domain">wrkq.sh</p>
      <h1>
        <span>Hello</span>
        <span className="command">
          <span aria-hidden="true">›</span> wrkq
        </span>
      </h1>
      <div className="cursor" aria-hidden="true" />
    </main>
  );
}
