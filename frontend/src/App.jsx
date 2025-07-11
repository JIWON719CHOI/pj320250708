import axios from "axios";

function App() {
  function handleButton1Click() {
    axios.post("/api/learn/jwt/sub1", {
      email: "gojo@email.com",
      password: "1207",
    });
  }

  return (
    <div>
      <h3>jwt 로그인 연습</h3>
      <button onClick={handleButton1Click}>1. GET TOKEN🪙</button>
    </div>
  );
}

export default App;
