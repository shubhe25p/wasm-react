import React from "react";
import { LlamaCpp } from "./llama-mt/llama.js"

const App = () => {
  
  const chat = new LlamaCpp();
  React.useEffect(() => {
    console.log(import.meta.url);
    console.log(chat);
  },[]);
  return (
 <h1>Hello React from Shubh</h1>
  );
};

export default App;