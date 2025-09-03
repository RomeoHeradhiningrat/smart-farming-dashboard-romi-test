import { useEffect, useState } from "react";

const BACKEND_URL = "https://web-production-ecd56.up.railway.app";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/latest`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
        }
      } catch (error) {
        console.error("Gagal memuat pesan:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // refresh tiap 5 detik
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container">
      <h1>📩 Pesan Terbaru</h1>
      {loading ? (
        <p>Loading...</p>
      ) : messages.length === 0 ? (
        <p>Belum ada pesan.</p>
      ) : (
        <ul>
          {messages.map((msg, idx) => (
            <li key={idx}>
              <p className="text">{msg.text}</p>
              <p className="meta">
                Dari: <b>{msg.user}</b> | {msg.time}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
