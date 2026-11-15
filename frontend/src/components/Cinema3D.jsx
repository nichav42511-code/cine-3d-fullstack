import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default function Cinema3D({ peliculaActiva }) {
  const mountRef = useRef(null);
  const [lucesEncendidas, setLucesEncendidas] = useState(false);
  const peliculaRef = useRef(peliculaActiva);
  const lucesRef = useRef(lucesEncendidas);

  useEffect(() => { peliculaRef.current = peliculaActiva; }, [peliculaActiva]);
  useEffect(() => { lucesRef.current = lucesEncendidas; }, [lucesEncendidas]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x07070c);
    scene.fog = new THREE.FogExp2(0x07070c, 0.025);

    const camera = new THREE.PerspectiveCamera(55, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 6.5, 13);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.maxPolarAngle = Math.PI / 2 - 0.05;
    controls.minDistance = 4;
    controls.maxDistance = 20;

    const videoCanvas = document.createElement('canvas');
    videoCanvas.width = 512;
    videoCanvas.height = 256;
    const ctx = videoCanvas.getContext('2d');

    const screenTexture = new THREE.CanvasTexture(videoCanvas);
    const screenMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(14, 6.5),
      new THREE.MeshBasicMaterial({ map: screenTexture })
    );
    screenMesh.position.set(0, 4.5, -11.8);
    scene.add(screenMesh);

    const frameMesh = new THREE.Mesh(
      new THREE.BoxGeometry(14.6, 7.1, 0.3),
      new THREE.MeshStandardMaterial({ color: 0x111116, roughness: 0.7 })
    );
    frameMesh.position.set(0, 4.5, -12);
    scene.add(frameMesh);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(24, 28),
      new THREE.MeshStandardMaterial({ color: 0x181820, roughness: 0.85 })
    );
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    const seatGroup = new THREE.Group();
    const fabricMat = new THREE.MeshStandardMaterial({ color: 0x8b1122, roughness: 0.6 });
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.5 });

    for (let row = 0; row < 5; row++) {
      const yOffset = row * 0.45;
      const zPos = -4 + row * 2.6;

      const step = new THREE.Mesh(
        new THREE.BoxGeometry(18, yOffset + 0.2, 2.5),
        new THREE.MeshStandardMaterial({ color: 0x121218 })
      );
      step.position.set(0, (yOffset + 0.2) / 2, zPos);
      seatGroup.add(step);

      for (let col = -4; col <= 4; col++) {
        if (col === 0) continue;
        const chair = new THREE.Group();

        const base = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.2, 0.9), fabricMat);
        base.position.y = 0.5;
        chair.add(base);

        const back = new THREE.Mesh(new THREE.BoxGeometry(0.95, 1.15, 0.2), fabricMat);
        back.position.set(0, 1.05, 0.38);
        back.rotation.x = -0.12;
        chair.add(back);

        const armL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.35, 0.95), frameMat);
        armL.position.set(-0.5, 0.72, 0);
        const armR = armL.clone();
        armR.position.x = 0.5;
        chair.add(armL, armR);

        chair.position.set(col * 1.45, yOffset + 0.2, zPos);
        seatGroup.add(chair);
      }
    }
    scene.add(seatGroup);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
    scene.add(ambientLight);

    const roomLight = new THREE.PointLight(0xffeedd, 0, 35);
    roomLight.position.set(0, 10, 2);
    scene.add(roomLight);

    const screenGlow = new THREE.PointLight(0x3b82f6, 2.5, 22);
    screenGlow.position.set(0, 4.5, -10);
    scene.add(screenGlow);

    let animationFrameId;
    let time = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      time += 0.03;

      ambientLight.intensity = lucesRef.current ? 1.1 : 0.22;
      roomLight.intensity = lucesRef.current ? 1.8 : 0;

      const peli = peliculaRef.current;
      const colorHex = peli?.color || '#2563eb';
      screenGlow.color.set(colorHex);

      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, 512, 256);

      for (let i = 0; i < 5; i++) {
        ctx.strokeStyle = colorHex;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(256 + Math.sin(time + i) * 50, 128 + Math.cos(time * 0.8 + i) * 25, 20 + i * 15, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(peli?.titulo?.toUpperCase() || 'CINE', 256, 125);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px sans-serif';
      ctx.fillText(peli?.genero || '', 256, 155);

      screenTexture.needsUpdate = true;
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <section id="sala-3d" className="relative w-full bg-slate-950 border-b border-slate-800">
      <div ref={mountRef} className="w-full h-[500px] md:h-[580px] cursor-grab active:cursor-grabbing" />
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4 bg-slate-900/90">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-400">Proyectando ahora</p>
          <h2 className="text-lg font-bold text-white">{peliculaActiva.titulo}</h2>
        </div>
        <button
          onClick={() => setLucesEncendidas(!lucesEncendidas)}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
            lucesEncendidas ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-white border border-slate-700'
          }`}
        >
          {lucesEncendidas ? 'Apagar Luces' : 'Encender Luces'}
        </button>
      </div>
    </section>
  );
}