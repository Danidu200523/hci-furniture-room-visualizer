import { furnitureStyles } from "../data/furnitureStyles";
import "../styles/furnitureSelector.css";

function FurnitureStyleSelector({ type, onSelect, onClose }) {

  const styles = furnitureStyles[type] || [];

  return (
    <div className="selector-overlay">

      <div className="selector-box">

        <h3>Select {type} style</h3>

        <div className="style-grid">

          {styles.map((item) => (

            <div
              key={item.id}
              className="style-card"
              onClick={() => onSelect(item)}
            >
              <p>{item.name}</p>
            </div>

          ))}

        </div>

        <button className="close-btn" onClick={onClose}>
          Cancel
        </button>

      </div>

    </div>
  );
}

export default FurnitureStyleSelector;