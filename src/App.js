import { useState } from "react";
import "./styles.css";
import { useEffect } from "react";

export default function App() {
  //First To store the input let us create a state
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);
  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://dummyjson.com/recipes/search?q=${input}`
      );
      const data = await response.json();
      setResults(data.recipes);
    } catch (e) {
      console.log("The Error Occured", e);
    }
  };

  useEffect(() => {
    fetchData();
  }, [input]);

  return (
    <div className="App">
      <h1>Auto Complete Search Bar</h1>
      <div className="search-container">
        <input
          type="text"
          className="input-text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        ></input>
        {input && (
          <div className="result-container">
            {results.map((data) => (
              <span className="result" key={data.id}>
                {data.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
