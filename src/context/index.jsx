import { createContext, useContext, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  collection as firebaseCollection,
  getDoc,
} from "firebase/firestore";
import axios from "axios";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const superFanContext = createContext();

export const SuperFanProvider = ({ children, value }) => {
  const { collection, firebaseConfig, superfan } = value;

  let uid = localStorage.getItem("uid") ?? uuidv4();
  localStorage.setItem("uid", uid);

  const [clicked, setClicked] = useState(null);
  const [info, setInfo] = useState({
    uid: uid,
    createTime: Date.now(),
    _name: null,
  });

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const storage = getStorage(app, "gs://testerdemo-888a3.appspot.com");

  const init = (_preTimeSpen = 0, _replay = 1) => {
    let count20 = 20;
    let current = new Date().getTime();
    let timeSpend = _preTimeSpen;
    console.log("init", _preTimeSpen, _replay);
    if (_replay === 1) {
      axios
        .get("https://api.ipify.org?format=json")
        .then((res) => {
          const { data } = res;
          const ipAddress = data.ip;
          axios
            .get(`https://ipapi.co/${ipAddress}/json/`)
            .then((res) => {
              const { data } = res;
              setDoc(
                doc(db, collection, info.uid),
                {
                  createTime: new Date(),
                  uid: info.uid,
                  oparationSystem: navigator.appVersion,
                  replay: _replay,
                  ...data,
                },
                {
                  merge: true,
                }
              );
            })
            .catch((err) => {
              setDoc(
                doc(db, collection, info.uid),
                {
                  createTime: new Date(),
                  uid: info.uid,
                  oparationSystem: navigator.appVersion,
                  replay: _replay,
                },
                {
                  merge: true,
                }
              );
            });
        })
        .catch((err) => {
          setDoc(
            doc(db, collection, info.uid),
            {
              createTime: new Date(),
              uid: info.uid,
              oparationSystem: navigator.appVersion,
              replay: _replay,
            },
            {
              merge: true,
            }
          );
        });
    } else {
      setDoc(
        doc(db, collection, info.uid),
        {
          uid: info.uid,
          oparationSystem: navigator.appVersion,
          replay: _replay,
        },
        {
          merge: true,
        }
      );
    }

    const countDown = () => {
      // check if 1 second has passed
      if (new Date().getTime() - current > 1000) {
        current = new Date().getTime();
        // hander time spend
        if (count20 <= 0) {
          count20 = 20;

          timeSpend += count20;
          setDoc(
            doc(db, value.collection, info.uid),
            {
              timeSpend,
            },
            { merge: true }
          );
        } else {
          count20--;
        }
      }
      requestAnimationFrame(countDown);
    };

    countDown();
  };

  const trackBtn = (type) => {
    if (info.uid) {
      let count = 0;
      if (clicked) {
        count = parseInt(clicked[type]?.count ?? 0);
      }
      count++;
      let data = {
        clicked: {
          [type]: {
            time: new Date(),
            count: count,
          },
        },
      };
      setDoc(doc(db, collection, info.uid), data, {
        merge: true,
      });
    }
  };

  const customType = (type, value) => {
    if (info.uid) {
      let data = {
        [type]: value,
      };
      setDoc(doc(db, collection, info.uid), data, {
        merge: true,
      });
    }
  };

  const submit = (props) => {
    if (info.uid) {
      setDoc(
        doc(db, superfan, info.uid),
        { ...props, createTime: Date(), uid: info.uid },
        {
          merge: true,
        }
      ).then((e) => {
        console.log(e);
      });
    }
  };

  const submit_temp = (props) => {
    if (info.uid) {
      setDoc(doc(db, "coach-holiday", Date.now().toString()), props, {
        merge: true,
      }).then((e) => {
        console.log(e);
      });
    }
  };

  const getCheckHistory = async () => {
    const docRef = doc(db, collection, uid);
    const docSnap = await getDoc(docRef);
    if (uid && docSnap.exists() && docSnap.data()["replay"]) {
      setClicked(docSnap.data()?.clicked);
      setInfo({
        ...docSnap.data(),
      });
      init(docSnap.data()?.timeSpend, docSnap.data()["replay"] + 1);
    } else {
      init();
    }
  };

  const uploadFile = async (bolb) => {
    const storageRef = ref(storage, collection + "/" + info.uid + ".png");
    const snapshot = await uploadBytes(storageRef, bolb);

    const url = await getDownloadURL(snapshot.ref);

    return url;
  };

  // useEffect(() => {
  //   getCheckHistory();
  // }, []);

  return (
    <superFanContext.Provider
      value={{
        trackBtn,
        submit,
        customType,
        uploadFile,
        submit_temp,
        info,
      }}
    >
      {children}
    </superFanContext.Provider>
  );
};

function uuidv4() {
  return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const useSuperFan = () => useContext(superFanContext);
