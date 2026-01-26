import "./App.css";
import Home from "./components/home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Admin from "./components/admin";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;