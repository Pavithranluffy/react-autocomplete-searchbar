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

//Clear Timout Explained Here

// Imagine you're ordering food online. You start typing "Pizza" into a search bar.

// You type "P" → The system waits 300ms before making an API call.

// You quickly type "Pi" → Before the API call for "P" happens, the system cancels it and starts a new 300ms timer for "Pi".

// You type "Piz" → The system cancels the "Pi" request and starts a new timer for "Piz".

// You type "Pizza" → The system cancels the "Piz" request and starts a new timer for "Pizza".

// You stop typing → After 300ms, the API call for "Pizza" happens.

// 🔹 Without clearTimeout, the system would send API requests for each keystroke:

// GET /search?q=P

// GET /search?q=Pi

// GET /search?q=Piz

// GET /search?q=Pizza

// (Unnecessary API calls, wasted bandwidth!)

// 🔹 With clearTimeout, only one request is sent for the final input:

// ✅ GET /search?q=Pizza

// (Efficient, prevents unnecessary API calls!)
