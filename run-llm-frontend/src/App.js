import React from "react";
import { LlamaCpp } from "./llama-mt/llama.js"
import { Typography, Box, TextField, Button } from "@mui/material";
import {CreateMLCEngine} from "./webllm/index.js";
const selectedModel = "Llama-3-8B-Instruct-q4f32_1-1k";

let app, engine;
const App = () => {
  const [value, setValue] = React.useState("");
  const [prompt, setPrompt] = React.useState("1+2=?");
  const [gpu, setGpu] = React.useState(false);
  const [disableSubmit, setDisableSubmit] = React.useState(false);
  const [switchToCPU, setSwitchToCPU] = React.useState(false);
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

  const handleSwitchToCPU = () => {
    setDisableSubmit(true);
    setSwitchToCPU(!switchToCPU);
    setGpu(!gpu);
    app = new LlamaCpp(model, onModelLoaded, onMessageChunk, onComplete);
    console.log(app);
    onModelLoaded();
    setDisableSubmit(false);
  };

 
  React.useEffect(()=>{
    async function loadModel() {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl");
    if (!gl) {
      console.error("WebGL not supported");
      app = new LlamaCpp(model, onModelLoaded, onMessageChunk, onComplete);
    } else {
      setDisableSubmit(true);
      console.log("WebGL supported");
      setGpu(true);
      engine = await CreateMLCEngine(selectedModel);
      console.log("Model loaded on GPU");
      setDisableSubmit(false);
      // const reply = await engine.chat.completions.create({
      //   messages: [{ role: "user", content: prompt }],
      // });
      // console.log(reply);
    }
  }
  loadModel();

  },[]);
  async function runModelonGPU() {
    console.log(prompt);
    console.log("Running on GPU");
    const reply = await engine.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
    });
    console.log(reply);
    setValue(reply.choices[0].message.content);
    setDisableSubmit(false);
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    setDisableSubmit(true);
    resp = "";
    setValue(resp);
    if (gpu) {
      runModelonGPU();
    } else {
    onModelLoaded();
    setDisableSubmit(false);
    }
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
      {gpu ? (
        <Typography
          variant="h5"
          align="center"
          color="textSecondary"
          paragraph
          maxWidth={
            "50%"
          }
        >
          GPU Inference on {otherDetails} <br />
        </Typography>
      ) : (
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
      )}
      <Typography
        variant="h5"
        align="center"
        color="textSecondary"
        paragraph
        maxWidth={
          "50%"
        }
      >
        Model: Llama-3-8B
      </Typography>
      
      <Box
      sx={{
        width: "50%",
        display: "flex",
        flexDirection: "row",
      }}
      >
     { !switchToCPU && <Button
        variant="contained"
        color="primary"
        onClick={() => handleSwitchToCPU()}
        sx={{
          marginRight: "10px"
        }}
      >
        Switch to CPU
      </Button>}
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
        disabled={disableSubmit}
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