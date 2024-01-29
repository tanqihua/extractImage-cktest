const axios = require("axios");

let url = "http://localhost:5000/count";
async function axiosTest(url) {
  for (let i = 0; i < 5000; i++) {
    try {
      const response = await axios.get(url);
    } catch (error) {
      console.error(error);
    }
  }
}

axiosTest(url);
