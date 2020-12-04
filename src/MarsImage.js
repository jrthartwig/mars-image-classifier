import React, { useEffect, useState, useRef } from 'react';
import mobilenetDemo, * as mobileNet from './mobilenet-index';


const MarsImage = (props) => {

    const photo = useRef();
    //photos are passed to this child component from the parent that makes the API call 
    const { photos } = props;

    const [image, setImage] = useState();
    const [classes, setClasses] = useState([]);

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
        setImage(photos[0].img_src)
        await predict(photo)
    }, [])

    return (
        <div>
            <img ref={useRef} src={image} />
        </div>
    )
}


export default MarsImage;