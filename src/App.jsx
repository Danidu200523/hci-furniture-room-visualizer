import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import RoomSetup from "./pages/RoomSetup";
import Editor2D from "./pages/Editor2D";
import View3D from "./pages/View3D";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/room-setup" element={<RoomSetup />} />
        <Route path="/editor-2d" element={<Editor2D />} />
        <Route path="/view-3d" element={<View3D />} />
      </Routes>
    </div>
  );
}

export default App;
