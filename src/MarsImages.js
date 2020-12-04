import React, { useEffect, useState } from 'react';
import mobilenetDemo, * as mobileNet from './mobilenet-index';

import MobileNetPredictions from './MobileNetPredictions';

const MarsImages = () => {

    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [images, setImages] = useState([]);


    useEffect(() => {
        fetch('https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&page=2&api_key=cPmB3PNZCJGbJ8YYWhA7m8hbYu0z4yqxSoai7cu1')
            .then(res => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    setImages(result.photos);
                    console.log(result.photos);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }, []);

    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        return (
            <>
                {images.map(image => (
                    <div>
                        {/* <img key={image.id} src={image.img_src} id="mars" crossOrigin="anonymous" width="224" height="224" /> */}
                        <MobileNetPrediction imageData={image} />
                        {/* <div id="status"></div>
                        <div id="predictions"></div>
                        <mobilenetDemo /> */}
                    </div>
                ))}
            </>

        )
    }
}


export default MarsImages;