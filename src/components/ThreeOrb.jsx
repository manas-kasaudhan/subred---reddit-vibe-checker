import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";

function Orb() {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={1.2}>
      <mesh ref={meshRef} scale={1.8}>
        <icosahedronGeometry args={[1, 4]} />
        <MeshDistortMaterial
          color="#ff4500"
          wireframe
          transparent
          opacity={0.25}
          distort={0.3}
          speed={2}
        />
      </mesh>

      {/* Inner solid sphere */}
      <mesh scale={0.9}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color="#ff4500"
          transparent
          opacity={0.04}
          roughness={0.8}
        />
      </mesh>
    </Float>
  );
}

function Ring({ radius = 2.2, speed = 0.5, color = "#8b5cf6" }) {
  const ref = useRef();

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = Math.PI / 2 + Math.sin(state.clock.elapsedTime * speed) * 0.3;
      ref.current.rotation.z = state.clock.elapsedTime * speed * 0.5;
    }
  });

  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, 0.02, 16, 64]} />
      <meshBasicMaterial color={color} transparent opacity={0.15} />
    </mesh>
  );
}

export default function ThreeOrb() {
  return (
    <div className="mx-auto h-48 w-48">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={0.5} />
        <Orb />
        <Ring radius={2.2} speed={0.5} color="#8b5cf6" />
        <Ring radius={2.6} speed={0.3} color="#ff4500" />
      </Canvas>
    </div>
  );
}
