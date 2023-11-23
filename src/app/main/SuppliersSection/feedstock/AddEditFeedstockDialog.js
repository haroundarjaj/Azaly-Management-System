import React, { useEffect, useState } from "react";
import { Button, Grid, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography, FormGroup, FormControlLabel, Checkbox, Autocomplete } from "@mui/material";
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import "profile-picture/build/ProfilePicture.css";
import FeedstockService from "src/app/services/FeedstockService";
import { useForm } from "react-hook-form";
import ImageUploader from "app/theme-layouts/shared-components/ImageViewer/ImageUploader";
import AutoComplete from "app/theme-layouts/shared-components/AutoComplete";

const feedstockImageRef = React.createRef();

function AddEditFeedstockDialog(props) {
    const tFeedstock = useTranslation('feedstockPage').t;
    const tGeneral = useTranslation('generalTranslations').t;

    const {
        handleClose,
        handleAddDone,
        handleUpdateDone,
        open,
        selectedFeedstock
    } = props;

    const { register, handleSubmit, reset } = useForm({ mode: 'onTouched' });

    const [uploadedImage, setUploadedImage] = useState(null);

    const onClose = (event, reason) => {
        if (reason === 'backdropClick') {
            return false;
        }

        if (reason === 'escapeKeyDown') {
            return false;
        }

        if (typeof onClose === 'function') {
            handleClose();
        }
    };

    const handleSave = (data) => {
        /* const PP = feedstockImageRef.current;
        const imageAsDataURL = PP.getImageAsDataUrl(1); */
        const feedstock = {
            ...data,
            image: null,
        }
        /* if (PP.getData().imageSrc) {
            feedstock.image = imageUploade;
        } */
        feedstock.image = uploadedImage;
        if (selectedFeedstock) {
            feedstock.id = selectedFeedstock.id;
            FeedstockService.update(feedstock).then(({ data }) => {
                handleUpdateDone(data);
            })
        } else {
            FeedstockService.add(feedstock).then(({ data }) => {
                handleAddDone(data);
            })
        };
    }

    useEffect(() => {
        if (open && selectedFeedstock) {
            setUploadedImage(selectedFeedstock?.image)
            reset(selectedFeedstock)
        } else {
            setUploadedImage(null)
            reset({
                ref: '',
                name: '',
                description: '',
                price: '',
                inStock: ''
            });
        };
    }, [open])

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle>
                <Typography variant="subtitle1" color="secondary">
                    {selectedFeedstock ? tFeedstock('edit_title') : tFeedstock('add_title')}
                </Typography>
                <Typography variant="subtitle2" style={{ marginBottom: 20 }}>
                    {selectedFeedstock ? tFeedstock('edit_desc') : tFeedstock('add_desc')}
                </Typography>
            </DialogTitle>
            <DialogContent style={{ paddingTop: 20 }}>
                <Grid
                    container
                    alignItems="flex-start"
                    justifyContent="center"
                    spacing={2}
                >
                    <Grid
                        item
                        xs={12}
                        md={3}
                    >
                        {/* {<ProfilePicture
                            ref={feedstockImageRef}
                            image={selectedFeedstock?.image}
                            useHelper
                            frameFormat='square'
                            frameSize={500}
                            cropSize={200}
                            onStatusChange={handleError}
                            minImageSize={200}
                            messages={
                                {
                                    DEFAULT: tGeneral('image_tap'),
                                    DRAGOVER: tGeneral('image_drop'),
                                    INVALID_FILE_TYPE: "",
                                    INVALID_IMAGE_SIZE: ""
                                }
                            }
                        />} */}
                        <div className=" w-full flex justify-center mb-20">
                            <ImageUploader width={210} height={210} uploadedImage={uploadedImage} handleImageChange={setUploadedImage} />
                        </div>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        md={8}
                    >
                        <form
                            id="add-feedstock-form"
                            onSubmit={handleSubmit(handleSave)}
                        >
                            <Grid
                                container
                                spacing={2}
                                alignItems="flex-start"
                                justifyContent="center"
                            >
                                <Grid item xs={12} md={6} container direction="row" spacing={3}>
                                    <Grid item xs={12}>
                                        <TextField
                                            id="ref"
                                            label={tGeneral("ref")}
                                            variant="outlined"
                                            name="ref"
                                            required
                                            fullWidth
                                            defaultValue={selectedFeedstock?.ref}
                                            {...register('ref')}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            id="name"
                                            label={tGeneral("name")}
                                            variant="outlined"
                                            name="name"
                                            required
                                            fullWidth
                                            defaultValue={selectedFeedstock?.name}
                                            {...register('name')}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            id="price"
                                            label={tFeedstock("price")}
                                            variant="outlined"
                                            name="price"
                                            type="number"
                                            required
                                            fullWidth
                                            defaultValue={selectedFeedstock?.price}
                                            InputProps={{
                                                inputProps: { min: 0 }
                                            }}
                                            {...register('price')}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            id="inStock"
                                            label={tFeedstock("in_stock")}
                                            variant="outlined"
                                            name="inStock"
                                            type="number"
                                            required
                                            fullWidth
                                            defaultValue={selectedFeedstock?.inStock}
                                            InputProps={{
                                                inputProps: { min: 0 }
                                            }}
                                            {...register('inStock')}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        id="description"
                                        label={tGeneral("description")}
                                        variant="outlined"
                                        name="description"
                                        multiline
                                        fullWidth
                                        inputProps={{
                                            style: {
                                                height: 175,
                                                overflow: "auto"
                                            },
                                        }}
                                        defaultValue={selectedFeedstock?.description}
                                        {...register('description')}
                                    />
                                </Grid>
                            </Grid>
                        </form>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>
                    {tGeneral('close')}
                </Button>
                <Button onClick={handleSave} color="secondary" type="submit" form="add-feedstock-form">
                    {tGeneral('save')}
                </Button>
            </DialogActions>
        </Dialog>
    )

}

AddEditFeedstockDialog.propTypes = {
    handleClose: PropTypes.func.isRequired,
    handleAddDone: PropTypes.func,
    handleUpdateDone: PropTypes.func,
    open: PropTypes.bool.isRequired,
    selectedFeedstock: PropTypes.object,
}

AddEditFeedstockDialog.defaultProps = {
    handleClose: () => { },
    handleAddDone: () => { },
    handleUpdateDone: () => { },
    open: false,
    selectedFeedstock: null,
}

export default AddEditFeedstockDialog;