import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

function WireframeShape({ position, rotation, geometry, speed = 0.3, color = "#ff4500" }) {
  const meshRef = useRef();

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * speed * 0.4;
      meshRef.current.rotation.y += delta * speed * 0.6;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={meshRef} position={position} rotation={rotation}>
        {geometry}
        <meshBasicMaterial color={color} wireframe transparent opacity={0.12} />
      </mesh>
    </Float>
  );
}

function Particles({ count = 60 }) {
  const points = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return positions;
  }, [count]);

  const ref = useRef();

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.015;
      ref.current.rotation.x += delta * 0.008;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#ff4500"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
}

function Scene() {
  return (
    <>
      <WireframeShape
        position={[-4.5, 1.5, -3]}
        rotation={[0.5, 0.3, 0]}
        geometry={<icosahedronGeometry args={[1.2, 1]} />}
        speed={0.25}
        color="#ff4500"
      />
      <WireframeShape
        position={[4, -1, -4]}
        rotation={[0.2, 0.8, 0.1]}
        geometry={<octahedronGeometry args={[1, 0]} />}
        speed={0.35}
        color="#8b5cf6"
      />
      <WireframeShape
        position={[-2, -2, -5]}
        rotation={[0.7, 0.1, 0.4]}
        geometry={<torusGeometry args={[0.8, 0.3, 8, 16]} />}
        speed={0.2}
        color="#22c55e"
      />
      <WireframeShape
        position={[2.5, 2, -3.5]}
        rotation={[0.1, 0.5, 0.3]}
        geometry={<dodecahedronGeometry args={[0.7, 0]} />}
        speed={0.3}
        color="#eab308"
      />
      <WireframeShape
        position={[0, -0.5, -6]}
        rotation={[0.3, 0.6, 0.2]}
        geometry={<tetrahedronGeometry args={[0.9, 0]} />}
        speed={0.15}
        color="#ef4444"
      />
      <Particles count={80} />
    </>
  );
}

export default function ThreeBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
