import React, { useEffect, useState } from "react";
import { Button, Grid, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography, FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import ProfilePicture from "profile-picture";
import "profile-picture/build/ProfilePicture.css";
import ClientService from "src/app/services/ClientService";
import { useForm } from "react-hook-form";

const profilePictureRef = React.createRef();

function AddEditClientDialog(props) {
    const tClient = useTranslation('clientsPage').t;
    const tGeneral = useTranslation('generalTranslations').t;

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
        const client = {
            ...data,
            image: null,
            isIndividual: data.isIndividual ? "yes" : "no"
        }
        if (PP.getData().imageSrc) {
            client.image = imageAsDataURL;
        }
        if (selectedClient) {
            client.id = selectedClient.id;
            ClientService.update(client).then(({ data }) => {
                handleUpdateDone(data);
            })
        } else {
            ClientService.add(client).then(({ data }) => {
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
        if (open && selectedClient) {
            reset(selectedClient);
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
                    {selectedClient ? tClient('edit_title') : tClient('add_title')}
                </Typography>
                <Typography variant="subtitle2" style={{ marginBottom: 20 }}>
                    {selectedClient ? tClient('edit_desc') : tClient('add_desc')}
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
                            image={selectedClient?.image}
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
                            id="add-client-form"
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
                                            defaultValue={selectedClient?.firstName}
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
                                            required
                                            fullWidth
                                            defaultValue={selectedClient?.lastName}
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
                                        defaultValue={selectedClient?.address}
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
                                        label={tGeneral("phone_number")}
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
                                <Grid item xs={12} md={6}>
                                    <FormGroup >
                                        <FormControlLabel
                                            control={<Checkbox name="isIndividual" color="secondary" defaultChecked={selectedClient?.isIndividual === "yes"} {...register('isIndividual')} />}
                                            label={<Typography variant='p'>{tClient('individual_client')}</Typography>}
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
                <Button onClick={handleSave} color="secondary" type="submit" form="add-client-form">
                    {tGeneral('save')}
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