import React, { useEffect, useState } from "react";
import { Button, Grid, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography, FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import ProfilePicture from "profile-picture";
import "profile-picture/build/ProfilePicture.css";
import CategoryService from "src/app/services/ProductCategoryService";
import { useForm } from "react-hook-form";
import ImageUploader from "app/theme-layouts/shared-components/ImageViewer/ImageUploader";

const categoryImageRef = React.createRef();

function AddEditCategoryDialog(props) {
    const tCategory = useTranslation('categoriesPage').t;
    const tGeneral = useTranslation('generalTranslations').t;

    const {
        handleClose,
        handleAddDone,
        handleUpdateDone,
        handleShowNotification,
        open,
        selectedCategory
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
        /* const PP = categoryImageRef.current;
        const imageAsDataURL = PP.getImageAsDataUrl(1); */
        const category = {
            ...data,
            image: null,
        }
        /* if (PP.getData().imageSrc) {
            category.image = imageUploade;
        } */
        category.image = uploadedImage;
        if (selectedCategory) {
            category.id = selectedCategory.id;
            CategoryService.update(category).then(({ data }) => {
                handleUpdateDone(data);
            }).catch(err => {
                if (err.response.data.cause) {
                    handleShowNotification(tCategory(err.response.data.cause), 'error');
                } else handleShowNotification(tGeneral("unkown_error"), 'error');
            });
        } else {
            CategoryService.add(category).then(({ data }) => {
                handleAddDone(data);
            }).catch(err => {
                if (err.response.data.cause) {
                    handleShowNotification(tCategory(err.response.data.cause), 'error');
                } else handleShowNotification(tGeneral("unkown_error"), 'error');
            });
        };
    }

    const handleError = (status) => {
        if (status === 'INVALID_FILE_TYPE') {

        } else if (status === 'INVALID_IMAGE_SIZE') {

        }
    };

    useEffect(() => {
        if (open && !selectedCategory) {
            setUploadedImage(null)
            reset({
                name: '',
                description: ''
            });
        } else {
            setUploadedImage(selectedCategory?.image)
            reset(selectedCategory)
        };
    }, [open])

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>
                <Typography variant="subtitle1" color="secondary">
                    {selectedCategory ? tCategory('edit_title') : tCategory('add_title')}
                </Typography>
                <Typography variant="subtitle2" style={{ marginBottom: 20 }}>
                    {selectedCategory ? tCategory('edit_desc') : tCategory('add_desc')}
                </Typography>
            </DialogTitle>
            <DialogContent style={{ paddingTop: 20 }}>
                <Grid
                    container
                    alignItems="flex-start"
                    justifyContent="center"
                >
                    <Grid
                        item
                        xs={12}
                        md={5}
                    >
                        {/* {<ProfilePicture
                            ref={categoryImageRef}
                            image={selectedCategory?.image}
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
                            <ImageUploader width={200} height={200} uploadedImage={uploadedImage} handleImageChange={setUploadedImage} />
                        </div>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        md={7}
                    >
                        <form
                            id="add-category-form"
                            onSubmit={handleSubmit(handleSave)}
                        >
                            <Grid
                                container
                                spacing={2}
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Grid item xs={12}>
                                    <TextField
                                        id="name"
                                        label={tGeneral("name")}
                                        variant="outlined"
                                        name="name"
                                        required
                                        fullWidth
                                        defaultValue={selectedCategory?.name}
                                        {...register('name')}
                                    //style={{ marginTop: 23 }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        id="description"
                                        label={tGeneral("description")}
                                        variant="outlined"
                                        name="description"
                                        multiline
                                        fullWidth
                                        inputProps={{
                                            style: {
                                                height: 98,
                                                overflow: "auto"
                                            },
                                        }}
                                        defaultValue={selectedCategory?.description}
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
                <Button onClick={handleSave} color="secondary" type="submit" form="add-category-form">
                    {tGeneral('save')}
                </Button>
            </DialogActions>
        </Dialog>
    )

}

AddEditCategoryDialog.propTypes = {
    handleClose: PropTypes.func.isRequired,
    handleAddDone: PropTypes.func,
    handleUpdateDone: PropTypes.func,
    open: PropTypes.bool.isRequired,
    selectedCategory: PropTypes.object,
}

AddEditCategoryDialog.defaultProps = {
    handleClose: () => { },
    handleAddDone: () => { },
    handleUpdateDone: () => { },
    open: false,
    selectedCategory: null,
}

export default AddEditCategoryDialog;