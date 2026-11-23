import React, { useEffect, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useUniverse } from './store/useUniverse';
import { MEMORIES } from './content/memories';
import { PLANETS } from './content/planets';
import { FINALE_CONTENT } from './content/finale';
import { isWebGLAvailable, getDeviceDpr } from './utils/device';
import { audioManager } from './utils/audioManager';

// 3D Scene Components
import { Galaxy } from './scene/Galaxy';
import { Starfield } from './scene/Starfield';
import { Nebula } from './scene/Nebula';
import { MemoryStar } from './scene/MemoryStar';
import { BirthdayStar } from './scene/BirthdayStar';
import { Constellation } from './scene/Constellation';
import { Planet } from './scene/Planet';
import { OrbitPaths } from './scene/OrbitPaths';
import { ShootingStar } from './scene/ShootingStar';
import { HiddenStar } from './scene/HiddenStar';
import { CameraRig } from './scene/CameraRig';
import { Effects } from './scene/Effects';

// Planet Mini-Interactions
import { FirstMeeting } from './planets/FirstMeeting';
import { FavoritePlace } from './planets/FavoritePlace';
import { PlaylistPlanet } from './planets/PlaylistPlanet';

// UI Overlays
import { PasswordGate } from './ui/PasswordGate';
import { Intro } from './ui/Intro';
import { Progress } from './ui/Progress';
import { MemoryCard } from './ui/MemoryCard';
import { BirthdayModal } from './ui/BirthdayModal';
import { HiddenStarModal } from './ui/HiddenStarModal';
import { WishPrompt } from './ui/WishPrompt';
import { Finale } from './ui/Finale';

