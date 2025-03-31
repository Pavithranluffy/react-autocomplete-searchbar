import { useState } from "react";
import "./styles.css";
import { useEffect } from "react";

export default function App() {
  //First To store the input let us create a state
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);
  const [showResult , setShowresults]= useState(false);
  const fetchData = async () => {
    try {
      console.log("Api call hit",input);
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
    if(input.length >0){

      const timer = setTimeout(

        fetchData
        
      , 300);
      return ()=>{

        clearTimeout(timer)
    
    }

    }

   
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
          onFocus={()=> setShowresults(true)}
          onBlur={()=>setShowresults(false)}
        ></input>
        {showResult && (
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
