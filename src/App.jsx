import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Room from "./Room.jsx";
import RandomRoom from "./RandomRoom";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

function App() {

  return (
    <Router>
      <div className="room">
        {/* Add ToastContainer here to show toasts */}
     

        {/* Your routes */}
        <Routes>   
       
          <Route path="/" element={<Room />} />
          <Route path="/random-room-code" element={<RandomRoom />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
