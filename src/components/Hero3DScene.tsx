import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT = 3000;
const STAR_COUNT = 500;

// Particles flying through Z-space with dramatic depth
function WarpParticles() {
  const mesh = useRef<THREE.Points>(null);
  const startTime = useRef(Date.now());
  
  const [geometry, material] = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);
    const speeds = new Float32Array(PARTICLE_COUNT);
    
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      
      // Spread particles in a tunnel shape
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 8 + 2;
      
      positions[i3] = Math.cos(angle) * radius;
      positions[i3 + 1] = Math.sin(angle) * radius;
      positions[i3 + 2] = Math.random() * 100 - 50; // Deep Z spread
      
      // Colors: purple to blue to cyan gradient based on depth
      const t = Math.random();
      colors[i3] = 0.3 + t * 0.4;
      colors[i3 + 1] = 0.2 + t * 0.5;
      colors[i3 + 2] = 0.7 + t * 0.3;
      
      sizes[i] = Math.random() * 4 + 2;
      speeds[i] = Math.random() * 0.5 + 0.3;
    }
    
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('speed', new THREE.BufferAttribute(speeds, 1));
    
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        pixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      },
      vertexShader: `
        attribute float size;
        attribute float speed;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vAlpha;
        uniform float time;
        uniform float pixelRatio;
        
        void main() {
          vColor = color;
          
          vec3 pos = position;
          
          // Warp speed effect - particles fly toward camera
          float z = mod(pos.z + time * speed * 30.0, 100.0) - 50.0;
          pos.z = z;
          
          // Particles closer to camera are brighter
          vAlpha = smoothstep(-50.0, 10.0, z) * 0.9;
          
          // Add some spiral motion
          float spiralAngle = time * 0.2 + pos.z * 0.02;
          float spiralRadius = length(pos.xy);
          pos.x = cos(atan(pos.y, pos.x) + spiralAngle) * spiralRadius;
          pos.y = sin(atan(pos.y, pos.x) + spiralAngle) * spiralRadius;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          
          // Size based on depth - closer = bigger
          float depthSize = 300.0 / -mvPosition.z;
          gl_PointSize = size * depthSize * pixelRatio;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;
        
        void main() {
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);
          
          if (dist > 0.5) discard;
          
          float core = smoothstep(0.5, 0.0, dist);
          float glow = exp(-dist * 4.0);
          
          vec3 finalColor = vColor * (1.0 + glow * 2.0);
          float alpha = core * vAlpha;
          
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    });
    
    return [geo, mat];
  }, []);

  useFrame((state) => {
    if (material) {
      material.uniforms.time.value = state.clock.elapsedTime;
    }
  });

  return <points ref={mesh} geometry={geometry} material={material} />;
}

// Background stars at different depths
function StarField() {
  const mesh = useRef<THREE.Points>(null);
  
  const geometry = useMemo(() => {
    const positions = new Float32Array(STAR_COUNT * 3);
    const sizes = new Float32Array(STAR_COUNT);
    
    for (let i = 0; i < STAR_COUNT; i++) {
      const i3 = i * 3;
      const radius = Math.random() * 40 + 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = -radius * 0.5 - 20;
      
      sizes[i] = Math.random() * 2 + 0.5;
    }
    
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    return geo;
  }, []);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        pixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      },
      vertexShader: `
        attribute float size;
        uniform float time;
        uniform float pixelRatio;
        varying float vTwinkle;
        
        void main() {
          vec3 pos = position;
          
          // Slow rotation
          float angle = time * 0.02;
          float x = pos.x * cos(angle) - pos.z * sin(angle);
          float z = pos.x * sin(angle) + pos.z * cos(angle);
          pos.x = x;
          pos.z = z;
          
          // Twinkle effect
          vTwinkle = sin(time * 2.0 + position.x * 10.0) * 0.5 + 0.5;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = size * (200.0 / -mvPosition.z) * pixelRatio * (0.5 + vTwinkle * 0.5);
        }
      `,
      fragmentShader: `
        varying float vTwinkle;
        
        void main() {
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);
          if (dist > 0.5) discard;
          
          float alpha = smoothstep(0.5, 0.0, dist) * (0.3 + vTwinkle * 0.7);
          gl_FragColor = vec4(0.8, 0.85, 1.0, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  useFrame((state) => {
    material.uniforms.time.value = state.clock.elapsedTime;
  });

  return <points ref={mesh} geometry={geometry} material={material} />;
}

