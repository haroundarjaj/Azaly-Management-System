import React, { useEffect, useState } from "react";
import { Button, Grid, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography, FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { makeStyles } from '@mui/styles';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import ProfilePicture from "profile-picture";
import "profile-picture/build/ProfilePicture.css";
import UserService from "src/app/services/UserService";
import { useForm } from "react-hook-form";
import RoleService from "src/app/services/RoleService";
import AutoComplete from "app/theme-layouts/shared-components/AutoComplete";

const profilePictureRef = React.createRef();

// const useStyles = makeStyles((theme) => ({
//     dialog: {
//         // the dropdown is next to the dialog root, not inside
//         "& + .pac-container": {
//             zIndex: `999999 !important`
//         }
//     }
// }));

function AddEditUserDialog(props) {
    const tUser = useTranslation('usersPage').t;
    const tGeneral = useTranslation('generalTranslations').t;

    // const classes = useStyles();

    const {
        handleClose,
        handleAddDone,
        handleUpdateDone,
        open,
        selectedUser
    } = props;

    const [rolesList, setRolesList] = useState([]);
    const [rolesSelected, setRolesSelected] = useState([]);

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
        const user = {
            ...data,
            image: null,
            isIndividual: data.isIndividual ? "yes" : "no"
        }
        if (PP.getData().imageSrc) {
            user.image = imageAsDataURL;
        }
        if (selectedUser) {
            user.id = selectedUser.id;
            let rolesIds = rolesSelected.map(role => (role.id))
            user.roles = rolesIds;
            UserService.update(user).then(({ data }) => {
                handleUpdateDone(data);
            })
        } else {
            UserService.add(user).then(({ data }) => {
                handleAddDone(data);
            })
        }
    }

    const handleError = (status) => {
        if (status === 'INVALID_FILE_TYPE') {

        } else if (status === 'INVALID_IMAGE_SIZE') {

        }
    };

    const handleChangeRoles = (roles) => {
        setRolesSelected(roles);
    };

    useEffect(() => {
        RoleService.getAll().then((response) => {
            setRolesList(response.data);
            console.log(response.data);
        })
    }, [])

    useEffect(() => {
        if (open && selectedUser) {
            reset(selectedUser);
            console.log(selectedUser);
            const roles = [];
            selectedUser.roles.forEach(code => {
                roles.push(rolesList.filter(elem => elem.code === code)[0]);
            })
            setRolesSelected(roles);
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
            // className={classes.dialog}
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle>
                <Typography variant="subtitle1" color="secondary">
                    {selectedUser ? tUser('edit_title') : tUser('add_title')}
                </Typography>
                <Typography variant="subtitle2" style={{ marginBottom: 20 }}>
                    {selectedUser ? tUser('edit_desc') : tUser('add_desc')}
                </Typography>
            </DialogTitle>
            <DialogContent style={{ paddingTop: 5 }}>
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
                            image={selectedUser?.image}
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
                            id="add-user-form"
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
                                            defaultValue={selectedUser?.firstName}
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
                                            defaultValue={selectedUser?.lastName}
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
                                        defaultValue={selectedUser?.address}
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
                                        required
                                        fullWidth
                                        defaultValue={selectedUser?.email}
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
                                        defaultValue={selectedUser?.phoneNumber}
                                        {...register('phoneNumber')}
                                        style={{
                                            marginBottom: 10
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    {console.log(rolesList)}
                                    <AutoComplete
                                        multiple
                                        // limitTags={2}
                                        id="tags-outlined"
                                        options={rolesList}
                                        getOptionLabel={(option) => option?.name}
                                        getOptionSelected={(option, value) =>
                                            option.id === value.id
                                        }
                                        onChange={(e, newValue) =>
                                            handleChangeRoles(newValue)
                                        }
                                        value={rolesSelected}
                                        fullWidth
                                        filterSelectedOptions
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant="outlined"
                                                label={tUser('roles')}
                                            />
                                        )}
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
                <Button onClick={handleSave} color="secondary" type="submit" form="add-user-form">
                    {tGeneral('save')}
                </Button>
            </DialogActions>
        </Dialog>
    )

}

AddEditUserDialog.propTypes = {
    handleClose: PropTypes.func.isRequired,
    handleAddDone: PropTypes.func,
    handleUpdateDone: PropTypes.func,
    open: PropTypes.bool.isRequired,
    selectedUser: PropTypes.object,
}

AddEditUserDialog.defaultProps = {
    handleClose: () => { },
    handleAddDone: () => { },
    handleUpdateDone: () => { },
    open: false,
    selectedUser: null,
}

export default AddEditUserDialog;