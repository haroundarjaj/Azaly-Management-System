import React, { useEffect, useState } from "react";
import { Button, Grid, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import ProfilePicture from "profile-picture";
import "profile-picture/build/ProfilePicture.css";
import ClientService from "src/app/services/ClientService";
import { useForm } from "react-hook-form";

const profilePictureRef = React.createRef();

function AddEditClientDialog(props) {
    const { t } = useTranslation('clientsPage');

    const {
        handleClose,
        handleAddDone,
        handleUpdateDone,
        open,
        selectedClient
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
        console.log(imageAsDataURL);
        console.log(PP.getData());
        console.log(data);
        const client = {
            ...data,
            image: null
        }
        if (PP.getData().imageSrc) {
            client.image = imageAsDataURL;
        }
        if (selectedClient) {
            client.id = selectedClient.id;
            ClientService.update(client).then(({ data }) => {
                console.log(data);
                handleUpdateDone(data);
            })
        } else {
            ClientService.add(client).then(({ data }) => {
                console.log(data);
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
        if (open && !selectedClient) {
            reset({
                firstName: '',
                lastName: '',
                phoneNumber: '',
                email: '',
                address: ''
            });
        } else reset(selectedClient);
    }, [open])

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle>
                <Typography variant="h5" color="secondary">
                    {t('add_title')}
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Typography variant="h6" style={{ marginBottom: 20 }}>
                    {t('add_desc')}
                </Typography>
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
                            image={selectedClient?.image}
                            useHelper
                            frameFormat='circle'
                            frameSize={200}
                            cropSize={200}
                            onStatusChange={handleError}
                            minImageSize={200}
                            messages={
                                {
                                    DEFAULT: t('user.image.tap'),
                                    DRAGOVER: t('user.image.drop'),
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
                            id="add-client-form"
                            onSubmit={handleSubmit(handleSave)}
                        >
                            <Grid
                                container
                                spacing={1}
                            >
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        id="firstName"
                                        label="firstName"
                                        variant="outlined"
                                        name="firstName"
                                        required
                                        fullWidth
                                        defaultValue={selectedClient?.firstName}
                                        {...register('firstName')}
                                        style={{
                                            marginBottom: 10
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        id="lastName"
                                        label="lastName"
                                        variant="outlined"
                                        name="lastName"
                                        required
                                        fullWidth
                                        defaultValue={selectedClient?.lastName}
                                        {...register('lastName')}
                                        style={{
                                            marginBottom: 10
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        id="email"
                                        label="email"
                                        variant="outlined"
                                        name="email"
                                        required
                                        fullWidth
                                        defaultValue={selectedClient?.email}
                                        {...register('email')}
                                        style={{
                                            marginBottom: 10
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        id="phoneNumber"
                                        label="phoneNumber"
                                        variant="outlined"
                                        name="phoneNumber"
                                        type="number"
                                        required
                                        fullWidth
                                        defaultValue={selectedClient?.phoneNumber}
                                        {...register('phoneNumber')}
                                        style={{
                                            marginBottom: 10
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        id="address"
                                        label="address"
                                        variant="outlined"
                                        name="address"
                                        multiline
                                        required
                                        fullWidth
                                        inputProps={{
                                            style: {
                                                height: 81,
                                                overflow: "auto"
                                            },
                                        }}
                                        defaultValue={selectedClient?.address}
                                        {...register('address')}
                                        style={{
                                            marginBottom: 10
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </form>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>
                    Close
                </Button>
                <Button onClick={handleSave} color="secondary" type="submit" form="add-client-form">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    )

}

AddEditClientDialog.propTypes = {
    handleClose: PropTypes.func.isRequired,
    handleAddDone: PropTypes.func,
    handleUpdateDone: PropTypes.func,
    open: PropTypes.bool.isRequired,
    selectedClient: PropTypes.object,
}

AddEditClientDialog.defaultProps = {
    handleClose: () => { },
    handleAddDone: () => { },
    handleUpdateDone: () => { },
    open: false,
    selectedClient: null,
}

export default AddEditClientDialog;