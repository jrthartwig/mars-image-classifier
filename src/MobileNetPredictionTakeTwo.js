import * as tf from '@tensorflow/tfjs';
import React, { useState, useEffect } from 'react';
import { IMAGENET_CLASSES } from './imagenet_classes';

const MOBILENET_MODEL_PATH =
    'https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json';

const IMAGE_SIZE = 224;
const TOPK_PREDICTIONS = 10;

const MobileNetPredictionTakeTwo = () => {

    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [status, setStatus] = useState('');
    const [images, setImages] = useState([]);
    const [classes, setClasses] = useState([]);
    const [logits, setLogits] = useState();


    async function predict(img) {
        setStatus('Predicting...');
        // const startTime1 = performance.now();
        // let startTime2;
        tf.tidy(() => {
            let mobilenet;
            const image = tf.browser.fromPixels(img).toFloat();
            const offset = tf.scalar(127.5);
            const normalized = image.sub(offset).div(offset);
            const batched = normalized.reshape([1, IMAGE_SIZE, IMAGE_SIZE, 3]);
            //startTime2 = performance.now();
            //return mobilenet.predict(batched);
            setLogits(predict(batched));
            // const totalTime1 = performance.now() - startTime1;
            // const totalTime2 = performance.now() - startTime2;
            // status(`Done in ${Math.floor(totalTime1)} ms ` +
            // `(not including preprocessing: ${Math.floor(totalTime2)} ms)`);

        });
    };

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
                probability: topkValues[i]
            })
        }
        return topClassesAndProbs;
    }


    useEffect(async () => {
        fetch('https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&page=2&api_key=cPmB3PNZCJGbJ8YYWhA7m8hbYu0z4yqxSoai7cu1')
            .then(res => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    setImages(result.photos);
                    result.photos.forEach(async image => {
                        const img = document.createElement('img')
                        img.setAttribute("src", image.img_src)
                        img.setAttribute("id", "mars")
                        img.setAttribute("width", "224")
                        img.setAttribute("crossOrigin", "anonymous")
                        img.setAttribute("height", "224")
                        document.body.appendChild(img);
                        await predict(img)
                        setClasses(await getTopKClasses(logits, TOPK_PREDICTIONS))
                    });
                    console.log(result.photos);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
            .then(

            )
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
                <div >
                    <div>
                        <div>{status}</div>
                        <img src={images.img_src} id="mars" crossOrigin="anonymous" width="224" height="224" />
                        <div>{classes[0] && classes[0].className}</div>
                        <div>{classes[0] && classes[0].probability.ToFixed(3)}</div>
                    </div>
                </div>
            </div>
        )
    }
}


export default MobileNetPredictionTakeTwo;