import { useContext, useEffect, useRef, useState } from "react";
import { DesignContext } from "../context/DesignContext";
import "../styles/editor2d.css";
import Sidebar from "../components/Sidebar";



function Editor2D() {
  const { room } = useContext(DesignContext);

  const canvasRef = useRef(null);

  const [objects, setObjects] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  /* ===================== DRAW ===================== */

  useEffect(() => {
    draw();
  }, [objects, room]);

  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawRoom(ctx);
    drawObjects(ctx);
  };

  const drawRoom = (ctx) => {
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;

    if (room?.shape === "rectangle") {
      ctx.strokeRect(200, 100, 500, 350);
    }

    if (room?.shape === "l-shape") {
      ctx.beginPath();
      ctx.moveTo(200, 100);
      ctx.lineTo(700, 100);
      ctx.lineTo(700, 350);
      ctx.lineTo(500, 350);
      ctx.lineTo(500, 550);
      ctx.lineTo(200, 550);
      ctx.closePath();
      ctx.stroke();
    }
  };

  const drawObjects = (ctx) => {
    objects.forEach((obj) => {
      ctx.save();

      ctx.translate(obj.x, obj.y);
      ctx.rotate((obj.rotation * Math.PI) / 180);

      ctx.fillStyle = "#2ea29";

      if (obj.type === "chair") {
        ctx.fillRect(-20, -20, 40, 40);
      }

      if (obj.type === "table") {
        ctx.fillRect(-35, -20, 70, 40);
      }

      if (obj.type === "sofa") {
        ctx.fillRect(-50, -20, 100, 40);
      }

      if (obj.type === "cabinet") {
        ctx.fillRect(-20, -40, 40, 80);
      }

      if (obj.id === selectedId) {
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.strokeRect(-55, -55, 110, 110);
      }

      ctx.restore();
    });
  };

  /* ===================== ADD OBJECT ===================== */

  const addObject = (type) => {
    const newObject = {
      id: Date.now(),
      type,
      x: 400,
      y: 250,
      rotation: 0,
    };

    setObjects((prev) => [...prev, newObject]);
  };

  /* ===================== DRAG ===================== */

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    objects.forEach((obj) => {
      const dx = mouseX - obj.x;
      const dy = mouseY - obj.y;

      if (Math.abs(dx) < 50 && Math.abs(dy) < 50) {
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

    const half = 40;

    const corners = [
      { x: mouseX - half, y: mouseY - half },
      { x: mouseX + half, y: mouseY - half },
      { x: mouseX - half, y: mouseY + half },
      { x: mouseX + half, y: mouseY + half },
    ];

    let allowed = true;

    // RECTANGLE CHECK
    if (room?.shape === "rectangle") {
      corners.forEach((c) => {
        if (
          c.x < 200 ||
          c.x > 700 ||
          c.y < 100 ||
          c.y > 450
        ) {
          allowed = false;
        }
      });
    }

    // L-SHAPE CHECK
    if (room?.shape === "l-shape") {
      corners.forEach((c) => {
        const insideMain =
          c.x >= 200 && c.x <= 700 && c.y >= 100 && c.y <= 350;

        const insideBottom =
          c.x >= 200 && c.x <= 500 && c.y >= 350 && c.y <= 550;

        if (!insideMain && !insideBottom) {
          allowed = false;
        }
      });
    }

    if (!allowed) return;

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

  /* ===================== ROTATE ===================== */

  const rotateSelected = () => {
    if (!selectedId) return;

    const updated = objects.map((obj) =>
      obj.id === selectedId
        ? { ...obj, rotation: obj.rotation + 15 }
        : obj
    );

    setObjects(updated);
  };

  /* ===================== DELETE ===================== */

  const deleteSelected = () => {
    setObjects(objects.filter((obj) => obj.id !== selectedId));
    setSelectedId(null);
  };

  /* ===================== UI ===================== */

 return (
  <div className="editor-page">

    <Sidebar
      addObject={addObject}
      rotateSelected={rotateSelected}
      deleteSelected={deleteSelected}
    />

    <div className="main-content">
      <h2>2D View</h2>

      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          width={1000}
          height={650}
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
