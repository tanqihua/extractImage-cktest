import Phaser from "phaser";
import { Bootstrap } from "./bootstrap.js";
import React, { useEffect, useMemo } from "react";
const config = {
  type: Phaser.AUTO,
  parent: "phaser-container",
  backgroundColor: "transparent",
  transparent: true,
  width: window.innerWidth * window.devicePixelRatio,
  height: window.innerHeight * window.devicePixelRatio,
  scale: {
    mode: Phaser.Scale.ScaleModes.FIT,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: true,
    },
  },

  scene: [Bootstrap],
};

const IoPhaser = React.forwardRef((props, ref) => {
  useEffect(() => {
    const phaserGame = new Phaser.Game(config);
    ref.current = phaserGame;
    return () => phaserGame.destroy(true);
  }, []);

  return (
    <div
      id="phaser-container"
      style={{
        position: "absolute",
        top: "0",
        left: "50%",
        zIndex: "-10",
        width: "100vw",
        height: "100svh",
        overflow: "hidden",
        pointerEvents: "null",
        transform: "translateX(-50%)",
      }}
    ></div>
  );
});

export default IoPhaser;