// Glowing central orb with pulsing energy
function EnergyCore() {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  const coreMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform float time;
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          
          vec3 pos = position;
          
          // Organic pulsing deformation
          float pulse = sin(time * 2.0) * 0.1 + 1.0;
          float noise = sin(pos.x * 4.0 + time * 2.0) * sin(pos.y * 4.0 + time * 1.5) * sin(pos.z * 4.0 + time);
          pos = pos * pulse + normal * noise * 0.2;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform float time;
        
        void main() {
          // Fresnel glow
          float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.5);
          
          // Animated color bands
          float band = sin(vPosition.y * 8.0 - time * 3.0) * 0.5 + 0.5;
          
          vec3 purple = vec3(0.55, 0.25, 0.95);
          vec3 blue = vec3(0.25, 0.45, 0.95);
          vec3 cyan = vec3(0.2, 0.8, 0.9);
          
          vec3 color = mix(purple, blue, band);
          color = mix(color, cyan, fresnel * 0.5);
          
          float alpha = 0.3 + fresnel * 0.7;
          
          gl_FragColor = vec4(color * (1.0 + fresnel), alpha);
        }
      `,
      transparent: true,
      side: THREE.FrontSide,
    });
  }, []);

  const glowMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
      },
      vertexShader: `
        varying vec3 vNormal;
        uniform float time;
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          
          vec3 pos = position;
          float pulse = sin(time * 2.0) * 0.15 + 1.0;
          pos *= pulse;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        uniform float time;
        
        void main() {
          float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          
          vec3 purple = vec3(0.55, 0.25, 0.95);
          vec3 blue = vec3(0.3, 0.5, 1.0);
          
          vec3 color = mix(purple, blue, sin(time) * 0.5 + 0.5);
          
          gl_FragColor = vec4(color, intensity * 0.4);
        }
      `,
      transparent: true,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.3;
      meshRef.current.rotation.x = Math.sin(t * 0.2) * 0.2;
    }
    
    coreMaterial.uniforms.time.value = t;
    glowMaterial.uniforms.time.value = t;
  });

  return (
    <group position={[0, 0, -12]}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[2, 4]} />
        <primitive object={coreMaterial} attach="material" />
      </mesh>
      <mesh ref={glowRef} scale={1.4}>
        <icosahedronGeometry args={[2, 4]} />
        <primitive object={glowMaterial} attach="material" />
      </mesh>
    </group>
  );
}

// Orbital rings with different depths
function OrbitalRings() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.1;
    }
  });

  const rings = [
    { radius: 4, z: -15, speed: 1, color: '#8b5cf6' },
    { radius: 6, z: -18, speed: -0.7, color: '#6366f1' },
    { radius: 8, z: -22, speed: 0.5, color: '#3b82f6' },
    { radius: 10, z: -28, speed: -0.3, color: '#0ea5e9' },
  ];

  return (
    <group ref={groupRef}>
      {rings.map((ring, i) => (
        <Ring key={i} {...ring} index={i} />
      ))}
    </group>
  );
}

function Ring({ radius, z, speed, color, index }: { radius: number; z: number; speed: number; color: string; index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.PI / 2 + Math.sin(state.clock.elapsedTime * 0.5 + index) * 0.3;
      meshRef.current.rotation.z = state.clock.elapsedTime * speed;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, z]}>
      <torusGeometry args={[radius, 0.03, 16, 100]} />
      <meshBasicMaterial color={color} transparent opacity={0.5} />
    </mesh>
  );
}

// Camera with initial dramatic push-in and subtle mouse parallax
function AnimatedCamera() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const targetPos = useRef({ x: 0, y: 0, z: 15 });
  const startTime = useRef(Date.now());
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state) => {
    const elapsed = (Date.now() - startTime.current) / 1000;
    
    // Dramatic push-in on load (from z=25 to z=8 over 3 seconds)
    const introProgress = Math.min(elapsed / 3, 1);
    const easeOut = 1 - Math.pow(1 - introProgress, 3);
    const baseZ = 25 - easeOut * 17; // 25 -> 8
    
    // Subtle breathing motion
    const breathe = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    
    // Mouse parallax
    targetPos.current.x = mouse.current.x * 2;
    targetPos.current.y = mouse.current.y * 1.5;
    targetPos.current.z = baseZ + breathe;
    
    // Smooth camera movement
    camera.position.x += (targetPos.current.x - camera.position.x) * 0.05;
    camera.position.y += (targetPos.current.y - camera.position.y) * 0.05;
    camera.position.z += (targetPos.current.z - camera.position.z) * 0.08;
    
    // Always look at center with slight offset
    camera.lookAt(mouse.current.x * 0.5, mouse.current.y * 0.3, -10);
  });

  return null;
}

function Scene() {
  return (
    <>
      <color attach="background" args={['#030014']} />
      <fog attach="fog" args={['#030014', 15, 60]} />
      
      <AnimatedCamera />
      <StarField />
      <WarpParticles />
      <EnergyCore />
      <OrbitalRings />
      
      {/* Volumetric light rays */}
      <pointLight position={[0, 0, -10]} color="#8b5cf6" intensity={100} distance={40} />
      <pointLight position={[5, 3, -5]} color="#3b82f6" intensity={50} distance={30} />
      <pointLight position={[-5, -3, -5]} color="#06b6d4" intensity={50} distance={30} />
      
      <ambientLight intensity={0.1} />
    </>
  );
}

export function Hero3DScene() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="absolute inset-0" style={{ zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 25], fov: 75 }}
        dpr={[1, 2]}
        gl={{ 
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        onCreated={() => {
          setTimeout(() => setIsLoaded(true), 100);
        }}
        style={{ 
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.5s ease-out',
          background: '#030014',
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
