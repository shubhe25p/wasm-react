import React from "react";
import { LlamaCpp } from "./llama-mt/llama.js"
import { Typography, Box, TextField, Button } from "@mui/material";
let app;
const App = () => {
  const [value, setValue] = React.useState("");
  const [prompt, setPrompt] = React.useState("1+2=?");
  const numCores = window.navigator.hardwareConcurrency;
  const otherDetails = window.navigator.userAgent;
  let resp;
  const model = "https://huggingface.co/TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF/resolve/main/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf";
  
  const onModelLoaded = () => {
    app.run({
        prompt: prompt,
        ctx_size: 256,
        temp: 0.1,
        top_k: 60,
        no_display_prompt: true,
    });
  };
  const onMessageChunk = (tok) => {
    resp = resp + tok;
    console.log(tok);
  };
  const onComplete = () => {
    console.debug("model: completed");
    setValue(resp);
    console.log(resp);
  };

 
  React.useEffect(() => {
    app = new LlamaCpp(model, onModelLoaded, onMessageChunk, onComplete);
    console.log(app);
  },[]);
  const handleSubmit = (e) => {
    e.preventDefault();
    resp = "";
    setValue(resp);
    onModelLoaded();
  }
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Typography
        variant="h3"
        align="center"
        color="textPrimary"
        gutterBottom
      >
        Private LLM
      </Typography>
      <Typography
        variant="h5"
        align="center"
        color="textSecondary"
        paragraph
        maxWidth={
          "50%"
        }
      >
        CPU Inference on {numCores} cores and {otherDetails}
      </Typography>
      <Box
      sx={{
        width: "50%",
        display: "flex",
        flexDirection: "row",
      }}
      >
      <TextField
        id="outlined-basic"
        label="Prompt"
        variant="outlined"
        fullWidth
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        sx={{
          marginLeft: "10px"
        }}
      >
        Submit
      </Button>
      
      </Box>
      <Typography
        variant="h6"
        align="center"
        color="textSecondary"
        paragraph
        maxWidth={
          "50%"
        }
      >
        {value}
      </Typography>

    </Box>
  );
};

export default App;