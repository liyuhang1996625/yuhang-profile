
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Theme } from '../types';

interface HeroBackgroundProps {
  theme: Theme;
}

const HeroBackground: React.FC<HeroBackgroundProps> = ({ theme }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!mountRef.current) return;

    // Setup
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    
    camera.position.z = 80;
    camera.position.y = 25;
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Particles Configuration
    const particlesGeometry = new THREE.BufferGeometry();
    const count = 1600; // 40x40 grid
    
    const positions = new Float32Array(count * 3);
    const originalPositions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    let i = 0;
    const spacing = 4.5;
    const offset = (Math.sqrt(count) * spacing) / 2;

    // Colors
    // Dark Mode: Base = Dark Green/Gray, Hover = Neon Green
    // Light Mode: Base = Light Gray, Hover = Dark Gray
    const baseColor = new THREE.Color(theme === 'dark' ? '#112211' : '#E0E0E0'); 
    const hoverColor = new THREE.Color(theme === 'dark' ? '#00FF41' : '#555555');

    for (let x = 0; x < Math.sqrt(count); x++) {
      for (let z = 0; z < Math.sqrt(count); z++) {
        const px = x * spacing - offset;
        const pz = z * spacing - offset;
        const py = 0;

        positions[i] = px;
        positions[i + 1] = py;
        positions[i + 2] = pz;
        
        originalPositions[i] = px;
        originalPositions[i + 1] = py;
        originalPositions[i + 2] = pz;

        // Initialize with base color
        colors[i] = baseColor.r;
        colors[i + 1] = baseColor.g;
        colors[i + 2] = baseColor.b;

        i += 3;
      }
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.7,
      vertexColors: true, // IMPORTANT: Enable individual particle colors
      transparent: true,
      opacity: theme === 'dark' ? 0.8 : 0.6,
      sizeAttenuation: true,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    
    // Initial Position Adjustment
    const updateMeshPosition = (w: number) => {
        if (w >= 768) {
             // Desktop: Shift to right
             particlesMesh.position.x = 25;
        } else {
             // Mobile: Center
             particlesMesh.position.x = 0;
        }
    };
    
    updateMeshPosition(width);
    scene.add(particlesMesh);

    // Mouse Interaction
    const handleMouseMove = (event: MouseEvent) => {
      const rect = mountRef.current!.getBoundingClientRect();
      // Normalize mouse (-1 to 1)
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      mouseRef.current = { x, y };
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize
    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      updateMeshPosition(w);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let time = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      time += delta;

      const posAttribute = particlesGeometry.attributes.position;
      const colAttribute = particlesGeometry.attributes.color;
      
      const posArray = posAttribute.array as Float32Array;
      const colArray = colAttribute.array as Float32Array;
      
      // Calculate mouse position in 3D space relative to the mesh
      const meshOffset = particlesMesh.position.x;
      // Scale mouse input to match scene scale roughly
      const mouseX = (mouseRef.current.x * 60) - meshOffset; 
      const mouseY = mouseRef.current.y * 60; // Inverted Z in 3D

      const tempColor = new THREE.Color();

      for (let j = 0; j < count; j++) {
        const idx = j * 3;
        const ox = originalPositions[idx];
        const oz = originalPositions[idx + 2];
        
        // Distance from mouse projection
        const dist = Math.sqrt(Math.pow(ox - mouseX, 2) + Math.pow(oz + mouseY, 2)); // simple planar distance
        
        // 1. Slow Wave Animation (Reduced time multiplier)
        const waveY = Math.sin(time * 0.8 + ox * 0.08 + oz * 0.08) * 2;
        
        // 2. Mouse Interaction
        const interactionRadius = 25;
        let mouseEffect = 0;
        let colorIntensity = 0;
        
        if (dist < interactionRadius) {
            const force = (1 - dist / interactionRadius);
            // Non-linear easing for smoother feel
            const smoothForce = Math.pow(force, 2); 
            
            mouseEffect = smoothForce * 12; // Height lift
            colorIntensity = smoothForce; // Color brightness
        }

        // Apply Position (Smooth Lerp)
        const targetY = waveY + mouseEffect;
        posArray[idx + 1] += (targetY - posArray[idx + 1]) * 0.05;
        
        // Apply Color (Lerp)
        tempColor.copy(baseColor).lerp(hoverColor, colorIntensity);
        
        colArray[idx] = tempColor.r;
        colArray[idx+1] = tempColor.g;
        colArray[idx+2] = tempColor.b;
      }

      posAttribute.needsUpdate = true;
      colAttribute.needsUpdate = true;
      
      // Slow Rotation
      particlesMesh.rotation.y = time * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
    };
  }, [theme]);

  return (
    <div 
      ref={mountRef} 
      className="absolute inset-0 z-0 pointer-events-none opacity-80"
    />
  );
};

export default HeroBackground;
