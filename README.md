# wasm-react
Web assembly integrate with React explore

## For CPU runs:

Using Llama-cpp-wasm, fork of llama-cpp project upto certain commit, not updated much. git clone emsdk and build it for building emsdk

## For GPU runs:

Using mlc-webllm

## Takeaways:

1. Running on CPU took much longer because wasm wasn't compatible with create-react-app or something was not working, solutions revolved around trying to eject webpack config in create-react-app instead of that I ended creating react app from scratch.
2. React app needs to two things: webpack to bundle packages and serve, babel so that it can work on older browsers with different JS.
3. Once you have that directly import LLAMA CPP CPU
4. Webllm only works on GPU and is available as a typescript library so to import in JS I had to build it first which converts it into JS then import normally.





