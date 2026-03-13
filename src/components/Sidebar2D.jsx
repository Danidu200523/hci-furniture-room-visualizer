import { useState } from "react";
import { FaChair, FaTable, FaCouch, FaArchive, FaCube } from "react-icons/fa";
import { MdRotateRight, MdDelete } from "react-icons/md";
import "../styles/sidebar2D.css";
import { useNavigate } from "react-router-dom";

function Sidebar({ addObject, rotateSelected, deleteSelected, saveDesign }) {

  const [activeItem, setActiveItem] = useState(null);
   const navigate = useNavigate();


  const handleClick = (type) => {
    setActiveItem(type);
    addObject(type);
  };

  return (
    <div className="sidebar">

      <div className="logo">
        <h1>Hello</h1>
        <span>Room Planner</span>
      </div>

      <div className="menu">

        <button
          className={`menu-item ${activeItem === "chair" ? "active" : ""}`}
          onClick={() => handleClick("chair")}
        >
          <FaChair className="icon" />
          Add chair
        </button>

        <button
          className={`menu-item ${activeItem === "table" ? "active" : ""}`}
          onClick={() => handleClick("table")}
        >
          <FaTable className="icon" />
          Add table
        </button>

        <button
          className={`menu-item ${activeItem === "sofa" ? "active" : ""}`}
          onClick={() => handleClick("sofa")}
        >
          <FaCouch className="icon" />
          Add sofa
        </button>

        <button
          className={`menu-item ${activeItem === "cabinet" ? "active" : ""}`}
          onClick={() => handleClick("cabinet")}
        >
          <FaArchive className="icon" />
          Add cabinet
        </button>

      </div>

      <div className="bottom-controls">

       
        <button className="switch-btn"onClick={() => navigate("/view-3d")}>
  Switch to 3D View
</button>

        <button className="outline-btn" onClick={rotateSelected}>
          <MdRotateRight className="icon" />
          Rotate
        </button>

        <button className="primary-btn" onClick={saveDesign}>
          Save Design
        </button>

        <button className="danger-btn" onClick={deleteSelected}>
          <MdDelete className="icon" />
          Delete
        </button>

      </div>

    </div>
  );
}

export default Sidebar;