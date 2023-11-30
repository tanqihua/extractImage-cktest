import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { SuperFanProvider } from "./context";
import { BrowserRouter } from "react-router-dom";
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile,
} from "react-device-detect";
const root = ReactDOM.createRoot(document.getElementById("root"));

// const _firebaseConfig = {
//   apiKey: "AIzaSyCvOLqEkE3S0K6NKMW6vIO5MjVdxJ4k0Zw",
//   authDomain: "superfan-3a794.firebaseapp.com",
//   projectId: "superfan-3a794",
//   storageBucket: "superfan-3a794.appspot.com",
//   messagingSenderId: "18328979437",
//   appId: "1:18328979437:web:b6fb5190d1b2ba9445c9e4",
//   measurementId: "G-9MNC1K6CRJ",
// };

const _firebaseConfig = {
  apiKey: "AIzaSyAhTSZaLywAb9kRLEAav68fjCcYlOku0_k",
  authDomain: "testerdemo-888a3.firebaseapp.com",
  databaseURL:
    "https://testerdemo-888a3-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "testerdemo-888a3",
  storageBucket: "testerdemo-888a3.appspot.com",
  messagingSenderId: "427838279275",
  appId: "1:427838279275:web:3ea334b515efc29f82ab2e",
  measurementId: "G-X007KTPZ6X",
};

let _collection = "cktest-sg";
let _superfan = "cktest-sg-superfan";

root.render(
  <SuperFanProvider
    value={{
      firebaseConfig: _firebaseConfig,
      collection: _collection,
      superfan: _superfan,
    }}
  >
    <App />
  </SuperFanProvider>
);

reportWebVitals();
