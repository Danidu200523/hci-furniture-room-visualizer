import { useEffect, useRef, useContext } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DesignContext } from "../context/DesignContext";
import Sidebar3D from "../components/Sidebar3D";
import "../styles/view3d.css";

function View3D() {
  const mountRef = useRef(null);
  const { room, objects, setObjects } = useContext(DesignContext);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    /* ================= SCENE ================= */
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);

    /* ================= CAMERA ================= */
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 5000);
    camera.position.set(400, 400, 400);
    camera.lookAt(0, 0, 0);

    /* ================= RENDERER ================= */
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    /* ================= CONTROLS ================= */
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    /* ================= ROOM SCALE ================= */

    const padding = 80;
    const roomWidthRaw = Number(room.width || 10);
    const roomHeightRaw = Number(room.height || 10);

    const scaleX = (width - padding) / roomWidthRaw;
    const scaleY = (height - padding) / roomHeightRaw;
    const scale = Math.min(scaleX, scaleY);

    const scaledRoomWidth = roomWidthRaw * scale;
    const scaledRoomHeight = roomHeightRaw * scale;

    const startX = (width - scaledRoomWidth) / 2;
    const startY = (height - scaledRoomHeight) / 2;

    /* ================= FLOOR ================= */

    let floor;

    if (room.shape === "l-shape") {
      const lWidth = Number(room.lWidth || 0) * scale;
      const lHeight = Number(room.lHeight || 0) * scale;

      const shape = new THREE.Shape();

      shape.moveTo(0, 0);
      shape.lineTo(scaledRoomWidth, 0);
      shape.lineTo(scaledRoomWidth, scaledRoomHeight);
      shape.lineTo(lWidth, scaledRoomHeight);
      shape.lineTo(lWidth, lHeight);
      shape.lineTo(0, lHeight);
      shape.lineTo(0, 0);

      const geometry = new THREE.ShapeGeometry(shape);

      const material = new THREE.MeshStandardMaterial({
        color: room.color || "#ffffff",
        side: THREE.DoubleSide,
      });

      floor = new THREE.Mesh(geometry, material);
      floor.rotation.x = -Math.PI / 2;

      floor.position.set(
        -scaledRoomWidth / 2,
        0,
        scaledRoomHeight / 2
      );
    } else {
      const geometry = new THREE.PlaneGeometry(
        scaledRoomWidth,
        scaledRoomHeight
      );

      const material = new THREE.MeshStandardMaterial({
        color: room.color || "#ffffff",
        side: THREE.DoubleSide,
      });

      floor = new THREE.Mesh(geometry, material);
      floor.rotation.x = -Math.PI / 2;
      floor.position.set(0, 0, 0);
    }

    scene.add(floor);

    /* ================= BEAUTIFUL FURNITURE COLORS ================= */

    const furnitureColors = {
      chair: "#FF6B6B",     // soft red
      table: "#4ECDC4",     // teal
      sofa: "#556270",      // modern grey-blue
      cabinet: "#C7B198",   // warm wood tone
      bed: "#8E44AD",       // royal purple
      default: "#2ECC71"    // fallback green
    };

    /* ================= OBJECTS ================= */

    objects.forEach((obj) => {
      let geometry;

      switch (obj.type) {
        case "chair":
          geometry = new THREE.BoxGeometry(50, 20, 50);
          break;
        case "table":
          geometry = new THREE.BoxGeometry(80, 10, 40);
          break;
        case "sofa":
          geometry = new THREE.BoxGeometry(120, 25, 50);
          break;
        case "cabinet":
          geometry = new THREE.BoxGeometry(40, 50, 40);
          break;
        default:
          geometry = new THREE.BoxGeometry(60, 30, 60);
      }

      const material = new THREE.MeshStandardMaterial({
        color: furnitureColors[obj.type] || furnitureColors.default,
        metalness: 0.3,
        roughness: 0.6
      });

      const mesh = new THREE.Mesh(geometry, material);

      // remove canvas offset
      const localX = obj.x - startX;
      const localY = obj.y - startY;

      // convert to centered 3D
      const x = localX - scaledRoomWidth / 2;
      const z = -(localY - scaledRoomHeight / 2);

      mesh.position.set(
        x,
        geometry.parameters.height / 2,
        z
      );

      mesh.rotation.y = (obj.rotation * Math.PI) / 180;

      scene.add(mesh);
    });

    /* ================= LIGHTING ================= */

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(500, 500, 500);
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    /* ================= ANIMATION ================= */

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [room, objects]);

  const handleSave = () => {
    const canvas = mountRef.current.querySelector("canvas");
    if (!canvas) return;

    const image = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = image;
    link.download = "room-3d.png";
    link.click();
  };

  const handleDelete = () => {
    setObjects([]);
  };

  const handleRotate = () => {
    alert("Use mouse to rotate the 3D view.");
  };

  return (
    <div className="view3d-layout">
      <Sidebar3D
        rotateSelected={handleRotate}
        deleteSelected={handleDelete}
        saveDesign={handleSave}
        is3D={true}
      />

      <div className="view3d-main">
        <h2>3D View</h2>
        <div className="three-container" ref={mountRef}></div>
      </div>
    </div>
  );
}

export default View3D;