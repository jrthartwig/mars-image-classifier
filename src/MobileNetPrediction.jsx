// // import React, { useEffect, useRef, useState } from 'react';
// // import * as tf from '@tensorflow/tfjs';

// // import { IMAGENET_CLASSES } from './imagenet_classes';

// // const MOBILENET_MODEL_PATH =
// //     // tslint:disable-next-line:max-line-length
// //     'https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json';

// // const IMAGE_SIZE = 224;
// // const TOPK_PREDICTIONS = 10;

// // let mobilenet;
// // const mobilenetDemo = async () => {
// //     status('Loading model...');

// //     mobilenet = await tf.loadLayersModel(MOBILENET_MODEL_PATH);

// //     // Warmup the model. This isn't necessary, but makes the first prediction
// //     // faster. Call `dispose` to release the WebGL memory allocated for the return
// //     // value of `predict`.
// //     mobilenet.predict(tf.zeros([1, IMAGE_SIZE, IMAGE_SIZE, 3])).dispose();

// //     status('');

// //     // Make a prediction through the locally hosted cat.jpg.
// //     const marsElement = document.getElementById('mars');
// //     if (marsElement.complete && marsElement.naturalHeight !== 0) {
// //         predict(marsElement);
// //         marsElement.style.display = '';
// //     } else {
// //         marsElement.onload = () => {
// //             predict(marsElement);
// //             marsElement.style.display = '';
// //         }
// //     }

// //     //document.getElementById('file-container').style.display = '';
// // };

// // const MobileNetPrediction = () => {

// //     const imageElement = useRef();

// //     const [status, setStatus] = useState('');
// //     const [classes, setClasses] = useState([]);

// //     let mobilenet;

// //     useEffect(() => {
// //         mobilenet = await tf.loadLayersModel(MOBILENET_MODEL_PATH);
// //         mobilenet.predict(tf.zeros([1, IMAGE_SIZE, IMAGE_SIZE, 3])).dispose();
// //     }, [])

// //     const classList = classes.map((class) =>
// // <div></div>
// //     );

// // return (
// //     <>
// //         <img key={image.id} src={image.img_src} id="mars" crossOrigin="anonymous" width="224" height="224" />
// //         <div>{status}</div>
// //         <div className="pred-container">
// //             {classes.map((class) => {
// //                     return <div></div>;
// //                 })}
// //             </div>
// //     </>
// //     //     const predictionContainer = document.createElement('div');
// //     // predictionContainer.className = 'pred-container';

// //     // const imgContainer = document.createElement('div');
// //     // imgContainer.appendChild(imgElement);
// //     // predictionContainer.appendChild(imgContainer);

// //     // const probsContainer = document.createElement('div');
// //     // for (let i = 0; i < classes.length; i++) {
// //     //     const row = document.createElement('div');
// //     //     row.className = 'row';

// //     //     const classElement = document.createElement('div');
// //     //     classElement.className = 'cell';
// //     //     classElement.innerText = classes[i].className;
// //     //     row.appendChild(classElement);

// //     //     const probsElement = document.createElement('div');
// //     //     probsElement.className = 'cell';
// //     //     probsElement.innerText = classes[i].probability.toFixed(3);
// //     //     row.appendChild(probsElement);

// //     //     probsContainer.appendChild(row);
// //     // }
// //     // predictionContainer.appendChild(probsContainer);

// //     // predictionsElement.insertBefore(
// //     //     predictionContainer, predictionsElement.firstChild);
// // )

// // }



// // /**
// //  * Given an image element, makes a prediction through mobilenet returning the
// //  * probabilities of the top K classes.
// //  */
// // async function predict(imgElement) {
// //     status('Predicting...');

// //     // The first start time includes the time it takes to extract the image
// //     // from the HTML and preprocess it, in additon to the predict() call.
// //     const startTime1 = performance.now();
// //     // The second start time excludes the extraction and preprocessing and
// //     // includes only the predict() call.
// //     let startTime2;
// //     const logits = tf.tidy(() => {
// //         // tf.browser.fromPixels() returns a Tensor from an image element.
// //         const img = tf.browser.fromPixels(imgElement).toFloat();

// //         const offset = tf.scalar(127.5);
// //         // Normalize the image from [0, 255] to [-1, 1].
// //         const normalized = img.sub(offset).div(offset);

// //         // Reshape to a single-element batch so we can pass it to predict.
// //         const batched = normalized.reshape([1, IMAGE_SIZE, IMAGE_SIZE, 3]);

// //         startTime2 = performance.now();
// //         // Make a prediction through mobilenet.
// //         return mobilenet.predict(batched);
// //     });

// //     // Convert logits to probabilities and class names.
// //     const classes = await getTopKClasses(logits, TOPK_PREDICTIONS);
// //     const totalTime1 = performance.now() - startTime1;
// //     const totalTime2 = performance.now() - startTime2;
// //     status(`Done in ${Math.floor(totalTime1)} ms ` +
// //         `(not including preprocessing: ${Math.floor(totalTime2)} ms)`);

// //     // Show the classes in the DOM.
// //     showResults(imgElement, classes);
// // }

// // /**
// //  * Computes the probabilities of the topK classes given logits by computing
// //  * softmax to get probabilities and then sorting the probabilities.
// //  * @param logits Tensor representing the logits from MobileNet.
// //  * @param topK The number of top predictions to show.
// //  */
// // export async function getTopKClasses(logits, topK) {
// //     const values = await logits.data();

// //     const valuesAndIndices = [];
// //     for (let i = 0; i < values.length; i++) {
// //         valuesAndIndices.push({ value: values[i], index: i });
// //     }
// //     valuesAndIndices.sort((a, b) => {
// //         return b.value - a.value;
// //     });
// //     const topkValues = new Float32Array(topK);
// //     const topkIndices = new Int32Array(topK);
// //     for (let i = 0; i < topK; i++) {
// //         topkValues[i] = valuesAndIndices[i].value;
// //         topkIndices[i] = valuesAndIndices[i].index;
// //     }

// //     const topClassesAndProbs = [];
// //     for (let i = 0; i < topkIndices.length; i++) {
// //         topClassesAndProbs.push({
// //             className: IMAGENET_CLASSES[topkIndices[i]],
// //             probability: topkValues[i]
// //         })
// //     }
// //     return topClassesAndProbs;
// // }

// // //
// // // UI
// // //

// // function showResults(imgElement, classes) {
// //     const predictionContainer = document.createElement('div');
// //     predictionContainer.className = 'pred-container';

// //     const imgContainer = document.createElement('div');
// //     imgContainer.appendChild(imgElement);
// //     predictionContainer.appendChild(imgContainer);

// //     const probsContainer = document.createElement('div');
// //     for (let i = 0; i < classes.length; i++) {
// //         const row = document.createElement('div');
// //         row.className = 'row';

// //         const classElement = document.createElement('div');
// //         classElement.className = 'cell';
// //         classElement.innerText = classes[i].className;
// //         row.appendChild(classElement);

// //         const probsElement = document.createElement('div');
// //         probsElement.className = 'cell';
// //         probsElement.innerText = classes[i].probability.toFixed(3);
// //         row.appendChild(probsElement);

// //         probsContainer.appendChild(row);
// //     }
// //     predictionContainer.appendChild(probsContainer);

// //     predictionsElement.insertBefore(
// //         predictionContainer, predictionsElement.firstChild);
// // }

// // const demoStatusElement = document.getElementById('status');

// // const status = msg => demoStatusElement.innerHTML = msg;

// // const predictionsElement = document.getElementById('predictions');

// // mobilenetDemo();

// // export default mobilenetDemo; 