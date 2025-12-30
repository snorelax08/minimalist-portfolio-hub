import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Text3D, Center, Environment } from '@react-three/drei';
import * as THREE from 'three';

const PARTICLE_COUNT = 2000;

function Particles({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const mesh = useRef<THREE.Points>(null);
  const light = useRef<THREE.PointLight>(null);
  
  const [positions, velocities, colors, sizes] = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);
    
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const radius = Math.random() * 15 + 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi) - 10;
      
      velocities[i3] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;
      
      // Color gradient from primary to accent
      const t = Math.random();
      colors[i3] = 0.4 + t * 0.4;     // R
      colors[i3 + 1] = 0.2 + t * 0.3; // G  
      colors[i3 + 2] = 0.8 + t * 0.2; // B
      
      sizes[i] = Math.random() * 3 + 1;
    }
    
    return [positions, velocities, colors, sizes];
  }, []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    return geo;
  }, [positions, colors, sizes]);

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        mousePos: { value: new THREE.Vector3(0, 0, 0) },
        pixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vDistance;
        uniform float time;
        uniform vec3 mousePos;
        uniform float pixelRatio;
        
        void main() {
          vColor = color;
          
          vec3 pos = position;
          
          // Organic wave motion
          pos.x += sin(time * 0.3 + position.y * 0.5) * 0.3;
          pos.y += cos(time * 0.2 + position.x * 0.5) * 0.3;
          pos.z += sin(time * 0.4 + position.x * 0.3) * 0.2;
          
          // Mouse attraction/repulsion
          vec3 toMouse = mousePos - pos;
          float dist = length(toMouse);
          float strength = smoothstep(8.0, 0.0, dist) * 2.0;
          pos += normalize(toMouse) * strength;
          
          vDistance = dist;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          
          float sizeAttenuation = 200.0 / -mvPosition.z;
          gl_PointSize = size * sizeAttenuation * pixelRatio * (1.0 + strength * 0.5);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vDistance;
        
        void main() {
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);
          
          if (dist > 0.5) discard;
          
          float alpha = smoothstep(0.5, 0.0, dist);
          float glow = exp(-dist * 3.0);
          
          vec3 finalColor = vColor + glow * 0.5;
          
          gl_FragColor = vec4(finalColor, alpha * 0.8);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    });
  }, []);

  useFrame((state) => {
    if (mesh.current && shaderMaterial) {
      shaderMaterial.uniforms.time.value = state.clock.elapsedTime;
      shaderMaterial.uniforms.mousePos.value.set(
        mouse.current.x * 10,
        mouse.current.y * 6,
        -5
      );
    }
    
    if (light.current) {
      light.current.position.x = mouse.current.x * 5;
      light.current.position.y = mouse.current.y * 3;
    }
  });

  return (
    <>
      <points ref={mesh} geometry={geometry} material={shaderMaterial} />
      <pointLight ref={light} color="#8b5cf6" intensity={50} distance={20} />
      <pointLight position={[0, 0, -5]} color="#3b82f6" intensity={30} distance={25} />
    </>
  );
}

function FloatingRings({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const group = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1 + mouse.current.y * 0.2;
      group.current.rotation.y = state.clock.elapsedTime * 0.1 + mouse.current.x * 0.3;
    }
  });

  return (
    <group ref={group} position={[0, 0, -8]}>
      {[3, 4.5, 6].map((radius, i) => (
        <mesh key={i} rotation={[Math.PI / 2 + i * 0.2, 0, i * 0.5]}>
          <torusGeometry args={[radius, 0.02, 16, 100]} />
          <meshBasicMaterial 
            color={i === 0 ? '#8b5cf6' : i === 1 ? '#6366f1' : '#3b82f6'} 
            transparent 
            opacity={0.4 - i * 0.1} 
          />
        </mesh>
      ))}
    </group>
  );
}

function GlowingSphere({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        mouseInfluence: { value: new THREE.Vector2(0, 0) },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform float time;
        uniform vec2 mouseInfluence;
        
        void main() {
          vNormal = normal;
          vPosition = position;
          
          vec3 pos = position;
          
          // Organic deformation
          float noise = sin(pos.x * 3.0 + time) * sin(pos.y * 3.0 + time * 1.3) * sin(pos.z * 3.0 + time * 0.7);
          pos += normal * noise * 0.15;
          
          // Mouse influence
          pos.x += mouseInfluence.x * 0.3;
          pos.y += mouseInfluence.y * 0.3;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform float time;
        
        void main() {
          float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0);
          
          vec3 color1 = vec3(0.545, 0.361, 0.965); // Purple
          vec3 color2 = vec3(0.231, 0.510, 0.965); // Blue
          
          vec3 color = mix(color1, color2, fresnel + sin(time) * 0.2);
          
          float alpha = fresnel * 0.6 + 0.1;
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
    });
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.2;
    }
    if (shaderMaterial) {
      shaderMaterial.uniforms.time.value = state.clock.elapsedTime;
      shaderMaterial.uniforms.mouseInfluence.value.set(mouse.current.x, mouse.current.y);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -6]}>
      <icosahedronGeometry args={[2.5, 4]} />
      <primitive object={shaderMaterial} attach="material" />
    </mesh>
  );
}

function Scene() {
  const mouse = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <color attach="background" args={['#000000']} />
      <fog attach="fog" args={['#000000', 10, 30]} />
      
      <Particles mouse={mouse} />
      <FloatingRings mouse={mouse} />
      <GlowingSphere mouse={mouse} />
      
      <ambientLight intensity={0.2} />
    </>
  );
}

export function Hero3DScene() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 2]}
        onCreated={() => setIsLoaded(true)}
        style={{ 
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 1s ease-out'
        }}
      >
        <Scene />
      </Canvas>
      
      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/90 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background/60 pointer-events-none" />
    </div>
  );
}
