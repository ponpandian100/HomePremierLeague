import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((data) => setMessage(data.message));
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>{message}</h1>
    </div>
  );
}

export default App;