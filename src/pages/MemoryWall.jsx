import { useEffect, useState } from "react";
import { db } from "../firebase";
import { ref, push, onValue } from "firebase/database";

export default function MemoryWall() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const messagesRef = ref(db, "memories");

    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();

      if (!data) {
        setPosts([]);
        return;
      }

      const arr = Object.entries(data).map(([id, value]) => ({
        id,
        ...value,
      }));

      setPosts(arr.reverse());
    });
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;

    push(ref(db, "memories"), {
      name: name.trim() || "Anonim",
      message: message.trim(),
      createdAt: Date.now(),
    });

    setMessage("");
  };

  return (
    <section
      className="mt-10 rounded-2xl p-5 shadow-xl"
      style={{ background: "#0F2647", border: "1px solid #1A3258" }}
    >
      <h2 className="text-xl font-extrabold" style={{ color: "#F6B83E" }}>
        Sohbet 
      </h2>

      <p className="mt-1 mb-4 text-sm" style={{ color: "#94ABCF" }}>
        İstersen adını yaz, istersen anonim kal. Mesajlar herkes tarafından görülebilir.
      </p>

      <div className="space-y-3">
        <input
          className="w-full rounded-xl px-4 py-3 outline-none"
          style={{
            background: "#143057",
            border: "1px solid #21406F",
            color: "#EAF1FB",
          }}
          placeholder="İsim / Rumuz"
          maxLength={30}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          className="w-full resize-none rounded-xl px-4 py-3 outline-none"
          style={{
            background: "#143057",
            border: "1px solid #21406F",
            color: "#EAF1FB",
          }}
          placeholder="Mesajını yaz..."
          maxLength={300}
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: "#94ABCF" }}>
            {message.length}/300
          </span>

          <button
            onClick={sendMessage}
            className="rounded-xl px-5 py-2 text-sm font-bold transition-opacity hover:opacity-90"
            style={{ background: "#F6B83E", color: "#081428" }}
          >
            Paylaş
          </button>
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-2 text-sm font-semibold" style={{ color: "#94ABCF" }}>
          Yazılanlar
        </div>

        <div
          className="space-y-3 overflow-y-auto pr-1"
          style={{ maxHeight: "360px" }}
        >
          {posts.length === 0 ? (
            <div
              className="rounded-xl p-4 text-sm"
              style={{
                background: "#143057",
                border: "1px solid #21406F",
                color: "#94ABCF",
              }}
            >
              Henüz mesaj yok. İlk mesajı sen bırak.
            </div>
          ) : (
            posts.map((post) => (
              <article
                key={post.id}
                className="rounded-xl p-4"
                style={{
                  background: "#081428",
                  border: "1px solid #21406F",
                }}
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <strong style={{ color: "#EAF1FB" }}>
                    {post.name || "Anonim"}
                  </strong>

                  {post.createdAt && (
                    <span className="shrink-0 text-[11px]" style={{ color: "#94ABCF" }}>
                      {new Date(post.createdAt).toLocaleDateString("tr-TR")}
                    </span>
                  )}
                </div>

                <p className="whitespace-pre-wrap text-sm leading-relaxed" style={{ color: "#EAF1FB" }}>
                  {post.message}
                </p>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}