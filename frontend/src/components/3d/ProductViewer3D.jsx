import React, { Suspense, useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, AdaptiveDpr, PerformanceMonitor, useGLTF } from '@react-three/drei';
import ProceduralGarment from './ProceduralGarment';
import { RotateCcw, ZoomIn, Palette, Loader2 } from 'lucide-react';

/**
 * GLTF Loader Component for real .glb files
 */
function ExternalGlbModel({ url, color }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={1.2} position={[0, -0.6, 0]} />;
}

/**
 * Progress Loader Fallback
 */
function ViewerLoader() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#FAF8F5]/90 backdrop-blur-sm z-20">
      <Loader2 size={32} className="text-[#C59B27] animate-spin mb-3" />
      <span className="font-serif text-sm tracking-wider uppercase text-[#141210]">
        Loading Atelier 3D Studio
      </span>
      <span className="text-[10px] text-[#6E675F] mt-1">Calibrating texture shaders...</span>
    </div>
  );
}

/**
 * ProductViewer3D (Canvas 2)
 */
export const ProductViewer3D = ({
  modelUrl = null,
  posterImage,
  currentColor = '#C59B27',
  onColorChange,
  availableColors = [],
}) => {
  const [dpr, setDpr] = useState(1.5);
  const [autoRotate, setAutoRotate] = useState(true);
  const controlsRef = useRef();

  const resetView = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div className="relative w-full h-[540px] sm:h-[620px] bg-[#FAF8F5] rounded-sm overflow-hidden border border-[#E7E2DA] select-none">
      {/* 3D WebGL Canvas */}
      <Suspense fallback={<ViewerLoader />}>
        <Canvas
          camera={{ position: [0, 1.2, 3.2], fov: 45 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          dpr={dpr}
          className="cursor-grab active:cursor-grabbing"
        >
          <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(1.5)} />
          <AdaptiveDpr pixelated={false} />

          <Stage
            environment="city"
            intensity={0.65}
            contactShadow={{ opacity: 0.45, blur: 2, position: [0, -0.7, 0] }}
            adjustCamera={false}
          >
            {modelUrl ? (
              <ExternalGlbModel url={modelUrl} color={currentColor} />
            ) : (
              <ProceduralGarment color={currentColor} isRotating={autoRotate} />
            )}
          </Stage>

          <OrbitControls
            ref={controlsRef}
            enablePan={false}
            minDistance={2.0}
            maxDistance={4.8}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.9}
            autoRotate={autoRotate}
            autoRotateSpeed={1.5}
            onStart={() => setAutoRotate(false)}
          />
        </Canvas>
      </Suspense>

      {/* Floating 3D Studio Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col space-y-2">
        <button
          type="button"
          onClick={resetView}
          className="p-2.5 bg-white/90 backdrop-blur-md border border-[#E7E2DA] rounded-full text-[#141210] hover:text-[#C59B27] shadow-luxury-sm cursor-pointer transition-colors"
          title="Reset Camera View"
          aria-label="Reset Camera"
        >
          <RotateCcw size={16} strokeWidth={1.5} />
        </button>
        <button
          type="button"
          onClick={() => setAutoRotate(!autoRotate)}
          className={`p-2.5 backdrop-blur-md border border-[#E7E2DA] rounded-full shadow-luxury-sm cursor-pointer transition-colors ${
            autoRotate ? 'bg-[#141210] text-white' : 'bg-white/90 text-[#141210]'
          }`}
          title="Toggle Auto Rotation"
          aria-label="Toggle Auto Rotation"
        >
          <ZoomIn size={16} strokeWidth={1.5} />
        </button>
      </div>

      {/* Color Swatch Selector overlay inside 3D Viewer */}
      {availableColors && availableColors.length > 0 && (
        <div className="absolute bottom-4 left-4 z-20 bg-white/90 backdrop-blur-md border border-[#E7E2DA] px-4 py-2.5 rounded-full flex items-center space-x-3 shadow-luxury-sm">
          <Palette size={14} className="text-[#C59B27]" />
          <span className="text-[10px] uppercase tracking-couture font-semibold text-[#141210]">
            Variant Shade:
          </span>
          <div className="flex items-center space-x-2">
            {availableColors.map((color) => (
              <button
                key={color.name}
                type="button"
                onClick={() => onColorChange && onColorChange(color)}
                style={{ backgroundColor: color.hex }}
                className={`w-5 h-5 rounded-full border transition-transform cursor-pointer ${
                  currentColor === color.modelColor || currentColor === color.hex
                    ? 'ring-2 ring-[#C59B27] scale-110 border-white'
                    : 'border-black/20 hover:scale-105'
                }`}
                title={color.name}
                aria-label={`Select ${color.name}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* 360 Drag Instruction Badge */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none">
        <span className="text-[9px] uppercase tracking-[0.25em] bg-[#141210]/80 backdrop-blur-sm text-white px-3 py-1 rounded-full font-medium">
          Interactive 360° Studio &middot; Drag to Rotate
        </span>
      </div>
    </div>
  );
};

export default ProductViewer3D;
