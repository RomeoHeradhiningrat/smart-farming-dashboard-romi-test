import { useEffect, useState } from "react";

const BACKEND_URL = "https://web-production-ecd56.up.railway.app"; // GANTI sesuai URL backend Railway kamu

export default function Home() {
  const [sensor, setSensor] = useState(null);
  const [device, setDevice] = useState({ led: "OFF" });

  // Ambil data sensor & device
  const fetchData = async () => {
    try {
      const sensorRes = await fetch(`${BACKEND_URL}/latest`);
      const sensorData = await sensorRes.json();
      setSensor(sensorData);

      const deviceRes = await fetch(`${BACKEND_URL}/device`);
      const deviceData = await deviceRes.json();
      setDevice(deviceData);
    } catch (err) {
      console.error("Error fetch:", err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // refresh tiap 5 detik
    return () => clearInterval(interval);
  }, []);

  // Ubah status LED
  const toggleLed = async () => {
    const newStatus = device.led === "ON" ? "OFF" : "ON";
    try {
      await fetch(`${BACKEND_URL}/device`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ led: newStatus }),
      });
      setDevice({ led: newStatus });
    } catch (err) {
      console.error("Error update device:", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">🌱 Smart Farming Dashboard</h1>

      {/* Sensor Card */}
      <div className="bg-white shadow-lg rounded-2xl p-6 w-80 mb-4">
        <h2 className="text-xl font-semibold mb-2">Sensor Data</h2>
        {sensor && sensor.temperature ? (
          <div>
            <p>🌡️ Temperature: <b>{sensor.temperature} °C</b></p>
            <p>💧 Humidity: <b>{sensor.humidity} %</b></p>
            <p className="text-xs text-gray-500 mt-2">
              Last update:{" "}
              {sensor.timestamp
                ? new Date(sensor.timestamp).toLocaleTimeString()
                : "N/A"}
            </p>
          </div>
        ) : (
          <p>No data yet...</p>
        )}
      </div>

      {/* Device Card */}
      <div className="bg-white shadow-lg rounded-2xl p-6 w-80">
        <h2 className="text-xl font-semibold mb-2">Device Control</h2>
        <p>LED Status: <b>{device.led}</b></p>
        <button
          onClick={toggleLed}
          className={`mt-4 px-4 py-2 rounded-lg text-white transition ${
            device.led === "ON" ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {device.led === "ON" ? "Turn OFF" : "Turn ON"}
        </button>
      </div>
    </div>
  );
}
