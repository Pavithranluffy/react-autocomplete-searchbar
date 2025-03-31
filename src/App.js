import { useState, useEffect } from "react";
import "./styles.css";

export default function App() {
  // State to store the user's input in the search bar
  const [input, setInput] = useState("");

  // State to store search results from the API or cache
  const [results, setResults] = useState([]);

  // State to control the visibility of the search results dropdown
  const [showResult, setShowresults] = useState(false);

  // State to store cached results and avoid redundant API calls
  const [cache, setCache] = useState({});

  // Function to fetch data from API
  const fetchData = async () => {
    // Check if the input is already cached
    if (cache[input]) {
      console.log("From Cache:", input);
      setResults(cache[input]); // Use cached results
      return; // Stop further execution
    }

    try {
      console.log("API call hit:", input);
      const response = await fetch(
        `https://dummyjson.com/recipes/search?q=${input}`
      );
      const data = await response.json();

      // Update results state with API response
      setResults(data.recipes);

      // Update cache with the new result (spread previous cache to avoid overwriting)
      setCache((prev) => ({ ...prev, [input]: data.recipes }));
    } catch (e) {
      console.log("An error occurred:", e);
    }
  };

  // useEffect to trigger API calls with a debounce effect
  useEffect(() => {
    if (input.length > 0) {
      // Delay API call by 300ms (debouncing technique)
      const timer = setTimeout(fetchData, 300);

      // Cleanup function to clear timeout when input changes quickly
      return () => clearTimeout(timer);
    }
  }, [input]); // Runs whenever `input` changes

  return (
    <div className="App">
      <h1>Auto Complete Search Bar</h1>
      <div className="search-container">
        <input
          type="text"
          className="input-text"
          value={input}
          onChange={(e) => setInput(e.target.value)} // Update input state on change
          onFocus={() => setShowresults(true)} // Show results when input is focused
          onBlur={() => setTimeout(() => setShowresults(false), 200)} // Delay hiding dropdown
        />

        {/* Show search results only if there are results and showResult is true */}
        {showResult && results.length > 0 && (
          <div className="result-container">
            {results.map((data) => (
              <span
                key={data.id} // Unique key for React list items
                className="result"
                onMouseDown={(e) => e.preventDefault()} // Prevent input losing focus before onClick
                onClick={() => {
                  setInput(data.name); // Update input with selected value
                  setShowresults(false); // Hide dropdown after selection
                }}
              >
                {data.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
