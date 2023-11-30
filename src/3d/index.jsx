import { OrbitControls, useTexture, Float } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import Scene from "./components/scene";
import { useMemo } from "react";

const Three = (props) => {
  const { phaserRef, ...rest } = props;

  return (
    <div
      style={{
        width: "100vw",
        height: "100svh",
        position: "absolute",
        top: "0",
        left: "0",
        zIndex: "-1",
      }}
      id="threecanvas"
    >
      <Canvas
        onCreated={({ gl }) => {
          //   exposure
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.outputEncoding = THREE.sRGBEncoding;
          gl.toneMappingExposure = 1.5; // Set the exposure
        }}
      >
        <ambientLight />
        <Scene phaserRef={phaserRef} />
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default Three;
