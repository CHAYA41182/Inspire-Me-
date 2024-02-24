import React, { useState, useEffect } from 'react';
import Axios from 'axios';

const apiKey = "iWeyXf4osS+4jJdWEuS3hQ==pzX16EzYjnLbusqG";

const App = () => {
  const [quote, setQuote] = useState("");
  const [image, setImage] = useState("");

  function getContrastColor(rgbColor){
    
    const r = parseInt(rgbColor.substring(4, 7));
    const g = parseInt(rgbColor.substring(9, 12));
    const b = parseInt(rgbColor.substring(14, 17));
    const contrast = Math.round(((r * 299) + (g * 587) + (b * 114)) / 1000);
    return (contrast >= 128) ? 'black' : 'white';
}

const getAverageRGB = (imgEl) => {
  const canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const context = canvas.getContext('2d');
const image = new Image();
image.src = imgEl;


  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
/**
 * Draws an image on a canvas and sets the color of h1Item and h5Item to the contrast color of the pixel at the center of the canvas.
 *
 * @param {HTMLImageElement} image - The image to be drawn on the canvas.
 * @param {CanvasRenderingContext2D} context - The 2D rendering context for the canvas.
 * @param {HTMLHeadingElement} h1Item - The h1 element whose color will be set to the contrast color of the pixel.
 * @param {HTMLHeadingElement} h5Item - The h5 element whose color will be set to the contrast color of the pixel.
 */
  const pixel = context.getImageData(centerX, centerY, 1, 1).data;
  const rgbColor = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
  const contrastColor = getContrastColor(rgbColor);



}


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
  const CenterColor = getAverageRGB(image);
  const textColor = getContrastColor(CenterColor);
  return (
    <div style={{ backgroundImage: `url(${image})` }}>
      <h1 style={{ color: textColor }}>{quote.quote}</h1>
      <h5 style={{ color: textColor }}>{quote.author}</h5>
    </div>
  );



};

export default App;