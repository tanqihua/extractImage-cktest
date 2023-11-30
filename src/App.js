import React, { useEffect, useMemo, useState } from "react";
import PhaserApp from "./2d";
import THREESCENE from "./3d";
import { useStore } from "./store/index.js";
import "./index.css";
import { WebcamComponent } from "./overlay";
function App() {
  const phaserRef = React.useRef(null);

  return (
    <div>
      <PhaserApp ref={phaserRef} />

      <div>
        <WebcamComponent />
      </div>
    </div>
  );
}

export default App;
