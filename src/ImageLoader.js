import React, { useState, useEffect } from "react";
import MarsImage from "./MarsImage";
import * as tf from "@tensorflow/tfjs";
const MOBILENET_MODEL_PATH =
  "https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json";

// TODO
// CREATE CHILD COMPONENT THAT MANAGES THE IMAGE
// -- PASS IN MOBILE NET AS PROP
// -- MAINTAIN CLASSES AND OTHER IMAGE SPECIFIC PROPS IN THE CHILD COMPONENT
// NO DOCUMENT.WHATEVER.... GET RID OF IT!!
// -- LOOK AT USEREF FOR MAINTAINGIN HOOKS INTO HTML ELEMENTS
let mobilenet;
(async () => {
  mobilenet = await tf.loadLayersModel(MOBILENET_MODEL_PATH);
})();

const ImageLoader = () => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [images, setImages] = useState();

  useEffect(async () => {
    fetch(
      "https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&page=2&api_key=cPmB3PNZCJGbJ8YYWhA7m8hbYu0z4yqxSoai7cu1"
    )
      .then((res) => res.json())
      .then(
        async (result) => {
          setIsLoaded(true);
          setImages(result.photos);
          //console.log(images)
          //broken here -- fixed with useEffect #36-#38
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
      .then();
  }, []);

  // useEffect(() => {
  //     console.log(images);
  // }, [images])

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      (images && mobilenet && (
        <div>
          <div>
            <div>
              {/* {images && images.map((image) => {
                            <MarsImage src={image[0].img_src} />
                        })} */}
              <MarsImage
                mobilenet={mobilenet}
                imageSource={images[0].img_src}
              />
            </div>
          </div>
        </div>
      )) ||
      null
    );
  }
};

export default ImageLoader;
