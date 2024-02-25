import React, { useState, useEffect, useRef } from 'react';
import Axios from 'axios';

const apiKey = "iWeyXf4osS+4jJdWEuS3hQ==pzX16EzYjnLbusqG";

const App = () => {



  const [quote, setQuote] = useState("");
  const [image, setImage] = useState("");

  function getContrastColor(rgbColor) {

    const r = parseInt(rgbColor.substring(4, 7));
    const g = parseInt(rgbColor.substring(9, 12));
    const b = parseInt(rgbColor.substring(14, 17));
    const contrast = Math.round(((r * 299) + (g * 587) + (b * 114)) / 1000);
    return (contrast >= 128) ? 'black' : 'white';
  }
  const getAverageRGB = (imgEl) => {
    let blockSize = 5, // only visit every 5 pixels
      defaultRGB = { r: 0, g: 0, b: 0 }, // for non-supporting envs
      canvas = document.createElement('canvas'),
      context = canvas.getContext && canvas.getContext('2d'),
      data, width, height,
      i = -4,
      length,
      rgb = { r: 0, g: 0, b: 0 },
      count = 0;

    if (!context) {
      return defaultRGB;
    }

    height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
    width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

    context.drawImage(imgEl, 0, 0, width, height);

    try {
      data = context.getImageData(0, 0, width, height);
    } catch (e) {
      /* security error, img on diff domain */
      return defaultRGB;
    }

    length = data.data.length;

    while ((i += blockSize * 4) < length) {
      ++count;
      rgb.r += data.data[i];
      rgb.g += data.data[i + 1];
      rgb.b += data.data[i + 2];
    }

    // ~~ used to floor values
    rgb.r = ~~(rgb.r / count);
    rgb.g = ~~(rgb.g / count);
    rgb.b = ~~(rgb.b / count);

    return rgb;
  }
  const imgRef = useRef();
  const [averageColor, setAverageColor] = useState(null);

  useEffect(() => {
    const imgEl = imgRef.current;
    if (imgEl) {
      imgEl.onload = function () {
        setAverageColor(getAverageRGB(imgEl));
      }
  
      if (image) {
        imgEl.src = image;
      }
    }
  }, [image]);
  const fetchData = async () => {
    try {
      const quotesURL = "https://api.api-ninjas.com/v1/quotes"

      const quoteObj = await Axios.get(quotesURL, {
        headers: {
          "X-Api-Key": apiKey
        }
      })
      console.log(quoteObj);
      setQuote(quoteObj.data[0]);
    } catch (error) {
      console.log("fetchData error:");
      console.error(error);
    }
  };

  const fetchImage = async () => {
    const category = "nature";
    try {
      const response = await Axios.get('https://api.api-ninjas.com/v1/randomimage', {
        params: {
          category: category
        },
        headers: {
          'X-Api-Key': apiKey,
          'Accept': 'image/jpg'
        },
        responseType: 'arraybuffer'
      })
      const base64 = btoa(
        new Uint8Array(response.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          '',
        ),
      );
      setImage(`data:${response.headers['content-type'].toLowerCase()};base64,${base64}`);
    }
    catch (error) {
      console.log("fetchImage error:");
      console.error(error);
    }
  };


  useEffect(() => {


    fetchData();
    fetchImage();
  }, []);
  if (quote === "" || image === "") {
    return <div>Loading...</div>;
  }
  let avgColor = { r: 0, g: 0, b: 0 };
  if (imgRef.current) {
    avgColor = getAverageRGB(imgRef.current);
  }  const CenterColor = `rgb(${avgColor.r},${avgColor.g},${avgColor.b})`;
  const textColor = getContrastColor(CenterColor);

  return (
    <div style={{ backgroundImage: `url(${image})`, backgroundSize: 'cover', 
    width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <img ref={imgRef} style={{ display: 'none' }} 
            src={image} />

      <h1 style={{ color: textColor }}>{quote.quote}</h1>
      <h5 style={{ color: textColor }}>{quote.author}</h5>
    </div>
  );



};

export default App;