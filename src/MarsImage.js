import React, { useEffect, useState, useRef } from "react";
import { getTopKClasses } from "./utils";
import * as tf from "@tensorflow/tfjs";

const MarsImage = (props) => {
  const { imageSource, mobilenet } = props;
  const photo = useRef();
  const [status, setStatus] = useState();
  const [classes, setClasses] = useState();
  const [logitData, setLogitData] = useState();
  const IMAGE_SIZE = 224;
  const TOPK_PREDICTIONS = 10;

  const predict = async (imgElement) => {
    setStatus("Predicting...");
    // const startTime1 = performance.now();
    // let startTime2;
    tf.tidy(async () => {
      // tf.browser.fromPixels() returns a Tensor from an image element.
      const img = tf.browser.fromPixels(imgElement).toFloat();

      const offset = tf.scalar(127.5);
      // Normalize the image from [0, 255] to [-1, 1].
      const normalized = img.sub(offset).div(offset);

      // Reshape to a single-element batch so we can pass it to predict.
      const batched = normalized.reshape([1, IMAGE_SIZE, IMAGE_SIZE, 3]);
      console.log(batched, mobilenet);
      //startTime2 = performance.now();
      // Make a prediction through mobilenet.
      const result = mobilenet.predict(batched);
      setStatus("Predicted...");
      setLogitData(await result.data());
    });
    //setClasses(await Utils.getTopKClasses(predict.logits, TOPK_PREDICTIONS));
  };

  useEffect(async () => {
    if (!logitData) return;
    let c = await getTopKClasses(logitData, TOPK_PREDICTIONS);
    setClasses(c);
  }, [logitData]);

  const predictImage = async (imageElement) => {
    predict(imageElement);
  };

  return (
    <div>
      <div>{status}</div>
      <img
        ref={photo}
        src={imageSource}
        crossOrigin="anonymous"
        width={224}
        height={224}
        onLoad={() => {
          predictImage(photo.current);
        }}
      />
      {classes && classes.map((c, x) => <div key={x}>{c.className}</div>)}
    </div>
  );
};

export default MarsImage;