export const App: React.FC = () => {
  const [hasWebGL, setHasWebGL] = useState(true);
  const stage = useUniverse((s) => s.stage);
  const audioOn = useUniverse((s) => s.audioOn);
  const setAudioOn = useUniverse((s) => s.setAudioOn);
  const focusedTarget = useUniverse((s) => s.focusedTarget);
  const setFocusedTarget = useUniverse((s) => s.setFocusedTarget);
  const setCameraFocusPos = useUniverse((s) => s.setCameraFocusPos);
  const isWishPromptOpen = useUniverse((s) => s.isWishPromptOpen);
  const setLowQuality = useUniverse((s) => s.setLowQuality);

  // Check WebGL availability
  useEffect(() => {
    setHasWebGL(isWebGLAvailable());
  }, []);

  // Performance FPS monitoring
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let lowFpsCount = 0;

    const checkFps = () => {
      const now = performance.now();
      frameCount++;

      if (now - lastTime >= 1000) {
        const fps = (frameCount * 1000) / (now - lastTime);
        if (fps < 30) {
          lowFpsCount++;
          if (lowFpsCount >= 3) {
            setLowQuality(true);
          }
        } else {
          lowFpsCount = 0;
        }
        frameCount = 0;
        lastTime = now;
      }
      requestAnimationFrame(checkFps);
    };

    const animId = requestAnimationFrame(checkFps);
    return () => cancelAnimationFrame(animId);
  }, [setLowQuality]);

  const handleCloseModal = () => {
    setFocusedTarget(null);
    setCameraFocusPos(null);
  };

  // WebGL Fallback Screen
  if (!hasWebGL) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at center, #0d0b2e 0%, #070817 100%)',
        color: '#fff',
        padding: '32px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '42px', marginBottom: '16px' }}>✨</div>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '32px', color: '#fff4e0', marginBottom: '12px' }}>
          {FINALE_CONTENT.title}
        </h1>
        <div style={{ maxWidth: '500px', textAlign: 'left', background: 'rgba(255,255,255,0.05)', padding: '24px', borderRadius: '18px' }}>
          {FINALE_CONTENT.paragraphs.map((p, i) => (
            <p key={i} style={{ marginBottom: '16px', lineHeight: 1.6, color: '#f1f5f9' }}>{p}</p>
          ))}
          <div style={{ fontFamily: 'Caveat, cursive', fontSize: '24px', color: '#ffd48a', textAlign: 'right' }}>
            {FINALE_CONTENT.signOff}
          </div>
        </div>
      </div>
    );
  }

  const activeMemory = focusedTarget?.type === 'memory'
    ? MEMORIES.find((m) => m.id === focusedTarget.id)
    : null;

  const activePlanet = focusedTarget?.type === 'planet'
    ? PLANETS.find((p) => p.id === focusedTarget.id)
    : null;

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', background: '#060719' }}>
      {/* 3D WebGL Canvas */}
      <Canvas
        camera={{ position: [0, 16, 32], fov: 60, near: 0.1, far: 1000 }}
        dpr={getDeviceDpr()}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true
        }}
        style={{ width: '100%', height: '100%', background: '#060719' }}
      >
        <Suspense fallback={null}>
          {/* Cinematic 3D Scene Lighting */}
          <ambientLight intensity={0.9} color="#e2e8f0" />
          <directionalLight position={[15, 25, 18]} intensity={1.4} color="#ffe5ec" />
          <directionalLight position={[-18, -12, -14]} intensity={0.9} color="#818cf8" />
          <pointLight position={[0, 1, 0]} intensity={1.1} color="#ffd48a" distance={60} decay={2} />
          
          <CameraRig />
          <Nebula />
          <Starfield />
          <Galaxy />

          {/* Interactive elements active only during explore and finale stages */}
          {(stage === 'explore' || stage === 'finale') && (
            <>
              <Constellation />
              <OrbitPaths />

              {/* Interactive Memory Stars */}
              {MEMORIES.map((m) => (
                <MemoryStar key={m.id} memory={m} />
              ))}

              {/* Special Birthday Star (17 Nov) */}
              <BirthdayStar />

              {/* Orbiting Worlds / Planets */}
              {PLANETS.map((p) => (
                <Planet key={p.id} planet={p} />
              ))}

              {/* Secret Easter Egg Hidden Star */}
              <HiddenStar />

              {/* Shooting Stars */}
              <ShootingStar />
            </>
          )}

          {/* Post Processing Effects */}
          <Effects />
        </Suspense>
      </Canvas>

      {/* Stage: Password Gate */}
      {stage === 'gate' && <PasswordGate />}

      {/* Stage: Intro */}
      {stage === 'intro' && <Intro />}

      {/* Stage: Explore UI Controls & Progress Ring */}
      {stage === 'explore' && <Progress />}

      {/* Make a Wish Dialog */}
      {isWishPromptOpen && <WishPrompt />}

      {/* Stage: Finale Message */}
      {stage === 'finale' && <Finale />}

      {/* Active 3D Inspection Overlay (Card sits elegantly beside the rotating 3D world) */}
      {focusedTarget && (
        <div
          onClick={handleCloseModal}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 70,
            display: 'flex',
            alignItems: 'center',
            justifyContent: window.innerWidth > 768 ? 'flex-end' : 'center',
            background: 'rgba(5, 4, 15, 0.45)',
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)',
            padding: window.innerWidth > 768 ? '32px 48px' : '16px'
          }}
        >
          <div onClick={(e) => e.stopPropagation()}>
            {activeMemory && (
              <MemoryCard memory={activeMemory} onClose={handleCloseModal} />
            )}

            {activePlanet && activePlanet.component === 'FirstMeeting' && (
              <FirstMeeting planet={activePlanet} onClose={handleCloseModal} />
            )}

            {activePlanet && activePlanet.component === 'FavoritePlace' && (
              <FavoritePlace planet={activePlanet} onClose={handleCloseModal} />
            )}

            {activePlanet && activePlanet.component === 'Playlist' && (
              <PlaylistPlanet planet={activePlanet} onClose={handleCloseModal} />
            )}

            {focusedTarget.type === 'birthday' && (
              <BirthdayModal onClose={handleCloseModal} />
            )}

            {focusedTarget.type === 'hidden' && (
              <HiddenStarModal onClose={handleCloseModal} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
