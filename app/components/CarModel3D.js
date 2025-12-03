'use client';

import { ContactShadows, Environment, Html, OrbitControls, PerspectiveCamera, Stage } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense, useMemo, useState } from 'react';
import * as THREE from 'three';

// --- Materials ---
const carPaintMaterial = new THREE.MeshPhysicalMaterial({
  color: '#ffffff',
  metalness: 0.6,
  roughness: 0.2,
  clearcoat: 1.0,
  clearcoatRoughness: 0.03,
  sheen: 0.5,
});

const glassMaterial = new THREE.MeshPhysicalMaterial({
  color: '#ffffff',
  metalness: 0.9,
  roughness: 0.0,
  transmission: 0.95, // Glass-like
  transparent: true,
  opacity: 0.5,
});

const rubberMaterial = new THREE.MeshStandardMaterial({
  color: '#111111',
  roughness: 0.9,
  metalness: 0.1,
});

const rimMaterial = new THREE.MeshStandardMaterial({
  color: '#dddddd',
  metalness: 0.9,
  roughness: 0.2,
});

// --- Components ---

const PartMesh = ({ geometry, position, rotation, scale, partId, partName, diagnosis, onPartClick, colorOverride }) => {
  const [hovered, setHovered] = useState(false);

  // Determine color based on status or override
  const getStatusColor = () => {
    if (colorOverride) return colorOverride;
    
    const part = diagnosis?.parts?.find(p => p.id === partId);
    if (!part || part.status === 'not_checked') return '#52525b'; // Zinc-600ish base color
    
    const colors = {
      original: '#10b981', // Emerald-500
      painted: '#fbbf24', // Amber-400
      replaced: '#3b82f6', // Blue-500
      damaged: '#ef4444', // Red-500
    };
    return colors[part.status] || '#52525b';
  };

  const baseColor = getStatusColor();
  
  // Clone material to allow individual color changes
  const material = useMemo(() => {
    const mat = carPaintMaterial.clone();
    mat.color.set(baseColor);
    return mat;
  }, [baseColor]);

  // Hover effect
  const displayMaterial = useMemo(() => {
    if (hovered) {
      const mat = material.clone();
      mat.emissive.set('#ffffff');
      mat.emissiveIntensity = 0.2;
      return mat;
    }
    return material;
  }, [material, hovered]);

  const handleClick = (e) => {
    e.stopPropagation();
    if (onPartClick && partId) {
      onPartClick({ id: partId, name: partName });
    }
  };

  return (
    <mesh
      geometry={geometry}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={handleClick}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
      material={displayMaterial}
    >
      {hovered && partName && (
        <Html distanceFactor={10}>
          <div className="bg-zinc-900/90 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs whitespace-nowrap border border-white/20 shadow-xl pointer-events-none transform -translate-y-8">
            {partName}
          </div>
        </Html>
      )}
    </mesh>
  );
};

const Wheel = ({ position, isRight }) => {
  return (
    <group position={position} rotation={[0, isRight ? Math.PI : 0, 0]}>
      {/* Tire */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.32, 0.32, 0.22, 32]} />
        <primitive object={rubberMaterial} />
      </mesh>
      {/* Rim */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.23, 16]} />
        <primitive object={rimMaterial} />
      </mesh>
      {/* Spokes detail */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, isRight ? -0.05 : 0.05]}>
        <boxGeometry args={[0.25, 0.05, 0.24]} />
        <primitive object={rimMaterial} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, Math.PI/2]} position={[0, 0, isRight ? -0.05 : 0.05]}>
        <boxGeometry args={[0.25, 0.05, 0.24]} />
        <primitive object={rimMaterial} />
      </mesh>
    </group>
  );
};

