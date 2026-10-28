import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Procedural Haute Couture Draped Garment Form
 * Sculpted with lathe/extrusions and smooth organic curves.
 * Updates material color and roughness dynamically on variant switch.
 */
export const ProceduralGarment = ({ color = '#C59B27', isRotating = true }) => {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current && isRotating) {
      groupRef.current.rotation.y += delta * 0.45;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.6, 0]}>
      {/* 1. Sculpted Flared Skirt (Lehenga / Gown drape) */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.38, 0.95, 1.4, 32, 16, true]} />
        <meshStandardMaterial
          color={color}
          roughness={0.35}
          metalness={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 2. Structured Corset Bodice */}
      <mesh position={[0, 1.3, 0]}>
        <cylinderGeometry args={[0.42, 0.36, 0.6, 32]} />
        <meshStandardMaterial
          color={color}
          roughness={0.25}
          metalness={0.5}
        />
      </mesh>

      {/* 3. Gold Embellished Waist Band (Kamarbandh) */}
      <mesh position={[0, 1.05, 0]}>
        <torusGeometry args={[0.39, 0.035, 16, 48]} />
        <meshStandardMaterial color="#C59B27" roughness={0.15} metalness={0.85} />
      </mesh>

      {/* 4. Atelier Mannequin Stand & Neck Finial */}
      <mesh position={[0, 1.7, 0]}>
        <cylinderGeometry args={[0.16, 0.22, 0.25, 24]} />
        <meshStandardMaterial color="#141210" roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.85, 0]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color="#C59B27" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Stand Base */}
      <mesh position={[0, -0.35, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.5, 16]} />
        <meshStandardMaterial color="#141210" roughness={0.4} />
      </mesh>
      <mesh position={[0, -0.6, 0]}>
        <cylinderGeometry args={[0.45, 0.48, 0.06, 32]} />
        <meshStandardMaterial color="#141210" roughness={0.3} metalness={0.7} />
      </mesh>
    </group>
  );
};

export default ProceduralGarment;
