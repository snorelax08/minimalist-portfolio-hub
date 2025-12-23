import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function FloatingGeometry() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Create glass-like material
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x88ccff,
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.95,
      thickness: 0.5,
      envMapIntensity: 1,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      ior: 1.5,
      transparent: true,
      opacity: 0.8,
    });

    // Create main icosahedron
    const icosahedronGeometry = new THREE.IcosahedronGeometry(1.2, 0);
    const icosahedron = new THREE.Mesh(icosahedronGeometry, glassMaterial);
    scene.add(icosahedron);

    // Create wireframe overlay
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    const wireframe = new THREE.Mesh(icosahedronGeometry, wireframeMaterial);
    wireframe.scale.setScalar(1.02);
    scene.add(wireframe);

    // Create smaller orbiting shapes
    const orbitGroup = new THREE.Group();
    const smallGeometry = new THREE.OctahedronGeometry(0.15, 0);
    const smallMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xaaddff,
      metalness: 0.2,
      roughness: 0.1,
      transmission: 0.9,
      transparent: true,
      opacity: 0.7,
    });

    for (let i = 0; i < 6; i++) {
      const small = new THREE.Mesh(smallGeometry, smallMaterial);
      const angle = (i / 6) * Math.PI * 2;
      small.position.x = Math.cos(angle) * 2;
      small.position.y = Math.sin(angle) * 2;
      small.position.z = Math.sin(angle * 2) * 0.5;
      orbitGroup.add(small);
    }
    scene.add(orbitGroup);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const pointLight1 = new THREE.PointLight(0x6366f1, 2, 10);
    pointLight1.position.set(-3, 2, 2);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x06b6d4, 2, 10);
    pointLight2.position.set(3, -2, 2);
    scene.add(pointLight2);

    // Mouse tracking
    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / height) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation
    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth rotation following mouse
      const targetRotationY = mouseRef.current.x * 0.5;
      const targetRotationX = mouseRef.current.y * 0.3;
      
      icosahedron.rotation.y += (targetRotationY - icosahedron.rotation.y) * 0.05;
      icosahedron.rotation.x += (targetRotationX - icosahedron.rotation.x) * 0.05;
      icosahedron.rotation.z = Math.sin(elapsed * 0.5) * 0.1;

      wireframe.rotation.copy(icosahedron.rotation);

      // Floating animation
      icosahedron.position.y = Math.sin(elapsed * 0.8) * 0.2;
      wireframe.position.y = icosahedron.position.y;

      // Orbiting shapes
      orbitGroup.rotation.y = elapsed * 0.3;
      orbitGroup.rotation.x = Math.sin(elapsed * 0.2) * 0.3;
      orbitGroup.children.forEach((child, i) => {
        child.rotation.x = elapsed * (1 + i * 0.1);
        child.rotation.y = elapsed * (0.5 + i * 0.1);
      });

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      container.removeChild(renderer.domElement);
      renderer.dispose();
      icosahedronGeometry.dispose();
      glassMaterial.dispose();
      wireframeMaterial.dispose();
      smallGeometry.dispose();
      smallMaterial.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full absolute inset-0 pointer-events-auto"
      style={{ minHeight: '300px' }}
    />
  );
}
