import React, { useEffect, useState } from "react";
import { Button, Grid, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography, FormGroup, FormControlLabel, Checkbox, Autocomplete } from "@mui/material";
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import "profile-picture/build/ProfilePicture.css";
import ProductService from "src/app/services/ProductService";
import { useForm } from "react-hook-form";
import ImageUploader from "app/theme-layouts/shared-components/ImageViewer/ImageUploader";
import CategoryService from "src/app/services/ProductCategoryService";

const productImageRef = React.createRef();

function AddEditProductDialog(props) {
    const tProduct = useTranslation('productsPage').t;
    const tGeneral = useTranslation('generalTranslations').t;

    const {
        handleClose,
        handleAddDone,
        handleUpdateDone,
        open,
        selectedProduct
    } = props;

    const { register, handleSubmit, reset } = useForm({ mode: 'onTouched' });

    const [uploadedImage, setUploadedImage] = useState(null);
    const [categoriesData, setCategoriesData] = useState([]);

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
        /* const PP = productImageRef.current;
        const imageAsDataURL = PP.getImageAsDataUrl(1); */
        const product = {
            ...data,
            image: null,
        }
        /* if (PP.getData().imageSrc) {
            product.image = imageUploade;
        } */
        product.image = uploadedImage;
        if (selectedProduct) {
            product.id = selectedProduct.id;
            ProductService.update(product).then(({ data }) => {
                handleUpdateDone(data);
            })
        } else {
            ProductService.add(product).then(({ data }) => {
                handleAddDone(data);
            })
        };
    }

    useEffect(() => {
        CategoryService.getAll().then(({ data }) => {
            setCategoriesData(data);
        })
    }, []);

    useEffect(() => {
        if (open && !selectedProduct) {
            setUploadedImage(null)
            reset({
                ref: '',
                name: '',
                description: '',
                categoryName: '',
                unitPrice: '',
                wholesalePrice: ''
            });
        } else {
            setUploadedImage(selectedProduct?.image)
            reset(selectedProduct)
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
                    {selectedProduct ? tProduct('edit_title') : tProduct('add_title')}
                </Typography>
                <Typography variant="subtitle2" style={{ marginBottom: 20 }}>
                    {selectedProduct ? tProduct('edit_desc') : tProduct('add_desc')}
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
                        md={4}
                    >
                        {/* {<ProfilePicture
                            ref={productImageRef}
                            image={selectedProduct?.image}
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
                            <ImageUploader width={280} height={280} uploadedImage={uploadedImage} handleImageChange={setUploadedImage} />
                        </div>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        md={8}
                    >
                        <form
                            id="add-product-form"
                            onSubmit={handleSubmit(handleSave)}
                        >
                            <Grid
                                container
                                spacing={2}
                                alignItems="flex-start"
                                justifyContent="center"
                            >
                                <Grid item xs={12} md={6} container direction="column" spacing={3}>
                                    <Grid item xs={12}>
                                        <TextField
                                            id="ref"
                                            label={tGeneral("ref")}
                                            variant="outlined"
                                            name="ref"
                                            required
                                            fullWidth
                                            defaultValue={selectedProduct?.ref}
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
                                            defaultValue={selectedProduct?.name}
                                            {...register('name')}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Autocomplete
                                            disablePortal
                                            defaultValue={{ name: selectedProduct?.categoryName }}
                                            options={categoriesData}
                                            getOptionLabel={(option) => option.name || ''}
                                            fullWidth
                                            renderInput={(params) =>
                                                <TextField
                                                    id="categoryName"
                                                    name="categoryName"
                                                    {...params}
                                                    required
                                                    label={tProduct("category")}
                                                    {...register('categoryName')}
                                                />
                                            }
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
                                        defaultValue={selectedProduct?.description}
                                        {...register('description')}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        id="unitPrice"
                                        label={tProduct("unit_price")}
                                        variant="outlined"
                                        name="unitPrice"
                                        type="number"
                                        required
                                        fullWidth
                                        defaultValue={selectedProduct?.unitPrice}
                                        InputProps={{
                                            inputProps: { min: 0 }
                                        }}
                                        {...register('unitPrice')}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        id="wholesalePrice"
                                        label={tProduct("wholesale_price")}
                                        variant="outlined"
                                        name="wholesalePrice"
                                        type="number"
                                        required
                                        fullWidth
                                        defaultValue={selectedProduct?.wholesalePrice}
                                        InputProps={{
                                            inputProps: { min: 0 }
                                        }}
                                        {...register('wholesalePrice')}
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
                <Button onClick={handleSave} color="secondary" type="submit" form="add-product-form">
                    {tGeneral('save')}
                </Button>
            </DialogActions>
        </Dialog>
    )

}

AddEditProductDialog.propTypes = {
    handleClose: PropTypes.func.isRequired,
    handleAddDone: PropTypes.func,
    handleUpdateDone: PropTypes.func,
    open: PropTypes.bool.isRequired,
    selectedProduct: PropTypes.object,
}

AddEditProductDialog.defaultProps = {
    handleClose: () => { },
    handleAddDone: () => { },
    handleUpdateDone: () => { },
    open: false,
    selectedProduct: null,
}

export default AddEditProductDialog;