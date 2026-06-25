import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { Center, Environment, OrbitControls, useGLTF } from '@react-three/drei';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js';
import * as THREE from 'three';
import { pianoSceneConfig } from '../data/pianoSceneConfig';

function mix(from, to, amount) {
  return from + (to - from) * THREE.MathUtils.clamp(amount, 0, 1);
}

function keyNameToFrequency(keyName) {
  const noteIndex = Number(keyName.replace('_', ''));
  const midiNote = noteIndex + pianoSceneConfig.audio.baseMidiOffset;
  return 440 * 2 ** ((midiNote - 69) / 12);
}

function findPlayableKey(object) {
  let current = object;

  while (current) {
    if (/^_\d+$/.test(current.name)) return current;
    current = current.parent;
  }

  return null;
}

function getPrefersLeanScene() {
  if (typeof window === 'undefined') return false;

  const isTouchOrSmallScreen = window.matchMedia('(max-width: 767px), (pointer: coarse)').matches;
  const hasLimitedMemory = Boolean(navigator.deviceMemory && navigator.deviceMemory <= 4);

  return isTouchOrSmallScreen || hasLimitedMemory;
}

function usePrefersLeanScene() {
  const [prefersLeanScene, setPrefersLeanScene] = useState(getPrefersLeanScene);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px), (pointer: coarse)');
    const update = () => setPrefersLeanScene(getPrefersLeanScene());

    update();

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', update);
      return () => mediaQuery.removeEventListener('change', update);
    }

    mediaQuery.addListener(update);
    return () => mediaQuery.removeListener(update);
  }, []);

  return prefersLeanScene;
}

function createWoodTexture(baseColor, grainColor, width = 1024) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = Math.max(128, Math.round(width / 4));
  const context = canvas.getContext('2d');
  const gradient = context.createLinearGradient(0, 0, canvas.width, 0);

  gradient.addColorStop(0, baseColor);
  gradient.addColorStop(0.45, grainColor);
  gradient.addColorStop(1, baseColor);
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  for (let index = 0; index < 120; index += 1) {
    const y = Math.random() * canvas.height;
    const width = 1 + Math.random() * 5;
    const alpha = 0.06 + Math.random() * 0.16;

    context.beginPath();
    context.strokeStyle = `rgba(42, 24, 12, ${alpha})`;
    context.lineWidth = width;
    context.moveTo(0, y);

    for (let x = 0; x <= canvas.width; x += 80) {
      context.lineTo(x, y + Math.sin(x * 0.015 + index) * 10 + Math.random() * 8);
    }

    context.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2.4, 1);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createSoftShadowTexture(size = 256) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');
  const gradient = context.createRadialGradient(
    size / 2,
    size / 2,
    size * 0.08,
    size / 2,
    size / 2,
    size * 0.5,
  );

  gradient.addColorStop(0, 'rgba(0, 0, 0, 0.62)');
  gradient.addColorStop(0.48, 'rgba(0, 0, 0, 0.26)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function WoodenPlank({ enableShadows, textureSize }) {
  const { position, scale, color, grainColor } = pianoSceneConfig.stage.plank;
  const woodTexture = useMemo(
    () => createWoodTexture(color, grainColor, textureSize),
    [color, grainColor, textureSize],
  );

  return (
    <mesh castShadow={enableShadows} receiveShadow={enableShadows} position={position}>
      <boxGeometry args={scale} />
      <meshStandardMaterial
        map={woodTexture}
        color="#7a4726"
        roughness={0.78}
        metalness={0.02}
      />
    </mesh>
  );
}

