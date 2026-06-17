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
      name: name || "Anonim",
      message,
      createdAt: Date.now(),
    });

    setMessage("");
  };

  return (
    <div style={{ marginTop: 40 }}>
      <h2>Anı Defteri</h2>

      <input
        placeholder="İsim (isteğe bağlı)"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br />
      <br />

      <textarea
        placeholder="Bir şeyler yaz..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={4}
      />

      <br />
      <br />

      <button onClick={sendMessage}>
        Gönder
      </button>

      <hr />

      {posts.map((post) => (
        <div key={post.id} style={{ marginBottom: 20 }}>
          <strong>{post.name}</strong>
          <p>{post.message}</p>
        </div>
      ))}
    </div>
  );
}