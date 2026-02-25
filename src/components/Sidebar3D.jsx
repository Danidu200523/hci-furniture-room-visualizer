import { useNavigate } from "react-router-dom";
import "../styles/sidebar3D.css";

function Sidebar({
  rotateSelected,
  deleteSelected,
  saveDesign,
  is3D = false,   // default false (important)
}) {
  const navigate = useNavigate();

  return (
    <div className="sidebar">

      {/* Logo */}
      <div className="logo">
        <h2>Hello</h2>
        <span>Room Planner</span>
      </div>

      {/* 3D Controls */}
      {is3D && (
        <div className="top-controls">
          <button
            className="btn-outline"
            onClick={() => navigate("/editor-2d")}
          >
            Back to 2D View
          </button>

          <button
            className="btn-outline"
            onClick={rotateSelected}
          >
            Rotate
          </button>
        </div>
      )}

      {/* Bottom Actions */}
      <div className="bottom-buttons">
        <button
          className="btn-primary"
          onClick={saveDesign}
        >
          Save Design
        </button>

        <button
          className="btn-danger"
          onClick={deleteSelected}
        >
          Delete
        </button>
      </div>

    </div>
  );
}

export default Sidebar;