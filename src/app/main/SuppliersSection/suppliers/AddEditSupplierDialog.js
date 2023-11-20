import React, { useEffect, useState } from "react";
import { Button, Grid, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography, FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import ProfilePicture from "profile-picture";
import "profile-picture/build/ProfilePicture.css";
import SupplierService from "src/app/services/SupplierService";
import { useForm } from "react-hook-form";

const profilePictureRef = React.createRef();

function AddEditSupplierDialog(props) {
    const tSupplier = useTranslation('suppliersPage').t;
    const tGeneral = useTranslation('generalTranslations').t;

    const {
        handleClose,
        handleAddDone,
        handleUpdateDone,
        open,
        selectedSupplier
    } = props;

    const { register, handleSubmit, reset } = useForm({ mode: 'onTouched' });

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
        const PP = profilePictureRef.current;
        const imageAsDataURL = PP.getImageAsDataUrl(1);
        const supplier = {
            ...data,
            image: null,
            isIndividual: data.isIndividual ? "yes" : "no"
        }
        if (PP.getData().imageSrc) {
            supplier.image = imageAsDataURL;
        }
        if (selectedSupplier) {
            supplier.id = selectedSupplier.id;
            SupplierService.update(supplier).then(({ data }) => {
                handleUpdateDone(data);
            })
        } else {
            SupplierService.add(supplier).then(({ data }) => {
                handleAddDone(data);
            })
        }
    }

    const handleError = (status) => {
        if (status === 'INVALID_FILE_TYPE') {

        } else if (status === 'INVALID_IMAGE_SIZE') {

        }
    };

    useEffect(() => {
        if (open && selectedSupplier) {
            reset(selectedSupplier);
        } else {
            reset({
                firstName: '',
                lastName: '',
                phoneNumber: '',
                email: '',
                address: '',
                isIndividual: false
            });
        }
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
                    {selectedSupplier ? tSupplier('edit_title') : tSupplier('add_title')}
                </Typography>
                <Typography variant="subtitle2" style={{ marginBottom: 20 }}>
                    {selectedSupplier ? tSupplier('edit_desc') : tSupplier('add_desc')}
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Grid
                    container
                    spacing={1}
                    alignItems="center"
                    justifyContent="center"
                    direction="row"
                >
                    <Grid
                        item
                        container
                        xs={12}
                        md={4}
                        alignItems="center"
                        justifyContent="center"
                    >
                        <ProfilePicture
                            ref={profilePictureRef}
                            image={selectedSupplier?.image}
                            useHelper
                            frameFormat='circle'
                            frameSize={200}
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
                        />
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        md={8}
                    >
                        <form
                            id="add-supplier-form"
                            onSubmit={handleSubmit(handleSave)}
                        >
                            <Grid
                                container
                                spacing={2}
                            >
                                <Grid container item xs={12} md={6}>
                                    <Grid item xs={12}>
                                        <TextField
                                            id="firstName"
                                            label={tGeneral("first_name")}
                                            variant="outlined"
                                            name="firstName"
                                            required
                                            fullWidth
                                            defaultValue={selectedSupplier?.firstName}
                                            {...register('firstName')}
                                            style={{
                                                marginBottom: 20
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            id="lastName"
                                            label={tGeneral("last_name")}
                                            variant="outlined"
                                            name="lastName"
                                            fullWidth
                                            defaultValue={selectedSupplier?.lastName}
                                            {...register('lastName')}
                                            style={{
                                                marginBottom: 5
                                            }}
                                        />
                                    </Grid>

                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        id="address"
                                        label={tGeneral("address")}
                                        variant="outlined"
                                        name="address"
                                        multiline
                                        fullWidth
                                        inputProps={{
                                            style: {
                                                height: 92,
                                                overflow: "auto"
                                            },
                                        }}
                                        defaultValue={selectedSupplier?.address}
                                        {...register('address')}
                                        style={{
                                            marginBottom: 5
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        id="email"
                                        label={tGeneral("email")}
                                        variant="outlined"
                                        name="email"
                                        fullWidth
                                        defaultValue={selectedSupplier?.email}
                                        {...register('email')}
                                        style={{
                                            marginBottom: 10
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        id="phoneNumber"
                                        label={tGeneral("phone_number")}
                                        variant="outlined"
                                        name="phoneNumber"
                                        type="number"
                                        required
                                        fullWidth
                                        defaultValue={selectedSupplier?.phoneNumber}
                                        {...register('phoneNumber')}
                                        style={{
                                            marginBottom: 10
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormGroup >
                                        <FormControlLabel
                                            control={<Checkbox name="isIndividual" color="secondary" defaultChecked={selectedSupplier?.isIndividual === "yes"} {...register('isIndividual')} />}
                                            label={<Typography variant='p'>{tSupplier('individual_supplier')}</Typography>}
                                        />
                                    </FormGroup>
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
                <Button onClick={handleSave} color="secondary" type="submit" form="add-supplier-form">
                    {tGeneral('save')}
                </Button>
            </DialogActions>
        </Dialog>
    )

}

AddEditSupplierDialog.propTypes = {
    handleClose: PropTypes.func.isRequired,
    handleAddDone: PropTypes.func,
    handleUpdateDone: PropTypes.func,
    open: PropTypes.bool.isRequired,
    selectedSupplier: PropTypes.object,
}

AddEditSupplierDialog.defaultProps = {
    handleClose: () => { },
    handleAddDone: () => { },
    handleUpdateDone: () => { },
    open: false,
    selectedSupplier: null,
}

export default AddEditSupplierDialog;