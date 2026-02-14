import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DesignContext } from "../context/DesignContext";
import "./RoomSetup.css";

function RoomSetup() {
  const { setRoom } = useContext(DesignContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    shape: "",
    width: "",
    height: "",
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

    setRoom(formData);
    navigate("/editor-2d");
  };

  return (
    <div className="room-container">
      <div className="form-card">
        <h2 className="title">
          <span className="highlight">Room</span> Setup
        </h2>

        <form onSubmit={handleSubmit}>
          <label>Room Shape</label>
          <select name="shape" onChange={handleChange}>
            <option value="">Select shape</option>
            <option value="rectangle">Rectangle</option>
            <option value="square">Square</option>
          </select>

          <label>Room Width</label>
          <input
            type="number"
            name="width"
            placeholder="Enter width"
            onChange={handleChange}
          />

          <label>Room Height</label>
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

          <button type="submit" className="continue-btn">
            Continue
          </button>
        </form>
      </div>

      <div className="image-section">
        <img src="/room-image.jpg" alt="Room Preview" />
      </div>
    </div>
  );
}

export default RoomSetup;
