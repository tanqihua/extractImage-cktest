import React, { useEffect, useMemo } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { useSuperFan } from "../context";
const videoConstraints = {
  width: 500,
  height: 500,
  facingMode: "user",
};

const WebcamCapture = () => {
  const webcamRef = React.useRef(null);
  const { uploadFile } = useSuperFan();

  const capture = React.useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    // base64 to blob
    const byteString = atob(imageSrc.split(",")[1]);
    const mimeString = imageSrc.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++)
      ia[i] = byteString.charCodeAt(i);
    const blob = new Blob([ab], { type: mimeString });
    let url = await uploadFile(blob);
    axios
      .get("http://localhost:5000/", {
        params: {
          url: url,
        },
      })
      .then((response) => {
        console.log(response.data);
      });
  }, [webcamRef]);

  const width = useMemo(() => {
    if (window.innerWidth > 721) {
      return 500;
    }
    return window.innerWidth * 0.8;
  }, []);

  return (
    <div
      style={{
        margin: "auto",
        width: width,
        height: "fit-content",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <div
        style={{
          backgroundColor: "black",
        }}
        id="videoContainer"
      >
        <Webcam
          audio={false}
          height={width}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={width}
          videoConstraints={{
            width: width,
            height: width,
            facingMode: "user",
          }}
        />
      </div>

      <div className="block" style={{ height: "5svh" }} />
      <div
        onClick={capture}
        style={{
          backgroundColor: "red",
          width: "5rem",
          height: "5rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "50%",
          color: "white",
        }}
      >
        Capture
      </div>
    </div>
  );
};

export default WebcamCapture;
