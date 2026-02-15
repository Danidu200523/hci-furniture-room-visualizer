import { useContext, useEffect, useRef, useState } from "react";
import { DesignContext } from "../context/DesignContext";

function Editor2D() {
  const { room } = useContext(DesignContext);
  const canvasRef = useRef(null);

  const [objects, setObjects] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Redraw whenever objects change
  useEffect(() => {
    draw();
  }, [objects]);

  // ================= DRAW FUNCTION =================
  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawRoom(ctx);
    drawObjects(ctx);
  };

  // ================= DRAW ROOM =================
  const drawRoom = (ctx) => {
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 3;

    if (room.shape === "rectangle") {
      ctx.strokeRect(100, 100, 500, 350);
    }

    if (room.shape === "l-shape") {
      ctx.beginPath();
      ctx.moveTo(100, 100);
      ctx.lineTo(600, 100);
      ctx.lineTo(600, 350);
      ctx.lineTo(400, 350);
      ctx.lineTo(400, 500);
      ctx.lineTo(100, 500);
      ctx.closePath();
      ctx.stroke();
    }
  };

  // ================= DRAW OBJECTS =================
  const drawObjects = (ctx) => {
    objects.forEach((obj) => {
      ctx.save();
      ctx.translate(obj.x, obj.y);
      ctx.rotate((obj.rotation * Math.PI) / 180);

      ctx.fillStyle = obj.color;
      ctx.fillRect(-30, -30, 60, 60);

      // Highlight selected
      if (obj.id === selectedId) {
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.strokeRect(-30, -30, 60, 60);
      }

      ctx.restore();
    });
  };

  // ================= ADD OBJECT =================
  const addObject = (type) => {
    const newObj = {
      id: Date.now(),
      type,
      x: 300,
      y: 250,
      rotation: 0,
      color: "#18b8a5",
    };

    setObjects([...objects, newObj]);
    setSelectedId(newObj.id);
  };

  // ================= ROTATE =================
  const rotateSelected = () => {
    if (!selectedId) return;

    const updated = objects.map((obj) =>
      obj.id === selectedId
        ? { ...obj, rotation: obj.rotation + 15 }
        : obj
    );

    setObjects(updated);
  };

  // ================= DRAG LOGIC =================
  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    objects.forEach((obj) => {
      const dx = mouseX - obj.x;
      const dy = mouseY - obj.y;

      if (Math.abs(dx) < 30 && Math.abs(dy) < 30) {
        setSelectedId(obj.id);
        setIsDragging(true);
      }
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !selectedId) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const updated = objects.map((obj) =>
      obj.id === selectedId
        ? { ...obj, x: mouseX, y: mouseY }
        : obj
    );

    setObjects(updated);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // ================= UI =================
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      
      {/* LEFT CONTROLS */}
      <div style={{ width: "220px", padding: "20px" }}>
        <h3>Controls</h3>

        <button onClick={() => addObject("chair")}>
          Add Chair
        </button>
        <br /><br />

        <button onClick={() => addObject("table")}>
          Add Table
        </button>
        <br /><br />

        <button onClick={rotateSelected}>
          Rotate Selected
        </button>
      </div>

      {/* CANVAS */}
      <canvas
        ref={canvasRef}
        width={900}
        height={650}
        style={{ border: "1px solid #999" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    </div>
  );
}

export default Editor2D;