function SoftShadowBlob({
  position,
  scale,
  opacity,
  rotation = [-Math.PI / 2, 0, 0],
}) {
  const texture = useMemo(() => createSoftShadowTexture(), []);

  return (
    <mesh position={position} rotation={rotation} scale={scale} renderOrder={1}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={opacity}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

function LeanSceneShadows() {
  return (
    <>
      <SoftShadowBlob
        position={[0, 0.215, -4.35]}
        scale={[8.8, 3.15, 1]}
        opacity={0.42}
      />
      <SoftShadowBlob
        position={[-5.05, 0.215, -3.08]}
        scale={[1.65, 1.15, 1]}
        opacity={0.3}
      />
      <SoftShadowBlob
        position={[4.25, 0.215, -3.62]}
        scale={[2.05, 1.25, 1]}
        opacity={0.34}
      />
    </>
  );
}

function ImportedProp({ config, enableShadows }) {
  const gltf = useGLTF(config.url);
  const { scene, offset, fittedScale } = useMemo(() => {
    const clone = gltf.scene.clone(true);

    clone.traverse((object) => {
      if (!object.isMesh) return;
      object.castShadow = enableShadows;
      object.receiveShadow = enableShadows;

      if (object.material) {
        object.material = object.material.clone();
        object.material.envMapIntensity = 0.75;
      }
    });

    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const fitHeight = config.fitHeight ?? size.y;
    const normalizedScale = size.y > 0 ? (fitHeight / size.y) * config.scale : config.scale;

    return {
      scene: clone,
      offset: [-center.x, -box.min.y, -center.z],
      fittedScale: normalizedScale,
    };
  }, [config.fitHeight, config.scale, enableShadows, gltf.scene]);

  return (
    <group position={config.position} rotation={config.rotation} scale={fittedScale}>
      <primitive object={scene} position={offset} />
    </group>
  );
}

function LampLighting({ enableShadows, shadowMapSize }) {
  const lightRef = useRef();
  const targetRef = useRef();
  const lamp = pianoSceneConfig.stage.lamp;

  useEffect(() => {
    if (!lightRef.current || !targetRef.current) return;
    lightRef.current.target = targetRef.current;
  }, []);

  return (
    <>
      <object3D ref={targetRef} position={lamp.lightTarget} />
      <spotLight
        ref={lightRef}
        castShadow={enableShadows}
        position={lamp.lightPosition}
        color={lamp.lightColor}
        intensity={lamp.lightIntensity}
        angle={lamp.lightAngle}
        penumbra={0.82}
        distance={15}
        decay={1.9}
        shadow-bias={-0.0008}
        shadow-radius={6}
        shadow-mapSize={[shadowMapSize, shadowMapSize]}
      />
      <pointLight
        position={lamp.lightPosition}
        color={lamp.lightColor}
        intensity={lamp.glowIntensity}
        distance={5}
        decay={2}
      />
    </>
  );
}

function RealityPianoModel({ songNotesRef, enableShadows, onManualActivityChange }) {
  const collada = useLoader(ColladaLoader, pianoSceneConfig.modelUrl);
  const { invalidate } = useThree();
  const groupRef = useRef();
  const keyRefs = useRef([]);
  const keyByNameRef = useRef(new Map());
  const audioContextRef = useRef();
  const activePointerKeyRef = useRef();
  const pressedKeysRef = useRef(new Set());
  const activeColor = useMemo(
    () => new THREE.Color(pianoSceneConfig.animation.activeColor),
    [],
  );

  const modelScene = useMemo(() => {
    const scene = collada.scene.clone(true);
    const editableKeys = [];

    scene.traverse((object) => {
      object.castShadow = enableShadows;
      object.receiveShadow = enableShadows;

      if (/^_\d+$/.test(object.name)) {
        object.rotation.x = pianoSceneConfig.animation.keyIdleRotation;
        object.userData.lastAmount = 0;
        editableKeys.push(object);
      }

      if (object.isMesh && object.material) {
        const sourceMaterial = Array.isArray(object.material) ? object.material[0] : object.material;
        object.material = new THREE.MeshStandardMaterial({
          color: sourceMaterial.color ?? new THREE.Color('#f4efe6'),
          roughness: 0.42,
          metalness: 0.08,
        });
        object.userData.idleColor = object.material.color.clone();
      }
    });

    keyRefs.current = editableKeys;
    keyByNameRef.current = new Map(editableKeys.map((key) => [key.name, key]));
    return scene;
  }, [collada.scene, enableShadows]);

  const playNote = useCallback((keyName) => {
    if (!pianoSceneConfig.audio.enabled) return;

    const BrowserAudioContext = window.AudioContext || window.webkitAudioContext;
    if (!BrowserAudioContext) return;

    if (!audioContextRef.current) {
      audioContextRef.current = new BrowserAudioContext();
    }

    const context = audioContextRef.current;
    const now = context.currentTime;
    const frequency = keyNameToFrequency(keyName);
    const gain = context.createGain();
    const body = context.createOscillator();
    const shimmer = context.createOscillator();
    const filter = context.createBiquadFilter();

    body.type = 'triangle';
    body.frequency.setValueAtTime(frequency, now);
    shimmer.type = 'sine';
    shimmer.frequency.setValueAtTime(frequency * 2.01, now);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2600, now);
    filter.frequency.exponentialRampToValueAtTime(900, now + pianoSceneConfig.audio.releaseSeconds);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(pianoSceneConfig.audio.volume, now + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + pianoSceneConfig.audio.releaseSeconds);

    body.connect(filter);
    shimmer.connect(filter);
    filter.connect(gain);
    gain.connect(context.destination);

    body.start(now);
    shimmer.start(now);
    body.stop(now + pianoSceneConfig.audio.releaseSeconds + 0.04);
    shimmer.stop(now + pianoSceneConfig.audio.releaseSeconds + 0.04);
  }, []);

  const pressKey = useCallback(
    (keyName, shouldPlaySound = true) => {
      const key = keyByNameRef.current.get(keyName);
      if (!key) return;

      const wasIdle = pressedKeysRef.current.size === 0;
      key.userData.isPressed = true;

      if (shouldPlaySound && !pressedKeysRef.current.has(keyName)) {
        playNote(keyName);
      }

      pressedKeysRef.current.add(keyName);

      if (wasIdle && pressedKeysRef.current.size > 0) {
        onManualActivityChange?.(true);
      }

      invalidate();
    },
    [invalidate, onManualActivityChange, playNote],
  );

  const releaseKey = useCallback((keyName) => {
    const key = keyByNameRef.current.get(keyName);
    if (key) {
      key.userData.isPressed = false;
    }

    pressedKeysRef.current.delete(keyName);

    if (pressedKeysRef.current.size === 0) {
      onManualActivityChange?.(false);
    }

    invalidate();
  }, [invalidate, onManualActivityChange]);

  useEffect(() => {
    function handleKeyDown(event) {
      const keyName = pianoSceneConfig.keyboard?.[event.key.toLowerCase()];
      if (!keyName || event.repeat) return;
      pressKey(keyName);
    }

    function handleKeyUp(event) {
      const keyName = pianoSceneConfig.keyboard?.[event.key.toLowerCase()];
      if (!keyName) return;
      releaseKey(keyName);
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [pressKey, releaseKey]);

  useFrame(() => {
    const config = pianoSceneConfig.animation;

    keyRefs.current.forEach((key) => {
      const manualAmount = key.userData.isPressed ? 1 : 0;
      const songAmount = songNotesRef?.current.get(key.name) ?? 0;
      const amount = Math.max(manualAmount, songAmount);
      const previousAmount = key.userData.lastAmount ?? 0;

      if (Math.abs(amount - previousAmount) < 0.001) {
        return;
      }

      key.userData.lastAmount = amount;

      key.rotation.x = mix(
        config.keyIdleRotation,
        config.keyPressedRotation,
        amount * config.keyAttackSpeed * 0.14,
      );

      if (key.isMesh && key.material) {
        key.material.color.lerpColors(
          key.userData.idleColor,
          activeColor,
          amount * 0.85,
        );
      }
    });
  });

  return (
    <group
      ref={groupRef}
      position={pianoSceneConfig.model.position}
      rotation={pianoSceneConfig.model.rotation}
      onPointerDown={(event) => {
        event.stopPropagation();
        const key = findPlayableKey(event.object);
        if (!key) return;
        activePointerKeyRef.current = key.name;
        pressKey(key.name);
      }}
      onPointerUp={() => {
        if (!activePointerKeyRef.current) return;
        releaseKey(activePointerKeyRef.current);
        activePointerKeyRef.current = null;
      }}
      onPointerLeave={() => {
        if (!activePointerKeyRef.current) return;
        releaseKey(activePointerKeyRef.current);
        activePointerKeyRef.current = null;
      }}
    >
      <ResponsivePianoScale>
        <Center>
          <primitive object={modelScene} />
        </Center>
      </ResponsivePianoScale>
    </group>
  );
}

function ResponsivePianoScale({ children }) {
  const groupRef = useRef();
  const { invalidate, size } = useThree();

  useEffect(() => {
    if (!groupRef.current) return;

    const { desktopScale, tabletScale, mobileScale } = pianoSceneConfig.model;
    const scale =
      size.width < 640 ? mobileScale : size.width < 1024 ? tabletScale : desktopScale;
    groupRef.current.scale.setScalar(scale);
    invalidate();
  }, [invalidate, size.width]);

  return <group ref={groupRef}>{children}</group>;
}

function ResponsiveCamera() {
  const { camera, invalidate, size } = useThree();

  useEffect(() => {
    const config = pianoSceneConfig.camera;
    const isMobile = size.width < 640;
    const isTablet = size.width < 1024;
    const position =
      isMobile
        ? config.mobilePosition
        : isTablet
          ? config.tabletPosition
          : config.desktopPosition;
    const fov =
      isMobile
        ? (config.mobileFov ?? config.fov)
        : isTablet
          ? (config.tabletFov ?? config.fov)
          : (config.desktopFov ?? config.fov);

    camera.position.set(...position);
    camera.fov = fov;
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, invalidate, size.width]);

  return null;
}

function SceneActivityController({ isActive, targetFps }) {
  const { gl, invalidate } = useThree();

  useEffect(() => {
    let timeoutId = 0;
    let animationFrameId = 0;
    let isCanvasVisible = true;

    const isActuallyVisible = () => {
      const rect = gl.domElement.getBoundingClientRect();
      const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

      if (
        rect.bottom <= 0 ||
        rect.right <= 0 ||
        rect.top >= viewportHeight ||
        rect.left >= viewportWidth
      ) {
        return false;
      }

      const points = [
        [rect.left + rect.width * 0.5, rect.top + rect.height * 0.5],
        [rect.left + rect.width * 0.35, rect.top + rect.height * 0.35],
        [rect.left + rect.width * 0.65, rect.top + rect.height * 0.35],
      ];

      return points.some(([x, y]) => {
        const element = document.elementFromPoint(
          Math.min(Math.max(x, 0), viewportWidth - 1),
          Math.min(Math.max(y, 0), viewportHeight - 1),
        );

        return element === gl.domElement || gl.domElement.contains(element);
      });
    };

    const shouldRenderContinuously = () => (
      isActive &&
      isCanvasVisible &&
      document.visibilityState === 'visible'
    );

    const clearLoop = () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
        timeoutId = 0;
      }
    };

    const scheduleLoop = () => {
      clearLoop();

      if (!shouldRenderContinuously()) {
        return;
      }

      timeoutId = window.setTimeout(() => {
        timeoutId = 0;
        invalidate();
        scheduleLoop();
      }, Math.round(1000 / targetFps));
    };

    const refreshVisibility = () => {
      animationFrameId = 0;
      isCanvasVisible = isActuallyVisible();
      invalidate();
      scheduleLoop();
    };

    const requestVisibilityRefresh = () => {
      if (animationFrameId) return;
      animationFrameId = window.requestAnimationFrame(refreshVisibility);
    };

    const handleVisibilityChange = () => {
      refreshVisibility();
    };

    refreshVisibility();
    window.addEventListener('scroll', requestVisibilityRefresh, { passive: true });
    window.addEventListener('resize', requestVisibilityRefresh);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearLoop();

      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }

      window.removeEventListener('scroll', requestVisibilityRefresh);
      window.removeEventListener('resize', requestVisibilityRefresh);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [gl.domElement, invalidate, isActive, targetFps]);

  return null;
}

function RendererQuality({ enableShadows }) {
  const { gl, invalidate } = useThree();

  useEffect(() => {
    gl.shadowMap.enabled = enableShadows;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
    invalidate();
  }, [enableShadows, gl, invalidate]);

  return null;
}

export default function RealityPianoScene({ songNotesRef, isSongPlaying = false, onSceneReady }) {
  const sceneTransform = pianoSceneConfig.scene ?? {};
  const { atmosphere } = pianoSceneConfig;
  const prefersLeanScene = usePrefersLeanScene();
  const [hasManualKeyActivity, setHasManualKeyActivity] = useState(false);
  const hasLimitedMemory = Boolean(
    typeof navigator !== 'undefined' && navigator.deviceMemory && navigator.deviceMemory <= 4,
  );
  const enableShadows = !prefersLeanScene;
  const targetFps = prefersLeanScene ? 24 : 30;
  const shadowMapSize = prefersLeanScene ? 512 : 1024;
  const leanDpr = hasLimitedMemory ? [1, 1.05] : [1, 1.16];

  return (
    <Canvas
      camera={{
        position: pianoSceneConfig.camera.desktopPosition,
        fov: pianoSceneConfig.camera.desktopFov ?? pianoSceneConfig.camera.fov,
      }}
      dpr={prefersLeanScene ? leanDpr : [1, 1.25]}
      frameloop="demand"
      shadows={enableShadows}
      gl={{
        antialias: !prefersLeanScene,
        outputColorSpace: THREE.SRGBColorSpace,
        powerPreference: prefersLeanScene ? 'low-power' : 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: atmosphere.exposure,
      }}
      onCreated={({ gl }) => {
        gl.shadowMap.enabled = enableShadows;
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
        window.requestAnimationFrame(() => {
          onSceneReady?.();
        });
      }}
    >
      <RendererQuality enableShadows={enableShadows} />
      <SceneActivityController
        isActive={isSongPlaying || hasManualKeyActivity}
        targetFps={targetFps}
      />
      <ResponsiveCamera />
      <color attach="background" args={[atmosphere.background]} />
      <fog attach="fog" args={[atmosphere.fogColor, atmosphere.fogNear, atmosphere.fogFar]} />
      <ambientLight color={atmosphere.ambientColor} intensity={atmosphere.ambientIntensity} />
      {prefersLeanScene ? (
        <hemisphereLight
          color="#f1e6b7"
          groundColor="#160d09"
          intensity={0.28}
        />
      ) : null}
      <directionalLight
        castShadow={enableShadows}
        position={atmosphere.moonPosition}
        color={atmosphere.moonColor}
        intensity={atmosphere.moonIntensity}
        shadow-mapSize={[shadowMapSize, shadowMapSize]}
      />
      <group
        position={sceneTransform.position ?? [0, 0, 0]}
        rotation={sceneTransform.rotation ?? [0, 0, 0]}
        scale={sceneTransform.scale ?? 1}
      >
        <LampLighting enableShadows={enableShadows} shadowMapSize={shadowMapSize} />
        <WoodenPlank enableShadows={enableShadows} textureSize={prefersLeanScene ? 512 : 1024} />
        {prefersLeanScene ? <LeanSceneShadows /> : null}
        <RealityPianoModel
          songNotesRef={songNotesRef}
          enableShadows={enableShadows}
          onManualActivityChange={setHasManualKeyActivity}
        />
        <ImportedProp config={pianoSceneConfig.stage.plant} enableShadows={enableShadows} />
        <ImportedProp config={pianoSceneConfig.stage.sheetMusic} enableShadows={enableShadows} />
        <ImportedProp config={pianoSceneConfig.stage.lamp} enableShadows={enableShadows} />
      </group>
      {!prefersLeanScene ? <Environment preset="night" /> : null}
      {/* <OrbitControls
        target={pianoSceneConfig.controls.target}
        enablePan={pianoSceneConfig.controls.enablePan}
        enableZoom={pianoSceneConfig.controls.enableZoom}
        minDistance={8}
        maxDistance={18}
        minPolarAngle={0.8}
        maxPolarAngle={1.7}
      /> */}
    </Canvas>
  );
}
