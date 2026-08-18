// api/heartbeat.js
import axios from "axios";

export default async function handler(req, res) {
  try {
    const backendRes = await axios.get("https://ericaos.onrender.com/api/heartbeat/");
    console.log("heartbeat ok:", backendRes.status);
    res.status(200).json({ ok: true, backendStatus: backendRes.status });
  } catch (err) {
    console.log("heartbeat failed:", err.message);
    res.status(502).json({ ok: false, error: err.message });
  }
}