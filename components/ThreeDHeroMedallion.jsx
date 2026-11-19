"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function ThreeDHeroMedallion() {
  const containerRef = useRef(null);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    // 1. Scene
    const scene = new THREE.Scene();

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 7.5;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xfff3db, 1.4);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffe8a3, 3.5);
    dirLight1.position.set(5, 6, 4);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xd4a046, 2.0);
    dirLight2.position.set(-5, -4, -2);
    scene.add(dirLight2);

    const cursorPointLight = new THREE.PointLight(0xffd573, 4, 15);
    cursorPointLight.position.set(0, 0, 5);
    scene.add(cursorPointLight);

    // 5. Medallion / Coin Mesh
    const textureLoader = new THREE.TextureLoader();
    const logoTexture = textureLoader.load("/logo.jpg");
    logoTexture.colorSpace = THREE.SRGBColorSpace;

    // Materials: Gold rim + Logo face
    const goldRimMaterial = new THREE.MeshStandardMaterial({
      color: 0xc99b3b,
      metalness: 0.92,
      roughness: 0.22,
    });

    const logoFaceMaterial = new THREE.MeshStandardMaterial({
      map: logoTexture,
      metalness: 0.65,
      roughness: 0.35,
    });

    // Cylinder materials array: [side, top, bottom]
    const materials = [goldRimMaterial, logoFaceMaterial, logoFaceMaterial];

    // Cylinder: radiusTop, radiusBottom, height, radialSegments
    const coinGeometry = new THREE.CylinderGeometry(2.5, 2.5, 0.22, 64);
    // Rotate so faces point towards camera
    coinGeometry.rotateX(Math.PI / 2);

    const coin = new THREE.Mesh(coinGeometry, materials);
    scene.add(coin);

    // Add an outer ornate gold ring around the coin
    const ringGeometry = new THREE.TorusGeometry(2.65, 0.08, 16, 64);
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: 0xe5ba55,
      metalness: 0.95,
      roughness: 0.15,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    scene.add(ring);

    // 6. 3D Floating Gold Dust / Particles
    const particleCount = 140;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 10;
      positions[i + 1] = (Math.random() - 0.5) * 10;
      positions[i + 2] = (Math.random() - 0.5) * 6;
      scales[i / 3] = Math.random() * 0.08 + 0.02;
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xe8ba4c,
      size: 0.08,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // 7. Interaction & Motion Handling
    let targetRotationX = 0;
    let targetRotationY = 0;
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let velocityX = 0;
    let velocityY = 0;

    const handlePointerDown = (e) => {
      isDragging = true;
      setIsInteracting(true);
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
      velocityX = 0;
      velocityY = 0;
    };

    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      cursorPointLight.position.x = mouseX * 4;
      cursorPointLight.position.y = mouseY * 4;

      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;

        velocityX = deltaX * 0.01;
        velocityY = deltaY * 0.01;

        targetRotationY += velocityX;
        targetRotationX += velocityY;
      } else {
        // Subtle tilt parallax
        targetRotationY = mouseX * 0.45;
        targetRotationX = -mouseY * 0.45;
      }
    };

    const handlePointerUp = () => {
      isDragging = false;
      setTimeout(() => setIsInteracting(false), 800);
    };

    window.addEventListener("pointerup", handlePointerUp);
    container.addEventListener("pointerdown", handlePointerDown);
    container.addEventListener("pointermove", handlePointerMove);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 400;
      const h = container.clientHeight || 400;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // 8. Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Idle continuous rotation & floating wobble
      if (!isDragging) {
        coin.rotation.y += (targetRotationY - coin.rotation.y) * 0.05 + 0.005;
        coin.rotation.x += (targetRotationX - coin.rotation.x) * 0.05;
        coin.position.y = Math.sin(elapsedTime * 1.5) * 0.12;

        ring.rotation.copy(coin.rotation);
        ring.position.copy(coin.position);
      } else {
        coin.rotation.y += velocityX;
        coin.rotation.x += velocityY;
        ring.rotation.copy(coin.rotation);
        velocityX *= 0.95;
        velocityY *= 0.95;
      }

      // Rotate 3D dust
      particles.rotation.y = elapsedTime * 0.04;
      particles.rotation.x = Math.sin(elapsedTime * 0.03) * 0.1;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointerup", handlePointerUp);
      if (container) {
        container.removeEventListener("pointerdown", handlePointerDown);
        container.removeEventListener("pointermove", handlePointerMove);
        if (renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      }
      renderer.dispose();
      coinGeometry.dispose();
      ringGeometry.dispose();
      particleGeometry.dispose();
      goldRimMaterial.dispose();
      logoFaceMaterial.dispose();
      ringMaterial.dispose();
      particleMaterial.dispose();
    };
  }, []);

  return (
    <div className="relative w-full aspect-square max-w-[440px] mx-auto flex items-center justify-center">
      {/* 3D WebGL Canvas Container */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing select-none"
        title="Click & Drag to rotate 3D Royal Medallion"
      />

      {/* 3D Interaction Hint Badge */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 pointer-events-none bg-black/80 backdrop-blur-md px-3.5 py-1 rounded-full border border-[#cba158]/40 text-[10px] uppercase tracking-wider text-[#e4c489] flex items-center gap-1.5 shadow-xl">
        <span className="w-1.5 h-1.5 rounded-full bg-[#cba158] animate-ping" />
        <span>3D Interactive &bull; Drag to Spin</span>
      </div>
    </div>
  );
}
