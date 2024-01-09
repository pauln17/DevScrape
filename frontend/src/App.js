import { useEffect } from "react";
import { getAll } from "./services/jobs";

function App() {
  useEffect(() => {
    const data = getAll()
    console.log(data)
  })

  return (
    <>
    </>
  );
}

export default App;
