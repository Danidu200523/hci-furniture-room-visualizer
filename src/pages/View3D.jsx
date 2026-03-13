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

    
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);

    
    const camera = new THREE.PerspectiveCamera(
      60,
      width / height,
      0.1,
      5000
    );

    camera.position.set(400, 350, 400);

    

    const renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;

    container.appendChild(renderer.domElement);

    
    const controls = new OrbitControls(camera, renderer.domElement);

    controls.enableDamping = true;
    controls.maxPolarAngle = Math.PI / 2.1;
    controls.target.set(0, 0, 0);
    controls.update();

    
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

    
    const textureLoader = new THREE.TextureLoader();

    const floorTexture = textureLoader.load("/textures/wood.jpg");

    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(4, 4);

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
        map: floorTexture,
        side: THREE.DoubleSide
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
        map: floorTexture,
        side: THREE.DoubleSide
      });

      floor = new THREE.Mesh(geometry, material);

      floor.rotation.x = -Math.PI / 2;
      floor.position.set(0, 0, 0);

    }

    floor.receiveShadow = true;

    scene.add(floor);

    
    
const wallHeight = 120;

const wallMaterial = new THREE.MeshStandardMaterial({
  color: "#eeeeee"
});

if (room.shape === "l-shape") {

  const lWidth = Number(room.lWidth || 0) * scale;
  const lHeight = Number(room.lHeight || 0) * scale;

  const shapePoints = [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(scaledRoomWidth, 0),
    new THREE.Vector2(scaledRoomWidth, scaledRoomHeight),
    new THREE.Vector2(lWidth, scaledRoomHeight),
    new THREE.Vector2(lWidth, lHeight),
    new THREE.Vector2(0, lHeight),
    new THREE.Vector2(0, 0)
  ];

  for (let i = 0; i < shapePoints.length - 1; i++) {

    const start = shapePoints[i];
    const end = shapePoints[i + 1];

    const wallLength = start.distanceTo(end);

    const wallGeometry = new THREE.BoxGeometry(
      wallLength,
      wallHeight,
      10
    );

    const wall = new THREE.Mesh(wallGeometry, wallMaterial);

    const midX = (start.x + end.x) / 2 - scaledRoomWidth / 2;
    const midZ = -( (start.y + end.y) / 2 - scaledRoomHeight / 2 );

    wall.position.set(midX, wallHeight / 2, midZ);

    const angle = Math.atan2(end.y - start.y, end.x - start.x);
    wall.rotation.y = -angle;

    scene.add(wall);
  }

} else {

  const walls = [

    //{ w: scaledRoomWidth, z: -scaledRoomHeight / 2 },
    { w: scaledRoomWidth, z: scaledRoomHeight / 2 }

  ];

  walls.forEach(w => {

    const wall = new THREE.Mesh(
      new THREE.BoxGeometry(w.w, wallHeight, 10),
      wallMaterial
    );

    wall.position.set(0, wallHeight / 2, w.z);

    scene.add(wall);

  });

  const sideWalls = [

    { x: -scaledRoomWidth / 2 },
    { x: scaledRoomWidth / 2 }

  ];

  sideWalls.forEach(w => {

    const wall = new THREE.Mesh(
      new THREE.BoxGeometry(10, wallHeight, scaledRoomHeight),
      wallMaterial
    );

    wall.position.set(w.x, wallHeight / 2, 0);

    scene.add(wall);

  });

}

   
    const furnitureColors = {
      chair: "#FF6B6B",
      table: "#4ECDC4",
      sofa: "#556270",
      cabinet: "#C7B198",
      bed: "#8E44AD",
      default: "#2ECC71"
    };

    
    objects.forEach((obj) => {

      const color = furnitureColors[obj.type] || furnitureColors.default;

      const material = new THREE.MeshStandardMaterial({
        color,
        metalness: 0.3,
        roughness: 0.6
      });

      let mesh;

      if (obj.type === "chair") {

  const group = new THREE.Group();

  const seat = new THREE.Mesh(
    new THREE.BoxGeometry(40, 8, 40),
    material
  );
  seat.position.y = 30;
  group.add(seat);

  const back = new THREE.Mesh(
    new THREE.BoxGeometry(40, 40, 8),
    material
  );
  back.position.set(0, 50, -16);
  group.add(back);

  const legGeometry = new THREE.BoxGeometry(5, 30, 5);

  const leg1 = new THREE.Mesh(legGeometry, material);
  leg1.position.set(-15, 15, -15);

  const leg2 = new THREE.Mesh(legGeometry, material);
  leg2.position.set(15, 15, -15);

  const leg3 = new THREE.Mesh(legGeometry, material);
  leg3.position.set(-15, 15, 15);

  const leg4 = new THREE.Mesh(legGeometry, material);
  leg4.position.set(15, 15, 15);

  group.add(leg1, leg2, leg3, leg4);

  mesh = group;
}

      else if (obj.type === "table") {

  const group = new THREE.Group();

  const top = new THREE.Mesh(
    new THREE.BoxGeometry(120, 8, 60),
    material
  );
  top.position.y = 50;
  group.add(top);

  const legGeometry = new THREE.BoxGeometry(6, 50, 6);

  const leg1 = new THREE.Mesh(legGeometry, material);
  leg1.position.set(-50, 25, -25);

  const leg2 = new THREE.Mesh(legGeometry, material);
  leg2.position.set(50, 25, -25);

  const leg3 = new THREE.Mesh(legGeometry, material);
  leg3.position.set(-50, 25, 25);

  const leg4 = new THREE.Mesh(legGeometry, material);
  leg4.position.set(50, 25, 25);

  group.add(leg1, leg2, leg3, leg4);

  mesh = group;
}
      else if (obj.type === "sofa") {

        const group = new THREE.Group();

        const seat = new THREE.Mesh(
          new THREE.BoxGeometry(140, 30, 60),
          material
        );

        seat.position.y = 20;

        const back = new THREE.Mesh(
          new THREE.BoxGeometry(140, 50, 20),
          material
        );

        back.position.set(0, 45, -20);

        group.add(seat);
        group.add(back);

        mesh = group;

      }

      else {

        mesh = new THREE.Mesh(
          new THREE.BoxGeometry(40, 50, 40),
          material
        );

      }

      const localX = obj.x - startX;
      const localY = obj.y - startY;

      const x = localX - scaledRoomWidth / 2;
      const z = -(localY - scaledRoomHeight / 2);

      mesh.position.set(x, 0, z);

      mesh.rotation.y = (obj.rotation * Math.PI) / 180;

      mesh.castShadow = true;

      scene.add(mesh);

    });

    /* ================= LIGHTING ================= */

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);

    directionalLight.position.set(500, 500, 500);
    directionalLight.castShadow = true;

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