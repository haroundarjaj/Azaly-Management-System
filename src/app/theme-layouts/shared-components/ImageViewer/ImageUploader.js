import React, { useState } from "react";
import PropTypes from "prop-types";
import { Typography } from "@mui/material";

function ImageUploader(props) {
    const { uploadedImage, width, height, handleImageChange } = props;
    const hiddenFileInput = React.useRef(null);

    const handleClick = event => {
        hiddenFileInput.current.click();
    };

    const handleChange = async (event) => {

        const file = event.target.files[0]
        const base64 = await convertBase64(file)
        handleImageChange(base64)
        console.log(file)
        console.log(base64)
        // handleImageChange(fileUploaded);
    };

    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file)
            fileReader.onload = () => {
                resolve(fileReader.result);
            }
            fileReader.onerror = (error) => {
                reject(error);
            }
        })
    }

    return (
        <div
            style={{ width, height }}
            className="border-solid border-2 border-themePrimary rounded-md flex justify-center items-center"
            onClick={handleClick}
        >
            {uploadedImage ?
                <img src={uploadedImage} style={{ maxWidth: width - 4, maxHeight: height - 4 }} />
                :
                <Typography variant="caption"> click here to upload an image</Typography>
            }
            <input
                type="file"
                ref={hiddenFileInput}
                onChange={handleChange}
                accept="image/*"
                style={{ display: 'none' }}
            />
        </div>
    )
}

ImageUploader.propTypes = {
    uploadedImage: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    handleImageChange: PropTypes.func.isRequired
}

ImageUploader.defaultProps = {
    width: 200,
    height: 200,
    handleImageChange: () => { }
}

export default ImageUploader;