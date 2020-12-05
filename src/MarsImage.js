import React, { useEffect, useState, useRef } from 'react';
import Utils from './utils';
import * as tf from "@tensorflow/tfjs";



const MarsImage = (props) => {

    const { imageSource } = props;
    const photo = useRef();
    const [image, setImage] = useState();
    const [status, setStatus] = useState();
    const [classes, setClasses] = useState([]);
    const IMAGE_SIZE = 224;
    const TOPK_PREDICTIONS = 10;
    const MOBILENET_MODEL_PATH =
        'https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json';

    let mobilenet;
    (async () => {
        mobilenet = await tf.loadLayersModel(MOBILENET_MODEL_PATH);
    })();

    async function predict(imgElement) {

        setStatus("Predicting...");
        // const startTime1 = performance.now();
        // let startTime2;
        const logits = tf.tidy(() => {
            // tf.browser.fromPixels() returns a Tensor from an image element.
            const img = tf.browser.fromPixels(imgElement).toFloat();

            const offset = tf.scalar(127.5);
            // Normalize the image from [0, 255] to [-1, 1].
            const normalized = img.sub(offset).div(offset);

            // Reshape to a single-element batch so we can pass it to predict.
            const batched = normalized.reshape([1, IMAGE_SIZE, IMAGE_SIZE, 3]);

            //startTime2 = performance.now();
            // Make a prediction through mobilenet.
            return mobilenet.predict(batched);
        });
        //setClasses(await Utils.getTopKClasses(predict.logits, TOPK_PREDICTIONS));
    }

    useEffect(async () => {
        setImage(photos[0].img_src)
        await predict(photo)
        setClasses(await Utils.getTopKClasses(predict.logits, TOPK_PREDICTIONS));
    }, [])

    return (
        <div>
            <div>{status}</div>
            <img ref={photo} src={imageSource} />
            <div>{classes}</div>
        </div>
    )
}

export default MarsImage;