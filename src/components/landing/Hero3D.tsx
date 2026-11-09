import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Hero3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !mountRef.current) return;

    const currentMount = mountRef.current;
    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 7;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      currentMount.appendChild(renderer.domElement);
    } catch {
      // Fallback if WebGL is disabled
      return;
    }

    // Geometry 1: Athletic Wireframe Icosahedron (Arena Dome)
    const arenaGeo = new THREE.IcosahedronGeometry(2.6, 2);
    const arenaMat = new THREE.MeshBasicMaterial({
      color: 0xE66A32, // Bright orange
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    });
    const arenaMesh = new THREE.Mesh(arenaGeo, arenaMat);
    scene.add(arenaMesh);

    // Geometry 2: Inner Core Polyhedron (The Core Flame)
    const innerGeo = new THREE.OctahedronGeometry(1.4, 0);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xF4D85A, // Pale yellow
      wireframe: true,
      transparent: true,
      opacity: 0.8,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerMesh);

    // Geometry 3: Orbiting Sports Ring
    const ringGeo = new THREE.TorusGeometry(3.3, 0.04, 8, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xB43C32, // Brick red
      transparent: true,
      opacity: 0.6,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 3;
    scene.add(ringMesh);

    // Particles: Athletic Sparks
    const particleCount = 140;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 10;
      positions[i + 1] = (Math.random() - 0.5) * 8;
      positions[i + 2] = (Math.random() - 0.5) * 6;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xF1EFE8, // Warm cream
      size: 0.06,
      transparent: true,
      opacity: 0.7,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Mouse Tracking Parallax
    let targetX = 0;
    let targetY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = currentMount.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / height) * 2 - 1);
      targetX = x * 0.4;
      targetY = y * 0.3;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!currentMount) return;
      const newW = currentMount.clientWidth;
      const newH = currentMount.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      arenaMesh.rotation.y += 0.003;
      arenaMesh.rotation.x += 0.001;

      innerMesh.rotation.y -= 0.006;
      innerMesh.rotation.z += 0.004;

      ringMesh.rotation.z += 0.002;

      // Parallax smooth interpolation
      camera.position.x += (targetX - camera.position.x) * 0.05;
      camera.position.y += (targetY - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      arenaGeo.dispose();
      innerGeo.dispose();
      ringGeo.dispose();
      particleGeo.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="w-full h-full min-h-[340px] md:min-h-[460px] relative pointer-events-none"
      aria-hidden="true"
    />
  );
};
