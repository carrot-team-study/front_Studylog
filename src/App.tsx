import { useEffect, useState } from "react";

function App() {
  const [msg, setMsg] = useState("loading...");

  useEffect(() => {
    fetch("/api/db/health")
      .then(res => res.text())
      .then(data => setMsg(data))
      .catch(err => {
        console.error(err);
        setMsg("백엔드 연결 실패");
      });
  }, []);

  return (
    <div>
      <h1>Frontend ↔ Backend Test</h1>
      <p>{msg}</p>
    </div>
  );
}

export default App;
