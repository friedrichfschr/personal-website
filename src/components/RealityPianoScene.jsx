import { useCallback, useEffect, useMemo, useRef } from 'react';
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

function createWoodTexture(baseColor, grainColor) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;
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

function WoodenPlank() {
  const { position, scale, color, grainColor } = pianoSceneConfig.stage.plank;
  const woodTexture = useMemo(() => createWoodTexture(color, grainColor), [color, grainColor]);

  return (
    <mesh castShadow receiveShadow position={position}>
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

function ImportedProp({ config }) {
  const gltf = useGLTF(config.url);
  const { scene, offset, fittedScale } = useMemo(() => {
    const clone = gltf.scene.clone(true);

    clone.traverse((object) => {
      if (!object.isMesh) return;
      object.castShadow = true;
      object.receiveShadow = true;

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
  }, [config.fitHeight, config.scale, gltf.scene]);

  return (
    <group position={config.position} rotation={config.rotation} scale={fittedScale}>
      <primitive object={scene} position={offset} />
    </group>
  );
}

function LampLighting() {
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
        castShadow
        position={lamp.lightPosition}
        color={lamp.lightColor}
        intensity={lamp.lightIntensity}
        angle={lamp.lightAngle}
        penumbra={0.82}
        distance={15}
        decay={1.9}
        shadow-bias={-0.0008}
        shadow-radius={6}
        shadow-mapSize={[2048, 2048]}
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

function RealityPianoModel({ songNotesRef }) {
  const collada = useLoader(ColladaLoader, pianoSceneConfig.modelUrl);
  const groupRef = useRef();
  const keyRefs = useRef([]);
  const audioContextRef = useRef();
  const activePointerKeyRef = useRef();
  const pressedKeysRef = useRef(new Set());

  const modelScene = useMemo(() => {
    const scene = collada.scene.clone(true);
    const editableKeys = [];

    scene.traverse((object) => {
      object.castShadow = true;
      object.receiveShadow = true;

      if (/^_\d+$/.test(object.name)) {
        object.rotation.x = pianoSceneConfig.animation.keyIdleRotation;
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
    return scene;
  }, [collada.scene]);

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
      const key = keyRefs.current.find((item) => item.name === keyName);
      if (!key) return;

      key.userData.isPressed = true;

      if (shouldPlaySound && !pressedKeysRef.current.has(keyName)) {
        playNote(keyName);
      }

      pressedKeysRef.current.add(keyName);
    },
    [playNote],
  );

  const releaseKey = useCallback((keyName) => {
    const key = keyRefs.current.find((item) => item.name === keyName);
    if (key) {
      key.userData.isPressed = false;
    }

    pressedKeysRef.current.delete(keyName);
  }, []);

  useEffect(() => {
    function handleKeyDown(event) {
      const keyName = pianoSceneConfig.keyboard[event.key.toLowerCase()];
      if (!keyName || event.repeat) return;
      pressKey(keyName);
    }

    function handleKeyUp(event) {
      const keyName = pianoSceneConfig.keyboard[event.key.toLowerCase()];
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

      key.rotation.x = mix(
        config.keyIdleRotation,
        config.keyPressedRotation,
        amount * config.keyAttackSpeed * 0.14,
      );

      if (key.isMesh && key.material) {
        key.material.color.lerpColors(
          key.userData.idleColor,
          new THREE.Color(config.activeColor),
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
  const { size } = useThree();

  useEffect(() => {
    if (!groupRef.current) return;

    const { desktopScale, tabletScale, mobileScale } = pianoSceneConfig.model;
    let scale =
      size.width < 640 ? mobileScale : size.width < 1024 ? tabletScale : desktopScale;
    scale = desktopScale
    groupRef.current.scale.setScalar(scale);
  }, [size.width]);

  return <group ref={groupRef}>{children}</group>;
}

function ResponsiveCamera() {
  const { camera, size } = useThree();

  useEffect(() => {
    const config = pianoSceneConfig.camera;
    const position =
      size.width < 640
        ? config.mobilePosition
        : size.width < 1024
          ? config.tabletPosition
          : config.desktopPosition;

    camera.position.set(...position);
    camera.fov = config.fov;
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera, size.width]);

  return null;
}

export default function RealityPianoScene({ songNotesRef, onSceneReady }) {
  const { atmosphere } = pianoSceneConfig;

  return (
    <Canvas
      camera={{ position: pianoSceneConfig.camera.desktopPosition, fov: pianoSceneConfig.camera.fov }}
      dpr={[1, 1.75]}
      shadows
      gl={{
        antialias: true,
        outputColorSpace: THREE.SRGBColorSpace,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: atmosphere.exposure,
      }}
      onCreated={({ gl }) => {
        gl.shadowMap.enabled = true;
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
        window.requestAnimationFrame(() => {
          onSceneReady?.();
        });
      }}
    >
      <ResponsiveCamera />
      <color attach="background" args={[atmosphere.background]} />
      <fog attach="fog" args={[atmosphere.fogColor, atmosphere.fogNear, atmosphere.fogFar]} />
      <ambientLight color={atmosphere.ambientColor} intensity={atmosphere.ambientIntensity} />
      <directionalLight
        castShadow
        position={atmosphere.moonPosition}
        color={atmosphere.moonColor}
        intensity={atmosphere.moonIntensity}
        shadow-mapSize={[2048, 2048]}
      />
      <LampLighting />
      <WoodenPlank />
      <RealityPianoModel songNotesRef={songNotesRef} />
      <ImportedProp config={pianoSceneConfig.stage.plant} />
      <ImportedProp config={pianoSceneConfig.stage.sheetMusic} />
      <ImportedProp config={pianoSceneConfig.stage.lamp} />
      <Environment preset="night" />
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
