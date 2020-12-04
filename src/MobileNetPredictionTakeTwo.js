import * as tf from "@tensorflow/tfjs";
import React, { useState, useEffect } from "react";
import { IMAGENET_CLASSES } from "./imagenet_classes";

const MOBILENET_MODEL_PATH =
    "https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json";

const IMAGE_SIZE = 224;
const TOPK_PREDICTIONS = 10;

let mobilenet;
(async () => {
    mobilenet = await tf.loadLayersModel(MOBILENET_MODEL_PATH);
    //mobilenet.predict(tf.zeros([1, IMAGE_SIZE, IMAGE_SIZE, 3])).dispose();
})();

// TODO
// CREATE CHILD COMPONENT THAT MANAGES THE IMAGE
// -- PASS IN MOBILE NET AS PROP
// -- MAINTAIN CLASSES AND OTHER IMAGE SPECIFIC PROPS IN THE CHILD COMPONENT
// NO DOCUMENT.WHATEVER.... GET RID OF IT!!
// -- LOOK AT USEREF FOR MAINTAINGIN HOOKS INTO HTML ELEMENTS

const MobileNetPredictionTakeTwo = () => {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [status, setStatus] = useState("");
    const [images, setImages] = useState([]);
    const [classes, setClasses] = useState([]);
    const [logits, setLogits] = useState();

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
        setClasses(await getTopKClasses(logits, TOPK_PREDICTIONS));
    }

    // MOVE TO UTILITY FILE
    async function getTopKClasses(logits, topK) {
        const values = await logits.data();
        const valuesAndIndices = [];
        for (let i = 0; i < values.length; i++) {
            valuesAndIndices.push({ value: values[i], index: i });
        }
        valuesAndIndices.sort((a, b) => {
            return b.value - a.value;
        });
        const topkValues = new Float32Array(topK);
        const topkIndices = new Int32Array(topK);
        for (let i = 0; i < topK; i++) {
            topkValues[i] = valuesAndIndices[i].value;
            topkIndices[i] = valuesAndIndices[i].index;
        }
        const topClassesAndProbs = [];
        for (let i = 0; i < topkIndices.length; i++) {
            topClassesAndProbs.push({
                className: IMAGENET_CLASSES[topkIndices[i]],
                probability: topkValues[i],
            });
        }
        return topClassesAndProbs;
    }

    useEffect(async () => {
        fetch(
            "https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&page=2&api_key=cPmB3PNZCJGbJ8YYWhA7m8hbYu0z4yqxSoai7cu1"
        )
            .then((res) => res.json())
            .then(
                async (result) => {
                    setIsLoaded(true);
                    setImages(result.photos);
                    //   result.photos.forEach(async (image) => {
                    //     const img = document.createElement("img");
                    //     img.setAttribute("src", image.img_src);
                    //     img.setAttribute("id", "mars");
                    //     img.setAttribute("width", "224");
                    //     img.setAttribute("crossOrigin", "anonymous");
                    //     img.setAttribute("height", "224");
                    //     document.body.appendChild(img);
                    //     await predict(img);
                    //   });
                    //   console.log(result.photos[0]);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
            .then();
        //mobilenet = await tf.loadLayersModel(MOBILENET_MODEL_PATH);
        //mobilenet.predict(tf.zeros([1, IMAGE_SIZE, IMAGE_SIZE, 3])).dispose();
        //setStatus('');
    }, []);

    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        return (
            <div>
                <div>
                    <div>
                        <div>{status}</div>
                        {/* <img src={images.img_src} id="mars" crossOrigin="anonymous" width="224" height="224" /> */}
                        {/* <div>{classes[0] && classes[0].className}</div> */}

                        {/*<div>{classes[0] && classes[0].probability.ToFixed(3)}</div> */}

                        {/*
                CHALLENGE
                HERE: map image collection to <ChildComponent photo={image} mobilenet={mobileNetInstance} />
            */}
                        {images && images.map((image) => {
                            // Create component here base on lines #92 - #98
                        })}
                    </div>
                </div>
            </div>
        );
    }
};

export default MobileNetPredictionTakeTwo;
