const PDFS = [
  {
    committee: "Komite 1",
    year: "25-26",
    file: "/pdfs/Komite1_25-26.pdf",
  },
  {
    committee: "Komite 2",
    year: "25-26",
    file: "/pdfs/Komite2_25-26.pdf",
  },
  {
    committee: "Komite 4",
    year: "25-26",
    file: "/pdfs/Komite4_25-26.pdf",
  },
  {
    committee: "Komite 5",
    year: "25-26",
    file: "/pdfs/Komite5_25-26.pdf",
  },
];

export default function QuestionsPage() {
  return (
    <div
      className="min-h-screen px-4 py-8"
      style={{ background: "#081428", color: "#EAF1FB" }}
    >
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-2 text-3xl font-extrabold" style={{ color: "#F6B83E" }}>
          Çıkmış Sorular
        </h1>
        <button
  onClick={() => window.location.href = "/"}
  className="mb-6 rounded-xl px-4 py-2 font-semibold"
  style={{
    background: "#F6B83E",
    color: "#081428",
    border: "none",
    cursor: "pointer"
  }}
>
  ← Ana Sayfaya Dön
</button>

        <p className="mb-6 text-sm" style={{ color: "#94ABCF" }}>
          Şimdilik 25-26 PDF çıkmışları. Eksik komiteler daha sonra eklenecek.
        </p>

        <div className="mb-4 rounded-xl px-4 py-3 text-sm" style={{
          background: "rgba(246,184,62,0.10)",
          border: "1px solid rgba(246,184,62,0.30)",
          color: "#FBD07A",
        }}>
          25-26
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {PDFS.map((item) => (
            <a
              key={`${item.committee}-${item.year}`}
              href={item.file}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl p-5 text-left text-lg font-bold transition-opacity hover:opacity-80"
              style={{
                background: "#0F2647",
                border: "1px solid #21406F",
                color: "#EAF1FB",
              }}
            >
              {item.committee}
              <div className="mt-1 text-xs font-medium" style={{ color: "#94ABCF" }}>
                {item.year} çıkmışı · PDF aç
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}