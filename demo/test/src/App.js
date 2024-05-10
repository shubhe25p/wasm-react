import React from "react";

const App = () => {
  React.useEffect(() => {
    console.log(import.meta.url);
  },[]);
  return (
 <h1>Hello React from Shubh</h1>
  );
};

export default App;