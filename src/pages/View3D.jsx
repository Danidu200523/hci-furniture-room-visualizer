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
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 2000);
    camera.position.set(200, 200, 300);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    /* ================= FLOOR ================= */
    const floorGeometry = new THREE.PlaneGeometry(
      Number(room.width || 10) * 10,
      Number(room.height || 10) * 10
    );

    const floorMaterial = new THREE.MeshStandardMaterial({
      color: room.color || "#ffffff",
      side: THREE.DoubleSide,
    });

    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    /* ================= OBJECTS ================= */
    objects.forEach((obj) => {
      let geometry;

      switch (obj.type) {
        case "chair":
          geometry = new THREE.BoxGeometry(20, 20, 20);
          break;
        case "table":
          geometry = new THREE.BoxGeometry(50, 10, 30);
          break;
        case "sofa":
          geometry = new THREE.BoxGeometry(70, 25, 35);
          break;
        case "cabinet":
          geometry = new THREE.BoxGeometry(20, 50, 20);
          break;
        default:
          geometry = new THREE.BoxGeometry(30, 30, 30);
      }

      const material = new THREE.MeshStandardMaterial({
        color: 0x00c8b3,
      });

      const mesh = new THREE.Mesh(geometry, material);

      mesh.position.x = obj.x - 300;
      mesh.position.z = obj.y - 300;
      mesh.position.y = geometry.parameters.height / 2;

      scene.add(mesh);
    });

    /* ================= LIGHTING ================= */
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(200, 300, 200);
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
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

  /* ================= BUTTON FUNCTIONS ================= */

  const handleSave = () => {
    const canvas = mountRef.current.querySelector("canvas");
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