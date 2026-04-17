import { useState } from "react";
import { predictSkin } from "./services/api";

function App() {
  const [result, setResult] = useState("");

  const handleClick = async () => {
    const data = {
      skinType: "oily",
      concern: "acne"
    };

    const res = await predictSkin(data);
    setResult(res.result);
  };

  return (
    <div>
      <h1>LumiSkin</h1>
      <button onClick={handleClick}>Cek Kulit</button>
      <p>Hasil: {result}</p>
    </div>
  );
}

export default App;