const Car = ({ diagnosis, onPartClick }) => {
  // --- Geometries ---
  
  // Hood Shape
  const hoodGeo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(1.6, 0); // width
    shape.lineTo(1.5, 1.2); // narrows at front
    shape.lineTo(0.1, 1.2);
    shape.lineTo(0, 0);
    
    const extrudeSettings = { depth: 0.1, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0.02, bevelThickness: 0.02 };
    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geo.center();
    return geo;
  }, []);

  // Roof/Cabin Shape
  const cabinGeo = useMemo(() => {
    // Trapezoid prism
    const geometry = new THREE.BoxGeometry(1.5, 0.7, 1.8);
    // Deform vertices to make it trapezoidal (taper top)
    const positionAttribute = geometry.attributes.position;
    for ( let i = 0; i < positionAttribute.count; i ++ ) {
      const y = positionAttribute.getY( i );
      if ( y > 0 ) {
        const x = positionAttribute.getX( i );
        const z = positionAttribute.getZ( i );
        positionAttribute.setX( i, x * 0.85 ); // Taper width
        positionAttribute.setZ( i, z * 0.8 );  // Taper length
      }
    }
    geometry.computeVertexNormals();
    return geometry;
  }, []);

  // Door Shape (Side panel)
  const doorGeo = useMemo(() => {
    const geometry = new THREE.BoxGeometry(0.1, 0.7, 0.95);
    return geometry;
  }, []);

  // Fender Shape
  const fenderGeo = useMemo(() => {
     const geometry = new THREE.BoxGeometry(0.15, 0.5, 0.9);
     return geometry;
  }, []);

  // Bumper Shape
  const bumperGeo = useMemo(() => {
    const geometry = new THREE.BoxGeometry(1.7, 0.35, 0.2);
    // Curve it slightly? For now box is fine with bevel
    return geometry;
  }, []);


  return (
    <group>
      {/* --- Chassis / Base --- */}
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[1.7, 0.15, 4.2]} />
        <meshStandardMaterial color="#18181b" />
      </mesh>

      {/* --- Main Body Parts --- */}

      {/* Hood */}
      <PartMesh
        geometry={hoodGeo}
        position={[0, 0.75, 1.3]}
        rotation={[0.1, 0, 0]} // Sloped
        partId="hood"
        partName="Hood"
        diagnosis={diagnosis}
        onPartClick={onPartClick}
      />

      {/* Trunk */}
      <PartMesh
        geometry={hoodGeo} // Reuse hood shape but smaller/rotated
        position={[0, 0.75, -1.5]}
        rotation={[-0.05, Math.PI, 0]}
        scale={[0.95, 1, 0.8]}
        partId="trunk"
        partName="Trunk"
        diagnosis={diagnosis}
        onPartClick={onPartClick}
      />

      {/* Roof / Cabin (Not clickable as a single part usually, but let's make it inert or part of structure) */}
      <mesh position={[0, 1.1, -0.1]} geometry={cabinGeo}>
         <primitive object={carPaintMaterial} color="#333" />
      </mesh>
      
      {/* Windshield */}
      <mesh position={[0, 1.15, 0.85]} rotation={[0.4, 0, 0]}>
        <planeGeometry args={[1.3, 0.7]} />
        <primitive object={glassMaterial} />
      </mesh>

      {/* Rear Window */}
      <mesh position={[0, 1.15, -1.05]} rotation={[-0.4, Math.PI, 0]}>
        <planeGeometry args={[1.3, 0.7]} />
        <primitive object={glassMaterial} />
      </mesh>

      {/* --- Doors --- */}
      
      {/* Left Front Door */}
      <PartMesh
        geometry={doorGeo}
        position={[0.82, 0.8, 0.4]}
        partId="left_door"
        partName="Left Front Door"
        diagnosis={diagnosis}
        onPartClick={onPartClick}
      />

      {/* Right Front Door */}
      <PartMesh
        geometry={doorGeo}
        position={[-0.82, 0.8, 0.4]}
        partId="right_door"
        partName="Right Front Door"
        diagnosis={diagnosis}
        onPartClick={onPartClick}
      />

      {/* Left Rear Door */}
      <PartMesh
        geometry={doorGeo}
        position={[0.82, 0.8, -0.6]}
        partId="left_rear_door"
        partName="Left Rear Door"
        diagnosis={diagnosis}
        onPartClick={onPartClick}
      />

      {/* Right Rear Door */}
      <PartMesh
        geometry={doorGeo}
        position={[-0.82, 0.8, -0.6]}
        partId="right_rear_door"
        partName="Right Rear Door"
        diagnosis={diagnosis}
        onPartClick={onPartClick}
      />

      {/* --- Fenders --- */}
      
      {/* Left Fender (Front) */}
      <PartMesh
        geometry={fenderGeo}
        position={[0.82, 0.65, 1.4]}
        partId="left_fender"
        partName="Left Fender"
        diagnosis={diagnosis}
        onPartClick={onPartClick}
      />

       {/* Right Fender (Front) */}
      <PartMesh
        geometry={fenderGeo}
        position={[-0.82, 0.65, 1.4]}
        partId="right_fender"
        partName="Right Fender"
        diagnosis={diagnosis}
        onPartClick={onPartClick}
      />

      {/* --- Bumpers --- */}

      {/* Front Bumper */}
      <PartMesh
        geometry={bumperGeo}
        position={[0, 0.5, 2.15]}
        partId="front_bumper"
        partName="Front Bumper"
        diagnosis={diagnosis}
        onPartClick={onPartClick}
      />

      {/* Rear Bumper */}
      <PartMesh
        geometry={bumperGeo}
        position={[0, 0.5, -2.15]}
        partId="rear_bumper"
        partName="Rear Bumper"
        diagnosis={diagnosis}
        onPartClick={onPartClick}
      />

      {/* --- Lights --- */}
      
      {/* Headlights */}
      <mesh position={[0.6, 0.7, 2.18]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.4, 0.15, 0.1]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} />
      </mesh>
      <mesh position={[-0.6, 0.7, 2.18]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.4, 0.15, 0.1]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} />
      </mesh>

      {/* Taillights */}
      <mesh position={[0.6, 0.7, -2.18]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.4, 0.15, 0.1]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={1} />
      </mesh>
      <mesh position={[-0.6, 0.7, -2.18]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.4, 0.15, 0.1]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={1} />
      </mesh>

      {/* --- Wheels --- */}
      <Wheel position={[0.85, 0.32, 1.4]} isRight={false} />
      <Wheel position={[-0.85, 0.32, 1.4]} isRight={true} />
      <Wheel position={[0.85, 0.32, -1.4]} isRight={false} />
      <Wheel position={[-0.85, 0.32, -1.4]} isRight={true} />

    </group>
  );
};

