import { useContext, useEffect, useRef, useState } from "react";
import { DesignContext } from "../context/DesignContext";
import Sidebar from "../components/Sidebar2D";
import "../styles/editor2d.css";

function Editor2D() {
  const { room, objects, setObjects } = useContext(DesignContext);
  const canvasRef = useRef(null);


  const [selectedId, setSelectedId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [roomBounds, setRoomBounds] = useState(null);

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
  }, [objects, room]);

  /* ===============================
     MAIN DRAW
  =============================== */
  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawRoom(ctx);
    drawObjects(ctx);
  };

  /* ===============================
     DRAW ROOM
  =============================== */
  const drawRoom = (ctx) => {
    if (!room || !room.width || !room.height) return;

    const canvas = canvasRef.current;

    const width = Number(room.width);
    const height = Number(room.height);

    const padding = 80;

    const scaleX = (canvas.width - padding) / width;
    const scaleY = (canvas.height - padding) / height;
    const scale = Math.min(scaleX, scaleY);

    const roomWidth = width * scale;
    const roomHeight = height * scale;

    const startX = (canvas.width - roomWidth) / 2;
    const startY = (canvas.height - roomHeight) / 2;

    setRoomBounds({
      startX,
      startY,
      roomWidth,
      roomHeight,
      scale,
    });

    ctx.lineWidth = 3;
    ctx.strokeStyle = "#000";

    if (room.shape === "rectangle") {
      ctx.fillStyle = room.color || "var(--white)";
      ctx.fillRect(startX, startY, roomWidth, roomHeight);
      ctx.strokeRect(startX, startY, roomWidth, roomHeight);
    }

    if (room.shape === "l-shape") {
      const lWidth = Number(room.lWidth || 0) * scale;
      const lHeight = Number(room.lHeight || 0) * scale;

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(startX + roomWidth, startY);
      ctx.lineTo(startX + roomWidth, startY + roomHeight);
      ctx.lineTo(startX + lWidth, startY + roomHeight);
      ctx.lineTo(startX + lWidth, startY + lHeight);
      ctx.lineTo(startX, startY + lHeight);
      ctx.closePath();

      ctx.fillStyle = room.color || "var(--white)";
      ctx.fill();
      ctx.stroke();
    }
  };

  /* ===============================
     DRAW OBJECTS
  =============================== */
  const drawObjects = (ctx) => {
    objects.forEach((obj) => {
      ctx.save();

      ctx.translate(obj.x + obj.width / 2, obj.y + obj.height / 2);
      ctx.rotate((obj.rotation * Math.PI) / 180);

      switch (obj.type) {
        case "chair":
          ctx.fillStyle = "#00C8B3";
          ctx.fillRect(-25, -25, 50, 50);
          break;
        case "table":
          ctx.fillStyle = "var(--dark-gray)";
          ctx.fillRect(-40, -20, 80, 40);
          break;
        case "sofa":
          ctx.fillStyle = "var(--light-gray)";
          ctx.fillRect(-60, -25, 120, 50);
          break;
        case "cabinet":
          ctx.fillStyle = "#C0F6F1";
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
    const newObj = {
      id: Date.now(),
      type,
      x: roomBounds?.startX + 20 || 200,
      y: roomBounds?.startY + 20 || 200,
      width:
        type === "chair"
          ? 50
          : type === "table"
          ? 80
          : type === "sofa"
          ? 120
          : 40,
      height:
        type === "chair"
          ? 50
          : type === "table"
          ? 40
          : type === "sofa"
          ? 50
          : 100,
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
    const image = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = image;
    link.download = "room-design.png";
    link.click();
  };

  /* ===============================
     DRAG WITH BOUNDARY CONTROL
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
    if (!isDragging || !roomBounds) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setObjects((prev) =>
      prev.map((obj) => {
        if (obj.id !== selectedId) return obj;

        let newX = mouseX - obj.width / 2;
        let newY = mouseY - obj.height / 2;

        const minX = roomBounds.startX;
        const minY = roomBounds.startY;
        const maxX = roomBounds.startX + roomBounds.roomWidth - obj.width;
        const maxY = roomBounds.startY + roomBounds.roomHeight - obj.height;

        newX = Math.max(minX, Math.min(newX, maxX));
        newY = Math.max(minY, Math.min(newY, maxY));

        if (room.shape === "l-shape") {
          const lWidth = Number(room.lWidth || 0) * roomBounds.scale;
          const lHeight = Number(room.lHeight || 0) * roomBounds.scale;

          const inCutArea =
            newX + obj.width > roomBounds.startX + lWidth &&
            newY < roomBounds.startY + lHeight;

          if (inCutArea) return obj;
        }

        return { ...obj, x: newX, y: newY };
      })
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