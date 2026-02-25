import { useContext, useEffect, useRef, useState } from "react";
import { DesignContext } from "../context/DesignContext";
import Sidebar from "../components/Sidebar";
import "../styles/editor2d.css";

function Editor2D() {
  const { room } = useContext(DesignContext);
  const canvasRef = useRef(null);

  const [objects, setObjects] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  /* ===============================
     LOAD SAVED DESIGN
  =============================== */
  useEffect(() => {
    const saved = localStorage.getItem("savedDesign");
    if (saved) {
      const parsed = JSON.parse(saved);
      setObjects(parsed.objects || []);
    }
  }, []);

  /* ===============================
     RESIZE CANVAS
  =============================== */
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvas.parentElement;

    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    draw();
  }, []);

  useEffect(() => {
    draw();
  }, [objects]);

  /* ===============================
     DRAWING
  =============================== */
  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawRoom(ctx);
    drawObjects(ctx);
  };

  const drawRoom = (ctx) => {
    const canvas = canvasRef.current;

    const roomWidth = canvas.width * 0.6;
    const roomHeight = canvas.height * 0.6;

    const startX = (canvas.width - roomWidth) / 2;
    const startY = (canvas.height - roomHeight) / 2;

    ctx.strokeStyle = "#000";
    ctx.lineWidth = 3;
    ctx.strokeRect(startX, startY, roomWidth, roomHeight);
  };

  const drawObjects = (ctx) => {
    objects.forEach((obj) => {
      ctx.save();

      ctx.translate(obj.x + obj.width / 2, obj.y + obj.height / 2);
      ctx.rotate((obj.rotation * Math.PI) / 180);

      switch (obj.type) {
        case "chair":
          ctx.fillStyle = "#00C8B3"; // Mint
          ctx.fillRect(-25, -25, 50, 50);
          break;

        case "table":
          ctx.fillStyle = "#525252"; // Gray
          ctx.fillRect(-40, -20, 80, 40);
          break;

        case "sofa":
          ctx.fillStyle = "#444444"; // Dark Gray
          ctx.beginPath();
          ctx.roundRect(-60, -25, 120, 50, 15);
          ctx.fill();
          break;

        case "cabinet":
          ctx.fillStyle = "#C0F6F1"; // Light mint
          ctx.fillRect(-20, -50, 40, 100);
          break;

        default:
          ctx.fillStyle = "#00C8B3";
          ctx.fillRect(-30, -30, 60, 60);
      }

      if (obj.id === selectedId) {
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.strokeRect(
          -obj.width / 2,
          -obj.height / 2,
          obj.width,
          obj.height
        );
      }

      ctx.restore();
    });
  };

  /* ===============================
     ADD OBJECT
  =============================== */
  const addObject = (type) => {
    let width = 60;
    let height = 60;

    if (type === "chair") {
      width = 50;
      height = 50;
    }

    if (type === "table") {
      width = 80;
      height = 40;
    }

    if (type === "sofa") {
      width = 120;
      height = 50;
    }

    if (type === "cabinet") {
      width = 40;
      height = 100;
    }

    const newObj = {
      id: Date.now(),
      type,
      x: 300,
      y: 250,
      width,
      height,
      rotation: 0,
    };

    setObjects((prev) => [...prev, newObj]);
  };

  /* ===============================
     ROTATE
  =============================== */
  const rotateSelected = () => {
    setObjects((prev) =>
      prev.map((obj) =>
        obj.id === selectedId
          ? { ...obj, rotation: obj.rotation + 90 }
          : obj
      )
    );
  };

  /* ===============================
     DELETE
  =============================== */
  const deleteSelected = () => {
    setObjects((prev) => prev.filter((obj) => obj.id !== selectedId));
    setSelectedId(null);
  };

  /* ===============================
     SAVE
  =============================== */
 const saveDesign = () => {
  const canvas = canvasRef.current;

  // Convert canvas to image
  const image = canvas.toDataURL("image/png", 1.0);

  // Create download link
  const link = document.createElement("a");
  link.href = image;
  link.download = "room-design.png";
  link.click();

  alert("Design saved as image successfully!");
};

  /* ===============================
     DRAG
  =============================== */
  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const clicked = objects.find(
      (obj) =>
        mouseX >= obj.x &&
        mouseX <= obj.x + obj.width &&
        mouseY >= obj.y &&
        mouseY <= obj.y + obj.height
    );

    if (clicked) {
      setSelectedId(clicked.id);
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setObjects((prev) =>
      prev.map((obj) =>
        obj.id === selectedId
          ? { ...obj, x: mouseX - obj.width / 2, y: mouseY - obj.height / 2 }
          : obj
      )
    );
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="editor-page">

      <Sidebar
        addObject={addObject}
        rotateSelected={rotateSelected}
        deleteSelected={deleteSelected}
        saveDesign={saveDesign}
      />

      <div className="main-content">
        <h2>2D View</h2>

        <div className="canvas-container">
          <canvas
            ref={canvasRef}
            className="editor-canvas"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          />
        </div>
      </div>

    </div>
  );
}

export default Editor2D;