export default function CarModel3D({ diagnosis, onPartClick }) {
  return (
    <div className="w-full h-[500px] relative bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800">
      <Canvas shadows dpr={[1, 2]} camera={{ position: [5, 3, 5], fov: 45 }}>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[5, 3, 5]} fov={50} />
          
          {/* Lighting Environment */}
          <Environment preset="city" />
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
          
          <Stage environment={null} intensity={0.5} contactShadow={false}>
             <Car diagnosis={diagnosis} onPartClick={onPartClick} />
          </Stage>
          
          <ContactShadows resolution={1024} scale={20} blur={2} opacity={0.5} far={10} color="#000000" />
        </Suspense>
        
        <OrbitControls 
          enablePan={false} 
          minPolarAngle={0} 
          maxPolarAngle={Math.PI / 2.2}
          autoRotate={false}
        />
      </Canvas>
      
      {/* Legend Overlay */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-3 justify-center text-xs pointer-events-none select-none">
        <div className="flex items-center gap-1.5 bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
          <span className="text-white/90 font-medium">Original</span>
        </div>
        <div className="flex items-center gap-1.5 bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]"></div>
          <span className="text-white/90 font-medium">Painted</span>
        </div>
        <div className="flex items-center gap-1.5 bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
          <span className="text-white/90 font-medium">Replaced</span>
        </div>
        <div className="flex items-center gap-1.5 bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
          <span className="text-white/90 font-medium">Damaged</span>
        </div>
      </div>
      
      <div className="absolute top-4 right-4 text-white/30 text-[10px] pointer-events-none select-none">
        <p>Interactive 3D View</p>
      </div>
    </div>
  );
}
