import React, { useState, useEffect } from "react";
import MarsImage from "./MarsImage";

// TODO
// CREATE CHILD COMPONENT THAT MANAGES THE IMAGE
// -- PASS IN MOBILE NET AS PROP
// -- MAINTAIN CLASSES AND OTHER IMAGE SPECIFIC PROPS IN THE CHILD COMPONENT
// NO DOCUMENT.WHATEVER.... GET RID OF IT!!
// -- LOOK AT USEREF FOR MAINTAINGIN HOOKS INTO HTML ELEMENTS

const ImageLoader = () => {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [images, setImages] = useState([]);

    useEffect(async () => {
        fetch(
            "https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&page=2&api_key=cPmB3PNZCJGbJ8YYWhA7m8hbYu0z4yqxSoai7cu1"
        )
            .then((res) => res.json())
            .then(
                async (result) => {
                    setIsLoaded(true);
                    setImages(result.photos);
                    console.log(images)
                    //broken here
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
            .then();
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
                        {/* {images && images.map((image) => {
                            <MarsImage src={image[0].img_src} />
                        })} */}
                        <MarsImage src={images[0].img_src} />
                    </div>
                </div>
            </div>
        );
    }
};

export default ImageLoader;
