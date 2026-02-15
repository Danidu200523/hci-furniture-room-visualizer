import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DesignContext } from "../context/DesignContext";
import "../styles/roomsetup.css";

function RoomSetup() {
  const { setRoom } = useContext(DesignContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    shape: "",
    width: "",
    height: "",
    lWidth: "",
    lHeight: "",
    color: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.shape || !formData.width || !formData.height || !formData.color) {
      alert("Please fill all fields");
      return;
    }
    if (formData.shape === "l-shape" && (!formData.lWidth || !formData.lHeight)) {
  alert("Please fill L shape dimensions");
  return;
}

    setRoom(formData);
    navigate("/editor-2d");
  };

  return (
  <div className="room-wrapper">

    <div className="left-section">

      <h1 className="room-title">
        <span>Room</span> Setup
      </h1>

      <div className="room-card">
        <div className="top-bar"></div>

        <form onSubmit={handleSubmit} className="room-form">

          <label>Room Shape</label>
          <select name="shape" onChange={handleChange}>
            <option value="">Select Shape</option>
            <option value="rectangle">Rectangle</option>
            <option value="square">Square</option>
            <option value="l-shape">L-Shape</option>
          </select>

          <label>Room Width (m)</label>
          <input
            type="number"
            name="width"
            placeholder="Enter width"
            onChange={handleChange}
          />

          <label>Room Height (m)</label>
          <input
            type="number"
            name="height"
            placeholder="Enter height"
            onChange={handleChange}
          />

          <label>Room Color</label>
          <input
            type="color"
            name="color"
            onChange={handleChange}
          />
          {formData.shape === "l-shape" && (
  <>
    <label>L Extension Width (m) </label>
    <input
      type="number"
      name="lWidth"
      placeholder="Enter L width"
      onChange={handleChange}
    />

    <label>L Extension Height (m) </label>
    <input
      type="number"
      name="lHeight"
      placeholder="Enter L height"
      onChange={handleChange}
    />
  </>
)}


          <button type="submit" className="continue-btn">
            Continue
          </button>

        </form>
      </div>
    </div>

    <div className="right-section">
  <div className="logo">
    <div className="logo-top">Hello</div>
    <div className="logo-bottom">Room Planner</div>
  </div>

  <div className="image-section">
    <img src="/room.png" alt="Room" />
  </div>
</div>


  </div>
);

}

export default RoomSetup;
