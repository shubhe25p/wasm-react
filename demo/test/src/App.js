import React from "react";
import { LlamaCpp } from "./llama-mt/llama.js"

const App = () => {
  const model = "https://huggingface.co/TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF/resolve/main/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf";
  let app;
  const onModelLoaded = () => {
    app.run({
        prompt: "What is up?",
        ctx_size: 2048,
        temp: 0.8,
        top_k: 40,
        no_display_prompt: true,
    });
  };
  const onMessageChunk = () => {
    console.log("Something");
  };
  const onComplete = () => {
    console.debug("model: completed");
  };
  
  React.useEffect(() => {
    app = new LlamaCpp(model, onModelLoaded, onMessageChunk, onComplete);
    console.log(import.meta.url);
    console.log(app);
  },[]);
  return (
 <h1>Hello React from Shubh</h1>
  );
};

export default App;